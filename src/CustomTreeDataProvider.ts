import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Command } from "vscode";
import { isNullOrUndefined } from "util";
import patterns from "./patterns";

type Pattern = {
  match: string;
  label: string;
  description: string;
  level: number;
};

export class CustomTreeDataProvider implements vscode.TreeDataProvider<CustomTreeItem> {
  getTreeItem(element: CustomTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CustomTreeItem): Thenable<CustomTreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      // Build the list of root tree entries
      let treeItems: CustomTreeItem[] = [];
      let rawText = vscode.window.activeTextEditor?.document.getText().replace(/\r\n/g, "\n")!;
      // Loop over all regex patterns
      patterns?.forEach((pattern) => {
        let re = new RegExp(pattern.match, "g");

        // Loop over each match, extracting the text and line number
        let match;
        while ((match = re.exec(rawText)) != null) {
          let matchLineNumber = rawText.slice(0, match.index).split("\n").length; // Line number of the full match

          let index = match.index + match[0].indexOf(match[1]); // Index of the label (capture group)
          let labelLineNumber = rawText.slice(0, index).split("\n").length; // Line number of the label
          let matchText = match[0];
          let labelText = match[1] || matchText;
          let description = "";
          //   let description = pattern.description;

          let offset = matchLineNumber - labelLineNumber; // Offset between match and lebel

          if (!treeItems.map((x) => x.labelLineNumber).includes(labelLineNumber)) {
            let treeItem = new CustomTreeItem(labelLineNumber, labelText, description, offset);
            treeItems.push(treeItem);
          }
        }
      });

      return Promise.resolve(treeItems.sort((a, b) => a.labelLineNumber - b.labelLineNumber));
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    CustomTreeItem | undefined
  > = new vscode.EventEmitter<CustomTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<CustomTreeItem | undefined> = this._onDidChangeTreeData
    .event;
}

class CustomTreeItem extends vscode.TreeItem {
  constructor(
    public labelLineNumber: number,
    public readonly label: string,
    public readonly description: string = "",
    public readonly jumpToOffset: number = 0, // This is so I can show the whole header text instead of just the line with the label
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);

    this.command = {
      title: "TreeItemOnClick",
      command: "betterOutline.jumpTo",
      arguments: [labelLineNumber + jumpToOffset],
    };

    this.iconPath = {
      light: path.join(__filename, "..", "..", "resources", "light", "icons8-tag-window-40.png"),
      dark: path.join(__filename, "..", "..", "resources", "dark", "icons8-tag-window-40.png"),
    };
  }
}

export default CustomTreeDataProvider;
