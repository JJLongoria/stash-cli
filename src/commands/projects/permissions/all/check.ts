import { Flags } from "@oclif/core";
import { PermittedOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { PermittedColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Check extends BaseCommand {
    static description = 'Check whether the specified permission is the default permission (granted to all users) for a project. ' + UX.processDocumentation('<doc:PermittedOutput>');
    static examples = [
        `$ stash projects:permissions:groups:list --project "ProjectKey" -a MyStashAlias --all`,
        `$ stash projects:permissions:groups:list --project "ProjectKey" --none -a MyStashAlias -l 100 -s 50`,
        `$ stash projects:permissions:groups:list --project "ProjectKey" -a MyStashAlias --filter "groupName" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to get the groups',
            required: true,
            name: 'Project'
        }),
        permission: Flags.string({
            description: 'The permission to check',
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
            const result = await connector.projects.permissions(this.flags.project).all(this.flags.permission).check()
            response.result = result;
            response.status = 0;
            response.message = 'Permissions Checked successffully';
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