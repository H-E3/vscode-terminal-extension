export class ShellIntegration {
    /**
     * Get shell integration script for different shell types
     */
    public static getIntegrationScript(shellType: string): string {
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
    private static getBashIntegrationScript(): string {
        return `
# Smart Terminal Shell Integration
if [ -z "$VSCODE_SMART_TERMINAL_INTEGRATED" ]; then
    export VSCODE_SMART_TERMINAL_INTEGRATED=1

    # Command start marker
    preexec() {
        printf "\033]633;A\007"
    }

    # Command end marker
    precmd() {
        printf "\033]633;B\007"
    }
fi
`;
    }

    /**
     * Zsh integration script
     */
    private static getZshIntegrationScript(): string {
        return `
# Smart Terminal Shell Integration
if [ -z "$VSCODE_SMART_TERMINAL_INTEGRATED" ]; then
    export VSCODE_SMART_TERMINAL_INTEGRATED=1

    # Command start marker
    preexec() {
        printf "\033]633;A\007"
    }

    # Command end marker
    precmd() {
        printf "\033]633;B\007"
    }
fi
`;
    }

    /**
     * PowerShell integration script
     */
    private static getPowerShellIntegrationScript(): string {
        return `
# Smart Terminal Shell Integration
if (-not $env:VSCODE_SMART_TERMINAL_INTEGRATED) {
    $env:VSCODE_SMART_TERMINAL_INTEGRATED = 1

    # Command start marker
    function PreCommand {
        Write-Host "\033]633;A\007" -NoNewline
    }

    # Command end marker
    function PostCommand {
        Write-Host "\033]633;B\007" -NoNewline
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
    private static getGenericIntegrationScript(): string {
        return `
# Smart Terminal Shell Integration
# Generic script - may need manual adjustment for your shell
`;
    }

    /**
     * Parse shell integration escape sequences
     */
    public static parseEscapeSequence(data: string): {
        type: 'commandStart' | 'commandEnd' | 'none';
        data: string;
    } {
        // Look for OSC 633 sequences
        const commandStartPattern = /\x1b\]633;A\x07/g;
        const commandEndPattern = /\x1b\]633;B\x07/g;

        let type: 'commandStart' | 'commandEnd' | 'none' = 'none';
        let cleanedData = data;

        if (commandStartPattern.test(data)) {
            type = 'commandStart';
            cleanedData = cleanedData.replace(commandStartPattern, '');
        } else if (commandEndPattern.test(data)) {
            type = 'commandEnd';
            cleanedData = cleanedData.replace(commandEndPattern, '');
        }

        return {
            type,
            data: cleanedData
        };
    }
}
