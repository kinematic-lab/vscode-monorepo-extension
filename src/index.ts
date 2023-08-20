import * as vscode from 'vscode';
import Provider from './provider';
import Commands from './commands';

const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
const provider = new Provider(root);
vscode.window.registerTreeDataProvider('labOverview', provider);

/**
 * Provider Commands
 */
vscode.commands.registerCommand('labOverview.refresh', () =>
	provider.refresh()
);

/**
 * Local Commands
 */
vscode.commands.registerCommand('labOverview.runBuild', Commands.runBuild);
vscode.commands.registerCommand('labOverview.runDev', Commands.runDev);
vscode.commands.registerCommand('labOverview.openReadme', Commands.openReadme);
vscode.commands.registerCommand('labOverview.openGithub', Commands.openGithub);

/**
 * Root Commands
 */
vscode.commands.registerCommand(
	'labOverview.runBuildRoot',
	Commands.runBuildRoot.bind(null, provider)
);

vscode.commands.registerCommand(
	'labOverview.runDevRoot',
	Commands.runDevRoot.bind(null, provider)
);

vscode.commands.registerCommand(
	'labOverview.openReadmeRoot',
	Commands.openReadmeRoot.bind(null, provider)
);

vscode.commands.registerCommand(
	'labOverview.openGithubRoot',
	Commands.openGithubRoot.bind(null, provider)
);
