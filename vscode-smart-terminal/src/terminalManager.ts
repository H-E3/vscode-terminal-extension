import * as vscode from 'vscode';
import * as path from 'path';
import { HistoryManager } from './historyManager';

export class TerminalManager {
    private context: vscode.ExtensionContext;
    private panel: vscode.WebviewPanel | undefined;
    private historyManager: HistoryManager;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.historyManager = new HistoryManager(context.globalStoragePath);
    }

    public openSmartTerminal() {
        if (this.panel) {
            this.panel.reveal();
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'smartTerminal',
            'Smart Terminal',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'webview'))
                ]
            }
        );

        this.panel.webview.html = this.getWebviewContent();

        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });

        this.panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'terminalReady':
                    console.log('Terminal webview ready');
                    break;
            }
        });
    }

    private getWebviewContent(): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Smart Terminal</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }
                #terminal-container {
                    width: 100%;
                    height: 100%;
                    background-color: #1e1e1e;
                }
                #terminal {
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <div id="terminal-container">
                <div id="terminal"></div>
            </div>
            <script src="${this.getWebviewUri('webview.js')}"></script>
        </body>
        </html>
        `;
    }

    private getWebviewUri(fileName: string): string {
        const filePath = path.join('out', 'webview', fileName);
        const fileUri = vscode.Uri.file(path.join(this.context.extensionPath, filePath));
        return this.panel?.webview.asWebviewUri(fileUri)?.toString() || '';
    }
}
