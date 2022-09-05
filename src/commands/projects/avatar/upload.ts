import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { FileChecker, PathUtils } from "../../../libs/fileSystem";

export default class Download extends BaseCommand {
    static description = 'Update the avatar for the project matching the supplied projectKey.';
    static examples = [
        `$ stash projects:avatar:upload -a MyStashAlias --key "ProjectKey" --file "path/to/the/avatar/file"`,
        `$ stash projects:avatar:upload -a MyStashAlias --key "ProjectKey" --file "path/to/the/avatar/file" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        key: Flags.string({
            description: 'The Project key to update the avatar',
            required: true,
            name: 'Key'
        }),
        file: BuildFlags.input.file('', true),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            if(this.flags.file){
                const extension = PathUtils.getFileExtension(this.flags.file);
                const absoluePath = PathUtils.getAbsolutePath(this.flags.file);
                if(!extension || extension.toLocaleLowerCase() !== 'png'){
                    throw new Error('Not allowed format. Only PNG images are allowed');
                }
                if(!FileChecker.isExists(absoluePath)){
                    throw new Error('File path ' + absoluePath + ' does not exists');
                }
            }
            await connector.projects.avatar(this.flags.key).update(this.flags.file);
            response.status = 0;
            response.message = 'Project Avatar Uploaded successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}