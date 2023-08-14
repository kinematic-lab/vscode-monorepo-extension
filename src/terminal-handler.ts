import * as vscode from 'vscode';

class TerminalHandler {
	private terminals: { [key: string]: vscode.Terminal } = {};

	constructor() {
		vscode.window.terminals.forEach((terminal) => {
			terminal.dispose();
		});

		vscode.window.onDidCloseTerminal(async (terminal) => {
			const rootProcessId = await terminal.processId;
			Object.entries(this.terminals).forEach(async ([key, value]) => {
				if ((await value.processId) === rootProcessId) {
					delete this.terminals[key];
				}
			});
		});
	}

	public createTerminal(id: string, name: string): void {
		this.terminals[id] && this.terminals[id].dispose();
		this.terminals[id] = vscode.window.createTerminal(name);
	}

	public disposeTerminal(id: string): void {
		if (this.terminals[id]) {
			this.terminals[id].dispose();
			delete this.terminals[id];
		}
	}

	public sendCommand(id: string, command: string): void {
		if (this.terminals[id]) {
			this.terminals[id].sendText(command);
			this.terminals[id].show();
		}
	}
}

export default new TerminalHandler();
