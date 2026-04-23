import * as vscode from 'vscode';
import { TerminalManager } from './terminalManager';

export function activate(context: vscode.ExtensionContext) {
    const terminalManager = new TerminalManager(context);

    const openTerminalCommand = vscode.commands.registerCommand('smart-terminal.open', () => {
        terminalManager.openSmartTerminal();
    });

    context.subscriptions.push(openTerminalCommand);
}

export function deactivate() {
}
