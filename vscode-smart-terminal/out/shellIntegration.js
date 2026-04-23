"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellIntegration = void 0;
class ShellIntegration {
    /**
     * Get shell integration script for different shell types
     */
    static getIntegrationScript(shellType) {
        switch (shellType.toLowerCase()) {
            case 'bash':
                return this.getBashIntegrationScript();
            case 'zsh':
                return this.getZshIntegrationScript();
            case 'powershell':
                return this.getPowerShellIntegrationScript();
            default:
                return this.getGenericIntegrationScript();
        }
    }
    /**
     * Bash integration script
     */
    static getBashIntegrationScript() {
        return `
# Smart Terminal Shell Integration
if [ -z "$VSCODE_SMART_TERMINAL_INTEGRATED" ]; then
    export VSCODE_SMART_TERMINAL_INTEGRATED=1

    # Command start marker
    preexec() {
        printf "\x1b]633;A\x07"
    }

    # Command end marker
    precmd() {
        printf "\x1b]633;B\x07"
    }
fi
`;
    }
    /**
     * Zsh integration script
     */
    static getZshIntegrationScript() {
        return `
# Smart Terminal Shell Integration
if [ -z "$VSCODE_SMART_TERMINAL_INTEGRATED" ]; then
    export VSCODE_SMART_TERMINAL_INTEGRATED=1

    # Command start marker
    preexec() {
        printf "\x1b]633;A\x07"
    }

    # Command end marker
    precmd() {
        printf "\x1b]633;B\x07"
    }
fi
`;
    }
    /**
     * PowerShell integration script
     */
    static getPowerShellIntegrationScript() {
        return `
# Smart Terminal Shell Integration
if (-not $env:VSCODE_SMART_TERMINAL_INTEGRATED) {
    $env:VSCODE_SMART_TERMINAL_INTEGRATED = 1

    # Command start marker
    function PreCommand {
        Write-Host "\x1b]633;A\x07" -NoNewline
    }

    # Command end marker
    function PostCommand {
        Write-Host "\x1b]633;B\x07" -NoNewline
    }

    # Register hooks
    Register-EngineEvent -SourceIdentifier PowerShell.CommandBegin -Action { PreCommand }
    Register-EngineEvent -SourceIdentifier PowerShell.CommandEnd -Action { PostCommand }
}
`;
    }
    /**
     * Generic integration script for other shells
     */
    static getGenericIntegrationScript() {
        return `
# Smart Terminal Shell Integration
# Generic script - may need manual adjustment for your shell
`;
    }
    /**
     * Parse shell integration escape sequences
     */
    static parseEscapeSequence(data) {
        // Look for OSC 633 sequences
        const commandStartPattern = /\x1b\]633;A\x07/g;
        const commandEndPattern = /\x1b\]633;B\x07/g;
        let type = 'none';
        let cleanedData = data;
        if (commandStartPattern.test(data)) {
            type = 'commandStart';
            cleanedData = cleanedData.replace(commandStartPattern, '');
        }
        else if (commandEndPattern.test(data)) {
            type = 'commandEnd';
            cleanedData = cleanedData.replace(commandEndPattern, '');
        }
        return {
            type,
            data: cleanedData
        };
    }
}
exports.ShellIntegration = ShellIntegration;
//# sourceMappingURL=shellIntegration.js.map