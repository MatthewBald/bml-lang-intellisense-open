import * as vscode from 'vscode';

export class BMLCompletionItemProvider implements vscode.CompletionItemProvider {
	
	private _disposable: vscode.Disposable;
	private _keywords: any;
	private _list: Array<vscode.CompletionItem>;
	private _listCommerce: Array<vscode.CompletionItem>;
	private _listUtil: Array<vscode.CompletionItem>;
	
	//constructor, read in items from keywords.json
	constructor(keywords) {
		this._keywords = keywords;
		this._list = new Array<vscode.CompletionItem>();
		this._listCommerce = new Array<vscode.CompletionItem>();
		this._listUtil = new Array<vscode.CompletionItem>();
		this.buildAutocompleteLists();
	}
	
	public getKeywords() {
		return this._keywords;
	}
	
	public setKeywords(keywords) {
		this._keywords = keywords;
	}
	
	private buildAutocompleteLists() {
		
		this._keywords.forEach(element => {
			let newItem = new vscode.CompletionItem(element.label, this.getKind(element.kind));
			let newItem2 = new vscode.CompletionItem(element.label, this.getKind(element.kind));
			
			newItem.detail = element.detail;
			newItem.documentation = element.documentation;
			newItem.insertText = element.insertText;
			
			newItem2.detail = element.detail;
			newItem2.documentation = element.documentation;
			newItem2.insertText = element.insertText;
			
			// Also add util/commerce libs to the other list with util./commerce.
			// prepended to their insertText	
			if (element.childOf === "commerce") {
				this._listCommerce.push(newItem);
				newItem2.insertText = "commerce." + newItem.insertText;
			}
			else if (element.childOf === "util") {
				this._listUtil.push(newItem);
				newItem2.insertText = "util." + newItem.insertText;
			}
			
			this._list.push(newItem2);
		});
	}
	
	public provideCompletionItems(
		document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
			try {
				
				let prevWord:  String = "";
				let prevWord2: String = "";
				
				if (position.character > 0) {
					
					let wdRange: vscode.Range = document.getWordRangeAtPosition(position.translate({ characterDelta: -1 }));
					
					if (wdRange) {
						prevWord = document.getText(wdRange);
						
						if (wdRange.start.character > 0) {
							let wdRange2 = document.getWordRangeAtPosition(new vscode.Position(wdRange.start.line, wdRange.start.character - 1));
							prevWord2 = document.getText(wdRange2);
						}
					}
				}
				
				if (prevWord.toLowerCase() === "commerce" || prevWord2.toLowerCase() === "commerce") {
					return Promise.resolve(this._listCommerce);
				}
				
				else if (prevWord.toLowerCase() === "util" || prevWord2.toLowerCase() === "util") {
					return Promise.resolve(this._listUtil);
				}
				
			}
			catch (e) {
				console.log(e);
			}
			
			return Promise.resolve(this._list);
		}
	
	dispose() {
		this._disposable.dispose();
	}
	
	public getKind(text: String): vscode.CompletionItemKind {
		let val: vscode.CompletionItemKind;
		switch (text) {
			case "Text":
				val = vscode.CompletionItemKind.Text;
				break;
			case "Method":
				val = vscode.CompletionItemKind.Method;
				break;
			case "Function":
				val = vscode.CompletionItemKind.Function;
				break;
			case "Constructor":
				val = vscode.CompletionItemKind.Constructor;
				break;
			case "Field":
				val = vscode.CompletionItemKind.Field;
				break;
			case "Variable":
				val = vscode.CompletionItemKind.Variable;
				break;
			case "Class":
				val = vscode.CompletionItemKind.Class;
				break;
			case "Interface":
				val = vscode.CompletionItemKind.Interface;
				break;
			case "Module":
				val = vscode.CompletionItemKind.Module;
				break;
			case "Property":
				val = vscode.CompletionItemKind.Property;
				break;
			case "Unit":
				val = vscode.CompletionItemKind.Unit;
				break;
			case "Value":
				val = vscode.CompletionItemKind.Value;
				break;
			case "Enum":
				val = vscode.CompletionItemKind.Enum;
				break;
			case "Keyword":
				val = vscode.CompletionItemKind.Keyword;
				break;
			case "Snippet":
				val = vscode.CompletionItemKind.Snippet;
				break;
			case "Color":
				val = vscode.CompletionItemKind.Color;
				break;
			case "File":
				val = vscode.CompletionItemKind.File;
				break;
			case "Reference":
				val = vscode.CompletionItemKind.Reference;
				break;
			
		}
		return val;
	}
	
}