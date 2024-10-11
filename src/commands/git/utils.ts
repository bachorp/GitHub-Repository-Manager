import Path from 'node:path'
import fse from 'fs-extra'

/** True if has git, false if don't. */
export const pathHasGit = (path: string): Promise<boolean> =>
    fse.pathExists(Path.join(path, '.git'))

/** Includes .git on end. */
export const getRepositoryGitUrl = (options: {
    owner: string
    repositoryName: string
    token?: string
}): string =>
    options.token
        ? `https://${options.token}@github.com/${options.owner}/${options.repositoryName}.git`
        : `https://github.com/${options.owner}/${options.repositoryName}.git`
