import os from 'node:os'
import { workspace } from 'vscode'

// Outside of class to call without `this.`.
const getConfig = <T>(section: string, defaultVal: T): T =>
    workspace.getConfiguration('githubRepositoryManager').get<T>(section) ??
    defaultVal

export class Configs {
    static get alwaysCloneToDefaultDirectory(): boolean {
        return getConfig<boolean>('alwaysCloneToDefaultDirectory', false)
    }

    static get defaultCloneDirectoryMaximumDepth(): number {
        return getConfig<number>('defaultCloneDirectoryMaximumDepth', 2)
    }

    static get directoriesToIgnore(): Array<string> {
        return getConfig<Array<string>>('directoriesToIgnore', [
            '.vscode',
            '.git',
            'node_modules',
        ])
    }

    static get gitDefaultCloneDir(): string | undefined {
        let path = workspace
            .getConfiguration('git')
            .get<string>('defaultCloneDirectory')

        if (path) {
            path = path.replace(/^~/, os.homedir())
        }

        return path
    }

    static get defaultCloneToDir(): string {
        return Configs.gitDefaultCloneDir || os.homedir()
    }
}
