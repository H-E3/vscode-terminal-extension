import * as vscode from 'vscode';

export class DirectorySync {
    private context: vscode.ExtensionContext;
    private terminal: vscode.Terminal | undefined;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for directory changes
     */
    private setupEventListeners() {
        // Listen for active text editor changes (resource manager navigation)
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                const filePath = editor.document.uri.fsPath;
                const directoryPath = this.getDirectoryPath(filePath);
                this.syncTerminalToDirectory(directoryPath);
            }
        });

        // Listen for terminal changes
        vscode.window.onDidChangeActiveTerminal((terminal) => {
            if (terminal) {
                this.terminal = terminal;
            }
        });
    }

    /**
     * Sync terminal to specified directory
     */
    public syncTerminalToDirectory(directoryPath: string) {
        if (this.terminal) {
            // Send cd command to terminal
            this.terminal.sendText(`cd "${directoryPath}"`, true);
        }
    }

    /**
     * Sync VSCode explorer to terminal's current directory
     */
    public syncExplorerToTerminal() {
        // This would require shell integration to get current directory
        // For now, we'll just log the intent
        console.log('Syncing explorer to terminal directory');
    }

    /**
     * Get directory path from file path
     */
    private getDirectoryPath(filePath: string): string {
        const path = require('path');
        return path.dirname(filePath);
    }

    /**
     * Set the active terminal for synchronization
     */
    public setTerminal(terminal: vscode.Terminal) {
        this.terminal = terminal;
    }
}
