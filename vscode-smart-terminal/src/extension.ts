import * as vscode from 'vscode';
import { TerminalManager } from './terminalManager';
import { DirectorySync } from './directorySync';

export function activate(context: vscode.ExtensionContext) {
    const terminalManager = new TerminalManager(context);
    const directorySync = new DirectorySync(context);

    const openTerminalCommand = vscode.commands.registerCommand('smart-terminal.open', () => {
        terminalManager.openSmartTerminal();
    });

    context.subscriptions.push(openTerminalCommand);
}

export function deactivate() {
}
