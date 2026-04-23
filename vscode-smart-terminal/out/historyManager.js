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
exports.HistoryManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class HistoryManager {
    constructor(storagePath) {
        this.historyPath = path.join(storagePath, 'command_history.json');
        this.history = this.loadHistory();
    }
    /**
     * Load history from file
     */
    loadHistory() {
        try {
            if (fs.existsSync(this.historyPath)) {
                const data = fs.readFileSync(this.historyPath, 'utf8');
                return JSON.parse(data);
            }
        }
        catch (error) {
            console.error('Error loading history:', error);
        }
        return [];
    }
    /**
     * Save history to file
     */
    saveHistory() {
        try {
            // Ensure the directory exists
            const dir = path.dirname(this.historyPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.historyPath, JSON.stringify(this.history, null, 2));
        }
        catch (error) {
            console.error('Error saving history:', error);
        }
    }
    /**
     * Add a command to history
     */
    addCommand(command, cwd, exitCode, duration) {
        return new Promise((resolve) => {
            const newEntry = {
                id: this.history.length > 0 ? Math.max(...this.history.map(h => h.id)) + 1 : 1,
                command,
                cwd,
                exitCode,
                duration,
                timestamp: Date.now()
            };
            this.history.unshift(newEntry);
            // Keep only the last 1000 entries to prevent the file from getting too large
            if (this.history.length > 1000) {
                this.history = this.history.slice(0, 1000);
            }
            this.saveHistory();
            resolve();
        });
    }
    /**
     * Get command history
     */
    getHistory(limit = 100, offset = 0) {
        return new Promise((resolve) => {
            const result = this.history.slice(offset, offset + limit);
            resolve(result);
        });
    }
    /**
     * Search command history
     */
    searchHistory(query, limit = 50) {
        return new Promise((resolve) => {
            const result = this.history
                .filter(entry => entry.command.includes(query))
                .slice(0, limit);
            resolve(result);
        });
    }
    /**
     * Clear command history
     */
    clearHistory() {
        return new Promise((resolve) => {
            this.history = [];
            this.saveHistory();
            resolve();
        });
    }
    /**
     * Close the history manager
     */
    close() {
        // No need to close anything for file-based storage
    }
}
exports.HistoryManager = HistoryManager;
//# sourceMappingURL=historyManager.js.map