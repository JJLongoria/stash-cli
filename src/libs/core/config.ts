import { BasicAuth } from "stash-connector";
import { FileChecker, FileReader, FileWriter } from "../fileSystem";
import { Instance } from "../types";

const INSTANCES_FILE = 'instances.json';

export class Config {

    private folderPath: string = '';
    public instances: { [key: string]: Instance } = {};

    constructor(folderPath: string, load?: boolean) {
        this.folderPath = folderPath;
        if (load) {
            this.load();
        }
    }

    getConnectorOptions(alias: string): BasicAuth {
        const instance = this.instances[alias];
        const data = atob(instance.token);
        const splits = data.split(':');
        return {
            host: instance.host,
            user: splits[0],
            password: splits[1],
        }
    }

    load() {
        const filePath = this.folderPath + '/' + INSTANCES_FILE;
        if (!FileChecker.isExists(this.folderPath)) {
            FileWriter.createFolderSync(this.folderPath);
        }
        if (!FileChecker.isExists(filePath)) {
            FileWriter.createFileSync(filePath, JSON.stringify({}));
        }
        this.instances = JSON.parse(FileReader.readFileSync(filePath))
    }

    save() {
        const filePath = this.folderPath + '/' + INSTANCES_FILE;
        if (!FileChecker.isExists(this.folderPath)) {
            FileWriter.createFolderSync(this.folderPath);
        }
        if (!FileChecker.isExists(filePath)) {
            FileWriter.createFileSync(filePath, JSON.stringify({}));
        }
        FileWriter.createFileSync(filePath, JSON.stringify(this.instances, null, 2));
    }

}