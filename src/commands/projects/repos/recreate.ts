import { Flags } from "@oclif/core";
import { Repository, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { RepositoryColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Recreate extends BaseCommand {
    static description = 'If a create or fork operation fails, calling this method will clean up the broken repository and try again. ' + UX.processDocumentation('<doc:Repository>');
    static examples = [
        `$ stash projects:repos:recreate -a MyStashAlias --project "ProjectKey" --csv`,
        `$ stash projects:repos:recreate -a MyStashAlias --project "ProjectKey" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to recreate the repository',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to recreate',
            required: true,
            name: 'Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<Repository>> {
        const response = new StashCLIResponse<Repository>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).recreate(this.flags.slug).rebuild();
            response.result = result;
            response.status = 0;
            response.message = this.getRecordCreatedText('Repository');
            this.ux.log(response.message);
            this.ux.table<Repository>([result], RepositoryColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}