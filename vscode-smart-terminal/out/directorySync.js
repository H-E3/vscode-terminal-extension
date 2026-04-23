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
exports.DirectorySync = void 0;
const vscode = __importStar(require("vscode"));
class DirectorySync {
    constructor(context) {
        this.context = context;
        this.setupEventListeners();
    }
    /**
     * Setup event listeners for directory changes
     */
    setupEventListeners() {
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
    syncTerminalToDirectory(directoryPath) {
        if (this.terminal) {
            // Send cd command to terminal
            this.terminal.sendText(`cd "${directoryPath}"`, true);
        }
    }
    /**
     * Sync VSCode explorer to terminal's current directory
     */
    syncExplorerToTerminal() {
        // This would require shell integration to get current directory
        // For now, we'll just log the intent
        console.log('Syncing explorer to terminal directory');
    }
    /**
     * Get directory path from file path
     */
    getDirectoryPath(filePath) {
        const path = require('path');
        return path.dirname(filePath);
    }
    /**
     * Set the active terminal for synchronization
     */
    setTerminal(terminal) {
        this.terminal = terminal;
    }
}
exports.DirectorySync = DirectorySync;
//# sourceMappingURL=directorySync.js.map