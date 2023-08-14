import * as vscode from 'vscode';
import * as path from 'path';

import Provider from './provider';
import Module from './module';
import terminalHandler from './terminal-handler';

/**
 * Runs 'build' command in root of project.
 * @param {Provider} provider
 */
function runBuildRoot(provider: Provider) {
	if (provider.rootConfiguration?.scripts?.build) {
		terminalHandler.createTerminal('lab-build', 'Lab: Build');
		terminalHandler.sendCommand('lab-build', 'pnpm run build');
	} else {
		console.warn('No "build" script found in root');
	}
}

/**
 * Runs 'dev' command in root of project.
 * @param {Provider} provider
 */
function runDevRoot(provider: Provider) {
	if (provider.rootConfiguration?.scripts?.dev) {
		terminalHandler.createTerminal('lab-dev', 'Lab: Dev');
		terminalHandler.sendCommand('lab-dev', 'pnpm run dev');
	} else {
		console.warn('No "dev" script found in root');
	}
}

/**
 * Opens "README.md" file in project root.
 * @param {Provider} provider
 */
function openReadmeRoot(provider: Provider) {
	if (provider.rootDirectory) {
		const filePath = vscode.Uri.file(
			path.join(provider.rootDirectory?.directory, 'README.md')
		);

		vscode.workspace.openTextDocument(filePath).then((document) => {
			vscode.window.showTextDocument(document);
		});
	}
}

/**
 * Opens root project in GitHub.
 * @param {Provider} provider
 */
function openGithubRoot(provider: Provider) {
	if (provider.rootConfiguration?.repository?.url) {
		const { url } = provider.rootConfiguration.repository;
		vscode.env.openExternal(vscode.Uri.parse(url.replaceAll('.git', '')));
	} else {
		console.warn('No "repository.url" field found in root');
	}
}

/**
 * Runs 'build' command in package.
 * @param {Provider} provider
 */
function runBuild(module: Module) {
	const { name, directory } = module;

	if (module.scripts?.build) {
		terminalHandler.createTerminal(
			`lab-build-${name}`,
			`Lab: Build (@${name})`
		);
		terminalHandler.sendCommand(
			`lab-build-${name}`,
			`cd ${directory} && pnpm run build`
		);
	} else {
		console.warn(`No "build" script found in @${name}`);
	}
}

/**
 * Runs 'dev' command in package.
 * @param {Provider} provider
 */
function runDev(module: Module) {
	const { name, directory } = module;

	if (module.scripts?.dev) {
		terminalHandler.createTerminal(
			`lab-dev-${name}`,
			`Lab: Dev (@${name})`
		);
		terminalHandler.sendCommand(
			`lab-dev-${name}`,
			`cd ${directory} && pnpm run dev`
		);
	} else {
		console.warn(`No "dev" script found in @${name}`);
	}
}

/**
 * Opens a README.md file for either a package or application.
 * @param {Module} module
 */
function openReadme(module: Module) {
	const filePath = vscode.Uri.file(path.join(module.directory, 'README.md'));
	vscode.workspace.openTextDocument(filePath).then((document) => {
		vscode.window.showTextDocument(document);
	});
}

/**
 * Opens a package or an application in GitHub.
 * @param {Module} module
 */
function openGithub(module: Module) {
	if (module.repository?.url && module.repository?.directory) {
		const { url, directory } = module.repository;
		vscode.env.openExternal(
			vscode.Uri.parse(
				`${url.replaceAll('.git', '')}/tree/main/${directory}`
			)
		);
	} else {
		console.warn(
			`No "repository.url" or "repository.directory" field found in @${module.name}`
		);
	}
}

export default {
	runBuildRoot,
	runDevRoot,
	openReadmeRoot,
	openGithubRoot,

	runBuild,
	runDev,
	openReadme,
	openGithub,
};
