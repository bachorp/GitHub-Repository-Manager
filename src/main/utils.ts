import os from 'node:os'
import vscode from 'vscode'

export const extensionIdentifier = 'githubRepoMgr'

/** Will prefix it with `${extensionIdentifier}.` Is it required? */
export const myExtensionSetContext = async (
    context: string,
    value: any,
): Promise<void> => {
    await vscode.commands.executeCommand(
        'setContext',
        `${extensionIdentifier}.${context}`,
        value,
    )
}
export const replaceTildeToHomedir = (uri: string): string =>
    uri.replace(/^~/, os.homedir())

// export const channel = vscode.window.createOutputChannel('GitHub Repository Manager');
