import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { FileChecker, FileWriter, PathUtils } from "../../../libs/fileSystem";

export default class Download extends BaseCommand {
    static description = 'Retrieve the project matching the supplied projectKey. If not selected output folder, return the raw image data';
    static examples = [
        `$ stash projects:avatar:download -a MyStashAlias --key "ProjectKey"`,
        `$ stash projects:avatar:download -a MyStashAlias --output-folder "path/to/the/output/folder" --key "ProjectKey" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        key: Flags.string({
            description: 'The Project key to retrieve the avatar',
            required: true,
            name: 'Key'
        }),
        size: Flags.integer({
            description: 'The desired image size',
            required: false,
            name: 'Size'
        }),
        outputFolder: BuildFlags.output.file('', false),
    };
    async run(): Promise<StashCLIResponse<any> | any> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const avatar = await connector.projects.avatar(this.flags.key).get(this.flags.size);
            response.result = avatar;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Project Avatar');
            if(!this.flags.outputFolder){
                console.log(avatar);
            } else {
                const absolutePath = PathUtils.getAbsolutePath(this.flags.outputFolder);
                if(!FileChecker.isExists(absolutePath)){
                    FileWriter.createFolderSync(absolutePath);
                }
                FileWriter.createFileSync(absolutePath + '/Project_' + this.flags.key + '_avatar.png', avatar);
            }
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}