import assert from 'assert';
import { ShellIntegration } from '../shellIntegration';

suite('ShellIntegration Tests', () => {
    test('Should get bash integration script', () => {
        const script = ShellIntegration.getIntegrationScript('bash');
        assert.strictEqual(typeof script, 'string');
        assert(script.includes('preexec'));
        assert(script.includes('precmd'));
    });

    test('Should get zsh integration script', () => {
        const script = ShellIntegration.getIntegrationScript('zsh');
        assert.strictEqual(typeof script, 'string');
        assert(script.includes('preexec'));
        assert(script.includes('precmd'));
    });

    test('Should get powershell integration script', () => {
        const script = ShellIntegration.getIntegrationScript('powershell');
        assert.strictEqual(typeof script, 'string');
        assert(script.includes('PreCommand'));
        assert(script.includes('PostCommand'));
    });

    test('Should get generic integration script for unknown shell', () => {
        const script = ShellIntegration.getIntegrationScript('unknown');
        assert.strictEqual(typeof script, 'string');
        assert(script.includes('Generic script'));
    });

    test('Should parse command start sequence', () => {
        const data = '\x1b]633;A\x07ls -la';
        const result = ShellIntegration.parseEscapeSequence(data);
        assert.strictEqual(result.type, 'commandStart');
        assert.strictEqual(result.data, 'ls -la');
    });

    test('Should parse command end sequence', () => {
        const data = 'output\x1b]633;B\x07';
        const result = ShellIntegration.parseEscapeSequence(data);
        assert.strictEqual(result.type, 'commandEnd');
        assert.strictEqual(result.data, 'output');
    });

    test('Should return none for no sequence', () => {
        const data = 'regular text';
        const result = ShellIntegration.parseEscapeSequence(data);
        assert.strictEqual(result.type, 'none');
        assert.strictEqual(result.data, 'regular text');
    });
});
