import { Terminal } from 'xterm';

export interface CommandBlock {
    id: string;
    command: string;
    output: string[];
    startTime: number;
    endTime?: number;
    exitCode?: number;
    isExpanded: boolean;
    startLine: number;
    endLine: number;
}

export class BlockManager {
    private blocks: CommandBlock[] = [];
    private currentBlock: CommandBlock | null = null;
    private terminal: Terminal;

    constructor(terminal: Terminal) {
        this.terminal = terminal;
    }

    /**
     * Start a new command block
     */
    public startBlock(): void {
        const block: CommandBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            command: '',
            output: [],
            startTime: Date.now(),
            isExpanded: true,
            startLine: this.terminal.buffer.active.cursorY,
            endLine: this.terminal.buffer.active.cursorY
        };

        this.currentBlock = block;
        this.blocks.push(block);

        // Add visual decoration for block start
        this.addBlockDecoration(block.startLine, 'block-start');
    }

    /**
     * End the current command block
     */
    public endBlock(exitCode?: number): void {
        if (this.currentBlock) {
            this.currentBlock.endTime = Date.now();
            this.currentBlock.exitCode = exitCode;
            this.currentBlock.endLine = this.terminal.buffer.active.cursorY;

            // Add visual decoration for block end
            this.addBlockDecoration(this.currentBlock.endLine, 'block-end');

            this.currentBlock = null;
        }
    }

    /**
     * Add command to current block
     */
    public addCommand(command: string): void {
        if (this.currentBlock) {
            this.currentBlock.command = command;
        }
    }

    /**
     * Add output to current block
     */
    public addOutput(output: string): void {
        if (this.currentBlock) {
            this.currentBlock.output.push(output);
        }
    }

    /**
     * Toggle block expansion state
     */
    public toggleBlockExpansion(blockId: string): void {
        const block = this.blocks.find(b => b.id === blockId);
        if (block) {
            block.isExpanded = !block.isExpanded;
            this.updateBlockVisibility(block);
        }
    }

    /**
     * Get all blocks
     */
    public getBlocks(): CommandBlock[] {
        return this.blocks;
    }

    /**
     * Get current block
     */
    public getCurrentBlock(): CommandBlock | null {
        return this.currentBlock;
    }

    /**
     * Add visual decoration to terminal
     */
    private addBlockDecoration(line: number, type: 'block-start' | 'block-end') {
        // This would use xterm.js Decoration API
        // For now, we'll just log the decoration
        console.log(`Adding ${type} decoration at line ${line}`);
    }

    /**
     * Update block visibility based on expansion state
     */
    private updateBlockVisibility(block: CommandBlock) {
        // This would use xterm.js Decoration API to hide/show lines
        console.log(`${block.isExpanded ? 'Expanding' : 'Collapsing'} block ${block.id}`);
    }
}
