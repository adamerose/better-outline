import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Command } from "vscode";

export class CustomTreeDataProvider implements vscode.TreeDataProvider<CustomTreeItem> {

    getTreeItem(element: CustomTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CustomTreeItem): Thenable<CustomTreeItem[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            let rootTreeItems: CustomTreeItem[] = [];
            let currentTextDocument = vscode.window.activeTextEditor?.document;
            if (currentTextDocument) {
                for (let line = 0; line < currentTextDocument.lineCount; line++) {
                    let lineText = currentTextDocument.lineAt(line).text;
                    let treeItem = new CustomTreeItem(line, lineText);
                    rootTreeItems.push(treeItem);
                }
            }

            return Promise.resolve(rootTreeItems);
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    private _onDidChangeTreeData: vscode.EventEmitter<CustomTreeItem | undefined> = new vscode.EventEmitter<CustomTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<CustomTreeItem | undefined> = this._onDidChangeTreeData.event;
}

class CustomTreeItem extends vscode.TreeItem {
    constructor(
        private lineNumber: number,
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,

    ) {
        super(label, collapsibleState);
    }

    get tooltip(): string {
        return this.label;
    }

    get description(): string {
        return this.label;
    }

    get command(): Command {
        return {
            title: "TreeItemOnClick",
            command: "betterOutline.jumpTo",
            arguments: [this.lineNumber],
        };
    }

    iconPath = {
        light: path.join(__filename, "..", "..", "resources", "light", "CustomTreeItem.svg"),
        dark: path.join(__filename, "..", "..", "resources", "dark", "CustomTreeItem.svg"),
    };
}

export default CustomTreeDataProvider;
