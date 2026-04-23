"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const shellIntegration_1 = require("../shellIntegration");
suite('ShellIntegration Tests', () => {
    test('Should get bash integration script', () => {
        const script = shellIntegration_1.ShellIntegration.getIntegrationScript('bash');
        assert_1.default.strictEqual(typeof script, 'string');
        (0, assert_1.default)(script.includes('preexec'));
        (0, assert_1.default)(script.includes('precmd'));
    });
    test('Should get zsh integration script', () => {
        const script = shellIntegration_1.ShellIntegration.getIntegrationScript('zsh');
        assert_1.default.strictEqual(typeof script, 'string');
        (0, assert_1.default)(script.includes('preexec'));
        (0, assert_1.default)(script.includes('precmd'));
    });
    test('Should get powershell integration script', () => {
        const script = shellIntegration_1.ShellIntegration.getIntegrationScript('powershell');
        assert_1.default.strictEqual(typeof script, 'string');
        (0, assert_1.default)(script.includes('PreCommand'));
        (0, assert_1.default)(script.includes('PostCommand'));
    });
    test('Should get generic integration script for unknown shell', () => {
        const script = shellIntegration_1.ShellIntegration.getIntegrationScript('unknown');
        assert_1.default.strictEqual(typeof script, 'string');
        (0, assert_1.default)(script.includes('Generic script'));
    });
    test('Should parse command start sequence', () => {
        const data = '\x1b]633;A\x07ls -la';
        const result = shellIntegration_1.ShellIntegration.parseEscapeSequence(data);
        assert_1.default.strictEqual(result.type, 'commandStart');
        assert_1.default.strictEqual(result.data, 'ls -la');
    });
    test('Should parse command end sequence', () => {
        const data = 'output\x1b]633;B\x07';
        const result = shellIntegration_1.ShellIntegration.parseEscapeSequence(data);
        assert_1.default.strictEqual(result.type, 'commandEnd');
        assert_1.default.strictEqual(result.data, 'output');
    });
    test('Should return none for no sequence', () => {
        const data = 'regular text';
        const result = shellIntegration_1.ShellIntegration.parseEscapeSequence(data);
        assert_1.default.strictEqual(result.type, 'none');
        assert_1.default.strictEqual(result.data, 'regular text');
    });
});
//# sourceMappingURL=shellIntegration.test.js.map