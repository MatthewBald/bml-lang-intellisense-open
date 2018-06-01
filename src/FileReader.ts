/**
 * FileReader is a class designed for reading in files and returning the content
 */
export class FileReader {
	
	private _fileContent;
	private _ioError;
	
	/**
	 * Reads a file located at the specified path and stores the content
	 */
	public readFile(path: String, encoding: String): FileReader {
		try {	
			let fs = require("fs");
			this._fileContent = fs.readFileSync(require('path').resolve(__dirname, path), encoding);
			this._ioError = false;
			return this;
		}
		catch (error) {
			console.log("Error reading file.");
			this._ioError = true;
			return this;
		}
	}
	
	public getContentAsJSON(): any {
		return (this._ioError) ? "Error" : JSON.parse(this._fileContent);
	}
	
	public getContent(): any {
		return (this._ioError) ? "Error" : this._fileContent;
	}
}