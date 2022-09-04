import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";

export default class List extends BaseCommand {
    static description = 'Delete the project matching the supplied projectKey.';
    static examples = [
        `$ stash projects:delete -a MyStashAlias --key "ProjectKey" --csv`,
        `$ stash projects:delete -a MyStashAlias --key "ProjectKey" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        key: Flags.string({
            description: 'The Project key to delete',
            required: true,
            name: 'Key'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.delete(this.flags.key);
            response.status = 0;
            response.message = this.getRecordDeletedText('Project');
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}