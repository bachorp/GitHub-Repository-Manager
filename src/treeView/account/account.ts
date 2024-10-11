import vscode, { ThemeIcon } from 'vscode'
import { noLocalSearchPaths } from '../../commands/git/searchClonedRepos'
import { User, UserState } from '../../store/user'
import { BaseTreeDataProvider, TreeItem } from '../treeViewBase'

export let accountTreeDataProvider: TreeDataProvider

export const activateTreeViewAccount = (): void => {
    accountTreeDataProvider = new TreeDataProvider()

    vscode.window.registerTreeDataProvider(
        'githubRepoMgr.views.account',
        accountTreeDataProvider,
    )

    User.subscribe('account', () => {
        accountTreeDataProvider.refresh()
    })

    // Open user profile page
    vscode.commands.registerCommand(
        'githubRepoMgr.commands.user.openProfilePage',
        async () => {
            if (User.profileUri) {
                await vscode.commands.executeCommand(
                    'vscode.open',
                    vscode.Uri.parse(User.profileUri),
                )
            }
        },
    )
}

// There is a TreeItem from vscode. Should I use it? But it would need a workaround to
// avoid using title in command.
class TreeDataProvider extends BaseTreeDataProvider {
    getData() {
        switch (User.state) {
            case UserState.errorLogging: // TODO: Bad when token already stored and we have a connection error
                return new TreeItem({ label: 'An error happened!' })
            case UserState.notLogged:
                return [] // Empty, do show nothing.
            case UserState.init:
            case UserState.logging:
                return new TreeItem({ label: 'Loading...' })
            case UserState.logged:
                return getLoggedTreeData()
        }
    }

    protected makeData() {
        this.data = this.getData()
    }
}

export const getLoggedTreeData = (): Array<TreeItem> => [
    new TreeItem({
        label: `Hi, ${User.login}!`,
        iconPath: new ThemeIcon('verified'),
        children: [
            // That space before the label improves readability (that the icon reduces, but they look cool!)
            new TreeItem({
                label: ' Open your GitHub page',
                command: 'githubRepoMgr.commands.user.openProfilePage',
                iconPath: new ThemeIcon('github'),
            }),
            ...(noLocalSearchPaths
                ? []
                : [
                      new TreeItem({
                          label: ' Change "git.defaultCloneDirectory"',
                          command:
                              'githubRepoMgr.commands.pick.defaultCloneDirectory',
                          iconPath: new ThemeIcon('file-directory'),
                      }),
                  ]),
        ],
    }),
]
