// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import * as vscode from 'vscode';
import { BMLCompletionItemProvider } from './BMLCompletionItemProvider';
// import { BMLSignatureHelpProvider } from './BMLSignatureHelpProvider';
import { BMLHoverProvider } from './BMLHoverProvider';
import { FileReader } from './FileReader';

const GO_MODE: vscode.DocumentFilter = { language: 'bml', scheme: 'file' };

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: vscode.ExtensionContext) {
	
	// Parse the JSON file
	let keywords = new FileReader().readFile("../../keywords.json", "utf8").getContentAsJSON();
	
	if (keywords === "Error") {
		vscode.window.showErrorMessage("bml-lang-intellisense error:\nThere was a problem reading keywords.json. Make sure that keywords.json is found in the extension directory and that it is valid JSON.");
		return;
	}
	
	let autocomplete = new BMLCompletionItemProvider(keywords);
	let hoverProvider = new BMLHoverProvider(keywords);
	//let signatureProvider = new BMLSignatureHelpProvider(keywords);
	
	// Add to a list of disposables which are disposed when this extension is deactivated.
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('bml', autocomplete, '.', '\"'));
	context.subscriptions.push(vscode.languages.registerHoverProvider('bml', hoverProvider));
	//context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('bml', signatureProvider, '(', ','));
}