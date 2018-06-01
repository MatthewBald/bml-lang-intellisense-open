import * as vscode from 'vscode';

export class BMLSignatureHelpProvider implements vscode.SignatureHelpProvider {

	private _disposable: vscode.Disposable;
	private _keywords: any;
	private _signatures: Map<String, vscode.SignatureHelp>;
	private _lastWord: Array<String>;
	
	constructor(keywords) {
		this._keywords = keywords;
		this._signatures = new Map<String, vscode.SignatureHelp>();
		this._lastWord = new Array<String>();
		this.buildHoverProviderLists();
	}
	
	public getKeywords() {
		return this._keywords;
	}
	
	public setKeywords(keywords) {
		this._keywords = keywords;
	}
	
	public provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.SignatureHelp> {
		
		try {
			
			let line = document.getText(new vscode.Range(position.line, 0, position.line, Number.MAX_SAFE_INTEGER));
			
			// Avoid range errors when translating position
			if (position.character < 1) {
				console.log("Character position too small, returning");
				return;
			}
			
			let pos = position.translate({ lineDelta: 0, characterDelta: -1 });
			
			let lastCharEntered = document.getText(new vscode.Range(pos, position));
			
			// End on semicolon entered
			if (lastCharEntered === ";") return;
			
			let wordRange: vscode.Range = document.getWordRangeAtPosition(pos);
			
			// This worked for 1 space -- Might be able to use a while loop to 
			// translate until we have a valid range
			// while (!wordRange) { ... }
			while (!wordRange) {
				pos = pos.translate({ lineDelta: 0, characterDelta: -1 });
				wordRange = document.getWordRangeAtPosition(pos);
			}
			
			if (wordRange) {
				let word: String = document.getText(wordRange);
				
				
				if (!this._signatures.has(word)) {
					word = this._lastWord[this._lastWord.length - 1];
				}
				else {
					console.log("Appending '" + word + "' to lastWord list");
					this._lastWord.push(word);
				}
				
				// util.softError(ex, ex2, ex3) 
				// slice out softError(ex, ex2, ex3)
				let startTrimmedFn: String = line.slice(line.indexOf(word.toString()), Number.MAX_SAFE_INTEGER);
				let trimmedFn: String = startTrimmedFn.slice(0, startTrimmedFn.lastIndexOf(")") + 1);
				
				let parameters: String = trimmedFn.slice(trimmedFn.indexOf("(") + 1, trimmedFn.lastIndexOf(")"));
				
				let currentParameterNum = parameters.split(",").length - 1;
				
				if (this._signatures.has(word)) {
						
					let curSig = this._signatures.get(word);
					let totalParameters = curSig.signatures[0].parameters.length - 1
					
					if (currentParameterNum > totalParameters) {
						let temp = this._lastWord.pop();
						if (!temp) return;
						
						word = this._lastWord[this._lastWord.length - 1];
						
						if (this._signatures.has(word)) {
							curSig = this._signatures.get(word);
						}
					}
					else if (totalParameters === currentParameterNum && lastCharEntered === ")")
						return;
						
					curSig.activeParameter = currentParameterNum;
					curSig.activeSignature = 0;
					return Promise.resolve(curSig);
				}
			}
		}
		catch (err) {
			vscode.window.showErrorMessage("Caught exception in SignatureHelpProvider");
			console.log("Caught an error in SignatureHelpProvider");
			console.log(err);
			return Promise.resolve(null);
		}
	}
	
	private buildHoverProviderLists() {
		
		this._keywords.forEach(element => {
			if (element.detail !== '') {
				
				let debug = (element.label === "approvalCalc"); 
				let str: String = element.detail;
				
				let sigHelp: vscode.SignatureHelp = new vscode.SignatureHelp();
				sigHelp.signatures = [new vscode.SignatureInformation(str.toString())];
				
				let parameters: Array<String> = str.substr(str.indexOf("(")+1, str.indexOf(")")).split(", ");
				
				parameters.forEach(param => {
					let signature = param.toString();
					
					sigHelp.signatures[0].parameters.push(new vscode.ParameterInformation(signature, ""));
				});
				
				this._signatures.set(element.label, sigHelp);
			}
		});
	}
	
	dispose() {
		this._disposable.dispose();
	}

}