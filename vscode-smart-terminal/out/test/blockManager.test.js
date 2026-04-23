"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const blockManager_1 = require("../blockManager");
suite('BlockManager Tests', () => {
    let blockManager;
    let terminal;
    setup(() => {
        // Create a mock terminal
        terminal = {
            buffer: {
                active: {
                    cursorY: 0
                }
            }
        };
        blockManager = new blockManager_1.BlockManager(terminal);
    });
    test('Should start a new block', () => {
        blockManager.startBlock();
        const blocks = blockManager.getBlocks();
        assert_1.default.strictEqual(blocks.length, 1);
        (0, assert_1.default)(blocks[0].id);
        assert_1.default.strictEqual(blocks[0].isExpanded, true);
    });
    test('Should end the current block', () => {
        blockManager.startBlock();
        blockManager.endBlock(0);
        const blocks = blockManager.getBlocks();
        (0, assert_1.default)(blocks[0].endTime);
        assert_1.default.strictEqual(blocks[0].exitCode, 0);
    });
    test('Should add command to current block', () => {
        blockManager.startBlock();
        blockManager.addCommand('ls -la');
        const currentBlock = blockManager.getCurrentBlock();
        assert_1.default.strictEqual(currentBlock?.command, 'ls -la');
    });
    test('Should add output to current block', () => {
        blockManager.startBlock();
        blockManager.addOutput('file1.txt\nfile2.txt');
        const currentBlock = blockManager.getCurrentBlock();
        assert_1.default.strictEqual(currentBlock?.output.length, 1);
        assert_1.default.strictEqual(currentBlock?.output[0], 'file1.txt\nfile2.txt');
    });
    test('Should toggle block expansion', () => {
        blockManager.startBlock();
        blockManager.endBlock();
        const blocks = blockManager.getBlocks();
        const blockId = blocks[0].id;
        assert_1.default.strictEqual(blocks[0].isExpanded, true);
        blockManager.toggleBlockExpansion(blockId);
        const updatedBlocks = blockManager.getBlocks();
        assert_1.default.strictEqual(updatedBlocks[0].isExpanded, false);
    });
});
//# sourceMappingURL=blockManager.test.js.map