import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";

export default class Update extends BaseCommand {
    static description = 'Promote or demote a user\'s permission level for the specified project.';
    static examples = [
        `$ stash projects:permissions:users:update -a MyStashAlias --project "ProjectKey" --name Username --permission 'PROJECT_READ' --json`,
        `$ stash projects:permissions:users:update -a MyStashAlias --project "ProjectKey" --name Username --permission 'PROJECT_ADMIN'`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to revoke user permissions',
            required: true,
            name: 'Project'
        }),
        name: Flags.string({
            description: 'The name of the user',
            required: true,
            name: 'Name'
        }),
        permission: Flags.string({
            description: 'The permission to grant',
            type: "option",
            options: ['PROJECT_READ', 'PROJECT_WRITE', 'PROJECT_ADMIN'],
            required: true,
            name: 'Permission'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.permissions(this.flags.project).users().update(this.flags.name, this.flags.permission);
            response.status = 0;
            response.message = this.getRecordUpdatedText('User Permissions');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}