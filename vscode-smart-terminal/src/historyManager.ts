import * as sqlite3 from 'sqlite3';
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
    private db: sqlite3.Database;

    constructor(storagePath: string) {
        const dbPath = path.join(storagePath, 'command_history.db');
        this.db = new sqlite3.Database(dbPath);
        this.initDatabase();
    }

    /**
     * Initialize the database schema
     */
    private initDatabase() {
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
    public addCommand(command: string, cwd: string, exitCode: number, duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO command_history (command, cwd, exitCode, duration, timestamp) VALUES (?, ?, ?, ?, ?)',
                [command, cwd, exitCode, duration, Date.now()],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    /**
     * Get command history
     */
    public getHistory(limit: number = 100, offset: number = 0): Promise<CommandHistory[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM command_history ORDER BY timestamp DESC LIMIT ? OFFSET ?',
                [limit, offset],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows as CommandHistory[]);
                    }
                }
            );
        });
    }

    /**
     * Search command history
     */
    public searchHistory(query: string, limit: number = 50): Promise<CommandHistory[]> {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM command_history WHERE command LIKE ? ORDER BY timestamp DESC LIMIT ?',
                [`%${query}%`, limit],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows as CommandHistory[]);
                    }
                }
            );
        });
    }

    /**
     * Clear command history
     */
    public clearHistory(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM command_history', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Close the database connection
     */
    public close(): void {
        this.db.close();
    }
}
