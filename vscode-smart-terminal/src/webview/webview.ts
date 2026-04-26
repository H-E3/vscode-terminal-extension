import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';
import { BlockManager } from '../blockManager';
import { ShellIntegration } from '../shellIntegration';

class SmartTerminal {
    private terminal: Terminal;
    private fitAddon: FitAddon;
    private blockManager: BlockManager;

    constructor() {
        this.terminal = new Terminal({
            theme: {
                background: '#ffffff',
                foreground: '#000000',
                cursor: '#000000',
                cursorAccent: '#007acc',
                black: '#000000',
                red: '#e74c3c',
                green: '#27ae60',
                yellow: '#f39c12',
                blue: '#3498db',
                magenta: '#9b59b6',
                cyan: '#1abc9c',
                white: '#ecf0f1',
                brightBlack: '#95a5a6',
                brightRed: '#e74c3c',
                brightGreen: '#27ae60',
                brightYellow: '#f39c12',
                brightBlue: '#3498db',
                brightMagenta: '#9b59b6',
                brightCyan: '#1abc9c',
                brightWhite: '#ecf0f1'
            },
            fontSize: 14,
            fontFamily: 'Consolas, Menlo, Monaco, "Courier New", monospace',
            cursorBlink: true,
            cursorStyle: 'block',
            scrollback: 10000,
            tabStopWidth: 4
        });

        this.fitAddon = new FitAddon();
        const webglAddon = new WebglAddon();

        this.terminal.loadAddon(this.fitAddon);
        this.terminal.loadAddon(webglAddon);

        this.blockManager = new BlockManager(this.terminal);

        this.initializeTerminal();
        this.setupEventListeners();
        this.setupResizeHandler();
    }

    private initializeTerminal() {
        const terminalElement = document.getElementById('terminal');
        if (terminalElement) {
            this.terminal.open(terminalElement);
            this.fitAddon.fit();
            this.terminal.writeln('Welcome to Smart Terminal!');
            this.terminal.writeln('This is a modern terminal for VSCode with block-based architecture.');
            this.terminal.writeln('');
            this.terminal.writeln('Type commands below:');
            this.terminal.writeln('');
            this.terminal.write('$ ');
        }

        // Notify extension that terminal is ready
        if (typeof acquireVsCodeApi !== 'undefined') {
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ command: 'terminalReady' });
        }
    }

    private setupEventListeners() {
        let currentCommand = '';

        this.terminal.onData((data) => {
            // Handle terminal input
            if (data === '\r') { // Enter key
                // Start a new command block
                this.blockManager.startBlock();
                // Add command to block
                this.blockManager.addCommand(currentCommand);
                // Execute command (simulated)
                this.executeCommand(currentCommand);
                // Reset current command
                currentCommand = '';
                // Move to next line and show prompt
                this.terminal.writeln('');
                this.terminal.write('$ ');
            } else if (data === '\b') { // Backspace
                if (currentCommand.length > 0) {
                    currentCommand = currentCommand.slice(0, -1);
                    this.terminal.write('\b \b');
                }
            } else if (data.charCodeAt(0) >= 32 && data.charCodeAt(0) <= 126) { // Printable characters
                currentCommand += data;
                this.terminal.write(data);
            }
        });

        this.terminal.onKey((event) => {
            // Handle key events
            console.log('Terminal key:', event);
        });

        this.terminal.onResize((size) => {
            console.log('Terminal resized:', size);
        });
    }

    private executeCommand(command: string) {
        // Simulate command execution
        setTimeout(() => {
            const output = `Command executed: ${command}`;
            this.terminal.writeln(output);
            this.blockManager.addOutput(output);
            this.blockManager.endBlock(0); // 0 exit code for success
        }, 500);
    }

    private setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.fitAddon.fit();
        });
    }
}

// Declare acquireVsCodeApi for TypeScript
declare function acquireVsCodeApi(): any;

// Initialize the terminal when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SmartTerminal();
});
