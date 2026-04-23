import * as fs from 'fs';
import * as path from 'path';

export interface CommandHistory {
    id: number;
    command: string;
    cwd: string;
    exitCode: number;
    duration: number;
    timestamp: number;
}

export class HistoryManager {
    private historyPath: string;
    private history: CommandHistory[];

    constructor(storagePath: string) {
        this.historyPath = path.join(storagePath, 'command_history.json');
        this.history = this.loadHistory();
    }

    /**
     * Load history from file
     */
    private loadHistory(): CommandHistory[] {
        try {
            if (fs.existsSync(this.historyPath)) {
                const data = fs.readFileSync(this.historyPath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
        return [];
    }

    /**
     * Save history to file
     */
    private saveHistory(): void {
        try {
            // Ensure the directory exists
            const dir = path.dirname(this.historyPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.historyPath, JSON.stringify(this.history, null, 2));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    /**
     * Add a command to history
     */
    public addCommand(command: string, cwd: string, exitCode: number, duration: number): Promise<void> {
        return new Promise((resolve) => {
            const newEntry: CommandHistory = {
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
    public getHistory(limit: number = 100, offset: number = 0): Promise<CommandHistory[]> {
        return new Promise((resolve) => {
            const result = this.history.slice(offset, offset + limit);
            resolve(result);
        });
    }

    /**
     * Search command history
     */
    public searchHistory(query: string, limit: number = 50): Promise<CommandHistory[]> {
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
    public clearHistory(): Promise<void> {
        return new Promise((resolve) => {
            this.history = [];
            this.saveHistory();
            resolve();
        });
    }

    /**
     * Close the history manager
     */
    public close(): void {
        // No need to close anything for file-based storage
    }
}
