import * as fs from "fs";

/**
 * Class to check all about files. If is Apex Class, Apex Trigger, Aura Component... or check if exists or is a File or Directorty
 */
export class FileChecker {

    /**
     * Method to check if file or folder exists on the system
     * @param {string} fileOFolderPath path to check
     * 
     * @returns {boolean} true if exists, false in otherwise
     */
    static isExists(fileOFolderPath: string): boolean {
        return fs.existsSync(fileOFolderPath);
    }

    /**
     * Method to check if the path is a Directory path (and exists)
     * @param {string} folderPath path to check
     * 
     * @returns {boolean} true if is a directory, false in otherwise
     */
    static isDirectory(folderPath: string): boolean {
        return FileChecker.isExists(folderPath) && fs.statSync(folderPath).isDirectory();
    }

    /**
     * Method to check if the path is a File path (and exists)
     * @param {string} filePath path to check
     * 
     * @returns {boolean} true if is a file, false in otherwise
     */
    static isFile(filePath: string): boolean {
        return FileChecker.isExists(filePath) && fs.statSync(filePath).isFile();
    }
}