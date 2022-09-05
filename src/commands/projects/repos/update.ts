import { Flags } from "@oclif/core";
import { Repository, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { RepositoryColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Update extends BaseCommand {
    static description = 'Update the repository matching the repositorySlug supplied in the resource path. ' + UX.processDocumentation('<doc:Repository>');
    static examples = [
        `$ stash projects:repos:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --data "{ 'forkable': true, 'name': 'NewName' }" --json`,
        `$ stash projects:repos:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --file "path/to/the/json/data" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:UpdateRepoInput>', false),
        file: BuildFlags.input.jsonFile('<doc:UpdateRepoInput>', false),
        project: Flags.string({
            description: 'The Project key to update repository',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to update.',
            required: true,
            name: 'Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<Repository>> {
        const response = new StashCLIResponse<Repository>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).update(this.flags.slug, this.getJSONInputData());
            response.result = result;
            response.status = 0;
            response.message = this.getRecordUpdatedText('Repository');
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