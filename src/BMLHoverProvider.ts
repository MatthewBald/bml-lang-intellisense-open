import * as vscode from 'vscode';

export class BMLHoverProvider implements vscode.HoverProvider {
	
	private _hoverMap: Map<String, vscode.Hover>;
	private _keywords;
	
	constructor(keywords) {
		this._keywords = keywords;
		this._hoverMap = new Map<String, vscode.Hover>();
		this.buildHoverProviderLists()
	}
	
	public getKeywords() {
		return this._keywords;
	}
	
	public setKeywords(keywords) {
		this._keywords = keywords;
	}
	
	public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Hover> {
		let wdRange: vscode.Range = document.getWordRangeAtPosition(position);
		let prevWord = document.getText(wdRange);
		let hoverInfo = this._hoverMap.get(prevWord);
		
		return Promise.resolve(hoverInfo);
	}
	
	private buildHoverProviderLists() {
		
		this._keywords.forEach(element => {
			if (element.documentation !== '' || element.detail !== '') {
				
				let tempArr: Array<vscode.MarkedString> = new Array<vscode.MarkedString>();
				
				let header: vscode.MarkedString = {
					language: 'bml',
					value: element.detail
				};
				
				let doc: vscode.MarkedString = {
					language: 'bml',
					value: element.documentation
				};
				
				if (header.value.length > 0)
					tempArr.push(header);
				
				if (doc.value.length > 0)
					tempArr.push(doc);
				
				this._hoverMap.set(element.label, new vscode.Hover(tempArr));
			}
		});
	}
}