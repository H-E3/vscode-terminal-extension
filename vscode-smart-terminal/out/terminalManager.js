"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalManager = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const historyManager_1 = require("./historyManager");
class TerminalManager {
    constructor(context) {
        this.context = context;
        this.historyManager = new historyManager_1.HistoryManager(context.globalStoragePath);
    }
    openSmartTerminal() {
        if (this.panel) {
            this.panel.reveal();
            return;
        }
        this.panel = vscode.window.createWebviewPanel('smartTerminal', 'Smart Terminal', vscode.ViewColumn.Beside, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'webview'))
            ]
        });
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
    getWebviewContent() {
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
    getWebviewUri(fileName) {
        const filePath = path.join('out', 'webview', fileName);
        return vscode.Uri.file(path.join(this.context.extensionPath, filePath))
            .with({ scheme: 'vscode-resource' })
            .toString();
    }
}
exports.TerminalManager = TerminalManager;
//# sourceMappingURL=terminalManager.js.map