import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { FileChecker, FileWriter, PathUtils } from "../../../libs/fileSystem";

export default class Download extends BaseCommand {
    static description = 'Retrieve the avatar for the project matching the supplied moduleKey. If not selected output folder, return the raw image data';
    static examples = [
        `$ stash hooks:avatar:download -a MyStashAlias --hook "HookKey"`,
        `$ stash hooks:avatar:download -a MyStashAlias --output-folder "path/to/the/output/folder" --hook "HookKey" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        hook: Flags.string({
            description: 'The Hook key to retrieve the avatar',
            required: true,
            name: 'Hook'
        }),
        version: Flags.integer({
            description: 'Optional version used for HTTP caching only - any non-blank version will result in a large max-age Cache-Control header. Note that this does not affect the Last-Modified header.',
            required: false,
            name: 'Version'
        }),
        'output-folder': BuildFlags.output.folder('', false),
    };
    async run(): Promise<StashCLIResponse<any> | any> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const avatar = await connector.hooks.avatar(this.flags.hook).get(this.flags.version);
            response.result = avatar;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Hook Avatar');
            if(!this.flags['output-folder']){
                
                this.ux.log(avatar);
            } else {
                const absolutePath = PathUtils.getAbsolutePath(this.flags['output-folder']);
                if(!FileChecker.isExists(absolutePath)){
                    FileWriter.createFolderSync(absolutePath);
                }
                FileWriter.createFileSync(absolutePath + '/Hook' + this.flags.hook + '_avatar.png', avatar);
            }
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}