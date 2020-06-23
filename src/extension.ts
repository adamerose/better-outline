import * as vscode from "vscode";
import CustomTreeDataProvider from "./CustomTreeDataProvider";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage("Better Outline is now active!");

    // Define commands and add their disposables to subscriptions for cleanup
    [
        vscode.commands.registerCommand('betterOutline.helloWorld', () => {
            vscode.window.showInformationMessage('Hello World from Better Outline!');
        }),
        vscode.commands.registerCommand("betterOutline.refreshTree", () => {
            customTreeDataProvider.refresh();
        }),
        vscode.commands.registerCommand("betterOutline.jumpTo", (lineNumber) => {
            vscode.window.showInformationMessage('jumpTo' + lineNumber);
            vscode.window.activeTextEditor?.revealRange(
                new vscode.Range(lineNumber, 0, lineNumber, 5),
                vscode.TextEditorRevealType.AtTop
            );
        }),
    ].forEach(disposable => {
        context.subscriptions.push(disposable);
    });

    // Set up the TreeView to show our outline for the current file
    const customTreeDataProvider = new CustomTreeDataProvider();
    vscode.window.createTreeView("betterOutline", {
        treeDataProvider: customTreeDataProvider,
    });

}

// This method is called when your extension is deactivated
export function deactivate() { }
