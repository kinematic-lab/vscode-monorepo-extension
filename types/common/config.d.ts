interface Repository {
	url: string;
	type?: string;
	directory?: string;
}

interface Scripts {
	[key: string]: string;
}

interface Config {
	name: string;
	version?: string;
	workspaces?: string[];
	repository?: Repository;
	scripts?: Scripts;
	private?: boolean;
}
