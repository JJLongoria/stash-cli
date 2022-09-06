import { Flags } from "@oclif/core";
import { PermittedOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { PermittedColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Check extends BaseCommand {
    static description = 'Grant a project permission to all users. ' + UX.processDocumentation('<doc:PermittedOutput>');
    static examples = [
        `$ stash projects:permissions:all:grant -a MyStashAlias --project "ProjectKey" --permission PROJECT_READ`,
        `$ stash projects:permissions:all:grant -a MyStashAlias --project "ProjectKey" --permission PROJECT_WRITE --json`,
        `$ stash projects:permissions:all:grant -a MyStashAlias --project "ProjectKey" --permission PROJECT_ADMIN --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to grant permissions',
            required: true,
            name: 'Project'
        }),
        permission: Flags.string({
            description: 'The permission to grant',
            type: "option",
            options: ['PROJECT_READ', 'PROJECT_WRITE', 'PROJECT_ADMIN'],
            required: true,
            name: 'Permission'
        }),
    };
    async run(): Promise<StashCLIResponse<PermittedOutput>> {
        const response = new StashCLIResponse<PermittedOutput>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.permissions(this.flags.project).all(this.flags.permission).update(true)
            response.result = result;
            response.status = 0;
            response.message = 'Permissions Grantted successffully';
            this.ux.log(response.message);
            this.ux.table<PermittedOutput>([result], PermittedColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}