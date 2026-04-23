"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockManager = void 0;
class BlockManager {
    constructor(terminal) {
        this.blocks = [];
        this.currentBlock = null;
        this.terminal = terminal;
    }
    /**
     * Start a new command block
     */
    startBlock() {
        const block = {
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
    endBlock(exitCode) {
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
    addCommand(command) {
        if (this.currentBlock) {
            this.currentBlock.command = command;
        }
    }
    /**
     * Add output to current block
     */
    addOutput(output) {
        if (this.currentBlock) {
            this.currentBlock.output.push(output);
        }
    }
    /**
     * Toggle block expansion state
     */
    toggleBlockExpansion(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block) {
            block.isExpanded = !block.isExpanded;
            this.updateBlockVisibility(block);
        }
    }
    /**
     * Get all blocks
     */
    getBlocks() {
        return this.blocks;
    }
    /**
     * Get current block
     */
    getCurrentBlock() {
        return this.currentBlock;
    }
    /**
     * Add visual decoration to terminal
     */
    addBlockDecoration(line, type) {
        // This would use xterm.js Decoration API
        // For now, we'll just log the decoration
        console.log(`Adding ${type} decoration at line ${line}`);
    }
    /**
     * Update block visibility based on expansion state
     */
    updateBlockVisibility(block) {
        // This would use xterm.js Decoration API to hide/show lines
        console.log(`${block.isExpanded ? 'Expanding' : 'Collapsing'} block ${block.id}`);
    }
}
exports.BlockManager = BlockManager;
//# sourceMappingURL=blockManager.js.map