import * as vscode from 'vscode';
import * as path from 'path';

import Module from './module';
import Directory from './directory';

export default class Provider implements vscode.TreeDataProvider<Module> {
	public rootDirectory?: Directory;
	public rootConfiguration?: Config;

	constructor(workspaceRoot?: string) {
		if (workspaceRoot) {
			const validator = (c: string) => Boolean(JSON.parse(c).workspaces);
			const d = new Directory(workspaceRoot);
			const r = d.findInAncestors({ name: 'package.json', validator });
			const f = r.readFileInDirectory('package.json');

			this.rootDirectory = r;
			this.rootConfiguration = f && JSON.parse(f);
		}
	}

	public getTreeItem(element: Module): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: Module): Thenable<Module[]> {
		return Promise.resolve(
			element
				? this.getWorkspaceElements(element)
				: this.getRootElements()
		);
	}

	private getRootElements(): Module[] {
		if (this.rootConfiguration?.workspaces && this.rootDirectory) {
			const { workspaces } = this.rootConfiguration;
			const { directory } = this.rootDirectory;

			return workspaces.map((workspace) => {
				const santizedPath = workspace.replaceAll(/\/\*{1,2}/g, '');

				const moduleLabel = santizedPath;
				const moduleDirectory = path.join(directory, santizedPath);
				const moduleState = vscode.TreeItemCollapsibleState.Expanded;
				return new Module(moduleLabel, moduleDirectory, moduleState);
			});
		}

		return [];
	}

	private getWorkspaceElements(element: Module): Module[] {
		const directories = element.getDirectory().findInChildren({
			name: 'package.json',
			exclude: ['node_modules'],
		});

		return directories.map((directory) => {
			const contents = directory.readFileInDirectory('package.json');
			const config = contents
				? JSON.parse(contents)
				: { name: 'Undefined' };

			const moduleLabel = config.name;
			const moduleDirectory = directory.directory;
			const moduleState = vscode.TreeItemCollapsibleState.None;
			return new Module(
				moduleLabel,
				moduleDirectory,
				moduleState,
				element.name,
				config
			);
		});
	}
}
