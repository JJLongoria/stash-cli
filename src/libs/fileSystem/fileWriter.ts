import * as fs from 'fs';
import * as path from 'path';

/**
 * Class to create and write files into file system
 */
export class FileWriter {

    /**
     * Method to create files asynchronously
     * @param {string} path path to save the file
     * @param {string} content content to write into the file
     * @param {Function} [callback] callback function to handle the end of write
     */
    static createFile(path: string, content: string, callback?: (err?: Error) => void): void {
        fs.writeFile(path, content, (err?: any) => {
            if (callback) {
                callback.call(this, err);
            }
        });
    }

    /**
     * Method to create files synchronously
     * @param {string} path path to save the file
     * @param {string} content content to write into the file
     */
    static createFileSync(path: string, content: string | any): void {
        fs.writeFileSync(path, content);
    }

    /**
     * Method to create folders synchronously (create the entire folders path if is needed)
     * @param {string} folderPath folder to create
     */
    static createFolderSync(folderPath: string): void {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    /**
     * Method to copy files asynchronously
     * @param {string} source source file
     * @param {string} target target file
     * @param {Function} callback callback function to handle the end of copy
     */
    static copyFile(source: string, target: string, callback: (err?: Error) => void): void {
        fs.copyFile(source, target, (err: any) => {
            if (callback) {
                callback.call(this, err);
            }
        });
    }

    /**
     * Method to copy files synchronously
     * @param {string} source source file
     * @param {string} target target file
     */
    static copyFileSync(sourcePath: string, targetPath: string): void {
        fs.copyFileSync(sourcePath, targetPath);
    }


    /**
     * Method to delete and entire folder (and all subfolders)
     * @param {string} pathToDelete folder to delete
     */
    static delete(pathToDelete: string): void {
        if (fs.existsSync(pathToDelete)) {
            if (fs.lstatSync(pathToDelete).isDirectory()) {
                fs.readdirSync(pathToDelete).forEach(function (entry: string) {
                    var entry_path = path.join(pathToDelete, entry);
                    if (fs.lstatSync(entry_path).isDirectory()) {
                        FileWriter.delete(entry_path);
                    } else {
                        fs.unlinkSync(entry_path);
                    }
                });
                fs.rmdirSync(pathToDelete);
            } else {
                fs.unlinkSync(pathToDelete);
            }
        }
    }
}