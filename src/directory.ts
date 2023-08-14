import * as fs from 'fs';
import * as path from 'path';

/**
 * Interfaces
 */
interface DirectoryOptions {
	name: string;
	directory?: string;
	validator?: (contents: string) => boolean;
	exclude?: string[];
	depth?: number;
}

/**
 * Directory
 */
export default class Directory {
	constructor(public readonly directory: string) {}

	public findInAncestors(options: DirectoryOptions): Directory {
		const { name } = options;
		const directory = options.directory ?? this.directory;
		const validator = options.validator ?? (() => true);
		const depth = options.depth ?? 10;

		const filePath = path.join(directory, name);
		const fileContents = this.readFile(filePath);
		if (fileContents && validator(fileContents)) {
			return new Directory(path.dirname(filePath));
		}

		return depth
			? this.findInAncestors({
					name,
					directory,
					validator,
					depth: depth - 1,
			  })
			: this;
	}

	public findInChildren(options: DirectoryOptions): Directory[] {
		const { name } = options;
		const directory = options.directory ?? this.directory;
		const validator = options.validator ?? (() => true);
		const exclude = options.exclude ?? [];
		const depth = options.depth ?? 10;

		const filePath = path.join(directory, name);
		const fileContents = this.readFile(filePath);
		if (fileContents && validator(fileContents)) {
			return [new Directory(path.dirname(filePath))];
		}

		if (depth) {
			const subdirectories = fs
				.readdirSync(directory, { withFileTypes: true })
				.filter((i) => i.isDirectory() && !exclude.includes(i.name))
				.map((i) => i.name);

			return subdirectories.reduce(
				(acc: Directory[], subdirectory) => [
					...acc,
					...this.findInChildren({
						...options,
						directory: path.join(directory, subdirectory),
						depth: depth - 1,
					}),
				],
				[]
			);
		}

		return [];
	}

	public fileExistsInDirectory(n: string): boolean {
		return fs.existsSync(path.join(this.directory, n));
	}

	public readFileInDirectory(n: string): string | false {
		return this.readFile(path.join(this.directory, n));
	}

	private readFile(p: string): string | false {
		return fs.existsSync(p) && fs.readFileSync(p, 'utf-8');
	}
}
