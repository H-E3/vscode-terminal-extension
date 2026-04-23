import assert from 'assert';
import { BlockManager } from '../blockManager';
import { Terminal } from 'xterm';

suite('BlockManager Tests', () => {
    let blockManager: BlockManager;
    let terminal: Terminal;

    setup(() => {
        // Create a mock terminal
        terminal = {
            buffer: {
                active: {
                    cursorY: 0
                }
            }
        } as any;
        blockManager = new BlockManager(terminal as Terminal);
    });

    test('Should start a new block', () => {
        blockManager.startBlock();
        const blocks = blockManager.getBlocks();
        assert.strictEqual(blocks.length, 1);
        assert(blocks[0].id);
        assert.strictEqual(blocks[0].isExpanded, true);
    });

    test('Should end the current block', () => {
        blockManager.startBlock();
        blockManager.endBlock(0);
        const blocks = blockManager.getBlocks();
        assert(blocks[0].endTime);
        assert.strictEqual(blocks[0].exitCode, 0);
    });

    test('Should add command to current block', () => {
        blockManager.startBlock();
        blockManager.addCommand('ls -la');
        const currentBlock = blockManager.getCurrentBlock();
        assert.strictEqual(currentBlock?.command, 'ls -la');
    });

    test('Should add output to current block', () => {
        blockManager.startBlock();
        blockManager.addOutput('file1.txt\nfile2.txt');
        const currentBlock = blockManager.getCurrentBlock();
        assert.strictEqual(currentBlock?.output.length, 1);
        assert.strictEqual(currentBlock?.output[0], 'file1.txt\nfile2.txt');
    });

    test('Should toggle block expansion', () => {
        blockManager.startBlock();
        blockManager.endBlock();
        const blocks = blockManager.getBlocks();
        const blockId = blocks[0].id;
        
        assert.strictEqual(blocks[0].isExpanded, true);
        blockManager.toggleBlockExpansion(blockId);
        const updatedBlocks = blockManager.getBlocks();
        assert.strictEqual(updatedBlocks[0].isExpanded, false);
    });
});
