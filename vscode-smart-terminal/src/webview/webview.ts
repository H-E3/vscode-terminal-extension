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
                background: '#1e1e1e',
                foreground: '#d4d4d4',
                cursor: '#ffffff',
                cursorAccent: '#007acc',
                selection: 'rgba(255, 255, 255, 0.1)',
                black: '#0c0c0c',
                red: '#f48771',
                green: '#57ab5a',
                yellow: '#cca700',
                blue: '#0097e6',
                magenta: '#c397d8',
                cyan: '#36a3d9',
                white: '#cccccc',
                brightBlack: '#767676',
                brightRed: '#f48771',
                brightGreen: '#57ab5a',
                brightYellow: '#cca700',
                brightBlue: '#0097e6',
                brightMagenta: '#c397d8',
                brightCyan: '#36a3d9',
                brightWhite: '#f2f2f2'
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
        this.terminal.onData((data) => {
            // Handle terminal input
            console.log('Terminal data:', data);
            // For now, just echo back the input
            this.terminal.write(data);
        });

        this.terminal.onKey((event) => {
            // Handle key events
            console.log('Terminal key:', event);
        });

        this.terminal.onResize((size) => {
            console.log('Terminal resized:', size);
        });
    }

    private setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.fitAddon.fit();
        });
    }
}

// Initialize the terminal when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SmartTerminal();
});
