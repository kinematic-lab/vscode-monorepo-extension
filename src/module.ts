import * as vscode from 'vscode';
import Directory from './directory';

enum ModuleType {
	workspace = 'workspace',
	application = 'application',
	package = 'package',
}

const icons = {
	[ModuleType.workspace]: vscode.ThemeIcon.Folder,
	[ModuleType.application]: new vscode.ThemeIcon('globe'),
	[ModuleType.package]: new vscode.ThemeIcon('package'),
};

export default class Module extends vscode.TreeItem {
	public readonly name: string;
	public readonly directory: string;

	public readonly version?: string;
	public readonly type?: ModuleType;
	public readonly scripts?: Scripts;
	public readonly repository?: Repository;

	constructor(
		label: string,
		directory: string,
		state: vscode.TreeItemCollapsibleState,
		workspace?: string,
		config?: Config
	) {
		super(label, state);
		this.name = label.split('@').join('');
		this.directory = directory;

		config?.version && (this.version = config.version);
		config?.scripts && (this.scripts = config.scripts);
		config?.repository && (this.repository = config.repository);

		workspace !== 'apps' && (this.type = ModuleType.package);
		workspace === 'apps' && (this.type = ModuleType.application);
		(config?.workspaces || !config) && (this.type = ModuleType.workspace);

		this.description = this.version;
		this.tooltip = `${this.name}@${this.version}`;
		this.iconPath = icons[this.type ?? 'workspace'];

		this.contextValue = [
			...Object.keys(this.scripts ?? {}),
			this.getDirectory().fileExistsInDirectory('README.md') && 'readme',
			this.repository && 'github',
		]
			.filter(Boolean)
			.join(',');
	}

	public getDirectory(): Directory {
		return new Directory(this.directory);
	}
}
