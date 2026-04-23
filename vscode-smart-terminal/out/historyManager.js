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
const sqlite3 = __importStar(require("sqlite3"));
const path = __importStar(require("path"));
class HistoryManager {
    constructor(storagePath) {
        const dbPath = path.join(storagePath, 'command_history.db');
        this.db = new sqlite3.Database(dbPath);
        this.initDatabase();
    }
    /**
     * Initialize the database schema
     */
    initDatabase() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS command_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                command TEXT NOT NULL,
                cwd TEXT NOT NULL,
                exitCode INTEGER,
                duration INTEGER,
                timestamp INTEGER NOT NULL
            )
        `);
        // Create index for faster searching
        this.db.run(`
            CREATE INDEX IF NOT EXISTS idx_command_history_timestamp 
            ON command_history (timestamp)
        `);
    }
    /**
     * Add a command to history
     */
    addCommand(command, cwd, exitCode, duration) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO command_history (command, cwd, exitCode, duration, timestamp) VALUES (?, ?, ?, ?, ?)', [command, cwd, exitCode, duration, Date.now()], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Get command history
     */
    getHistory(limit = 100, offset = 0) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM command_history ORDER BY timestamp DESC LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    /**
     * Search command history
     */
    searchHistory(query, limit = 50) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM command_history WHERE command LIKE ? ORDER BY timestamp DESC LIMIT ?', [`%${query}%`, limit], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    /**
     * Clear command history
     */
    clearHistory() {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM command_history', (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
     * Close the database connection
     */
    close() {
        this.db.close();
    }
}
exports.HistoryManager = HistoryManager;
//# sourceMappingURL=historyManager.js.map