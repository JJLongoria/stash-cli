import { Flags } from "@oclif/core";
import { Repository, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { RepositoryColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieve the repository matching the supplied projectKey and repositorySlug. ' + UX.processDocumentation('<doc:Repository>');
    static examples = [
        `$ stash projects:repos:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --csv`,
        `$ stash projects:repos:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to retrieve the repository',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve',
            required: true,
            name: 'Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<Repository>> {
        const response = new StashCLIResponse<Repository>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).get(this.flags.slug);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Repository');
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