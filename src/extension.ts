import * as vscode from "vscode";
import CustomTreeDataProvider from "./CustomTreeDataProvider";
import { getCommentSymbols } from "./symbols";

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Better Outline is now active!");

  [
    // Commands
    vscode.commands.registerCommand("betterOutline.helloWorld", () => {
      vscode.window.showInformationMessage("Hello World from Better Outline!");
    }),
    vscode.commands.registerCommand("betterOutline.refreshTree", () => {
      customTreeDataProvider.refresh();
    }),
    vscode.commands.registerCommand("betterOutline.jumpTo", (lineNumber) => {
      vscode.window.activeTextEditor?.revealRange(
        new vscode.Range(lineNumber - 1, 0, lineNumber - 1, 0),
        vscode.TextEditorRevealType.AtTop
      );
    }),

    vscode.commands.registerCommand("betterOutline.addDivider1", () => {
      addDivider(1);
    }),
    vscode.commands.registerCommand("betterOutline.addDivider2", () => {
      addDivider(2);
    }),
    vscode.commands.registerCommand("betterOutline.addDivider3", () => {
      addDivider(3);
    }),

    // Event Listeners
    vscode.workspace.onDidChangeTextDocument((e) => {
      customTreeDataProvider.refresh();
    }),
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      customTreeDataProvider.refresh();
    }),
  ].forEach((disposable) => {
    context.subscriptions.push(disposable);
  });

  // Set up the TreeView to show our outline for the current file
  const customTreeDataProvider = new CustomTreeDataProvider();
  vscode.window.createTreeView("betterOutline", {
    treeDataProvider: customTreeDataProvider,
  });
}

async function addDivider(lineCount: 1 | 2 | 3, lineWidth: number = 80) {
  vscode.window.showInformationMessage(`Added divider (${lineCount})`);
  // Get current text editor
  let editor = vscode.window.activeTextEditor;
  if (editor == undefined) { return; }

  // Get symbols to make comments for current language
  let lang = editor.document.languageId;
  let symbols = getCommentSymbols(lang);

  let initialSelection = editor.selection;
  // If no text is selected, select the whole line the cursor is on
  if (JSON.stringify(initialSelection.start) === JSON.stringify(initialSelection.end)) {
    initialSelection = new vscode.Selection(
      new vscode.Position(initialSelection.start.line, 0),
      new vscode.Position(initialSelection.start.line, 999)
    );
  }

  let initialText = editor.document.getText(initialSelection);
  let fillWidth = lineWidth - (symbols.left.length + symbols.right.length + 2);


  let fillLine = `${symbols.left} ${"=".repeat(fillWidth)} ${symbols.right}`;
  if (lineCount === 1) {
    var snippet = `${fillLine}\n${symbols.left} ${initialText}\n`;
    var positionToSetCursor = new vscode.Position(initialSelection.start.line - 1 + 2, 999);
  } else if (lineCount === 2) {
    var snippet = `${fillLine}\n${symbols.left} ${initialText}\n${fillLine}\n`;
    var positionToSetCursor = new vscode.Position(initialSelection.start.line - 1 + 3, 999);
  } else {
    throw Error("Not implemented");
  }


  await editor.edit(editBuilder => {
    editBuilder.replace(initialSelection, snippet);
  });
  let newSelection = new vscode.Selection(positionToSetCursor, positionToSetCursor);
  editor.selection = newSelection;

};

// This method is called when your extension is deactivated
export function deactivate() { }
