import { Flags } from "@oclif/core";
import { Commit, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { CommitColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieve a single commit identified by its ID. In general, that ID is a SHA1. ' + UX.processDocumentation('<doc:Commit>');
    static examples = [
        `$ stash projects:repos:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --csv`,
        `$ stash projects:repos:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --json`,
        `$ stash projects:repos:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to retrieve the commit',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the commit',
            required: true,
            name: 'Slug'
        }),
        commit: Flags.string({
            description: 'The commit id to retrieve',
            required: true,
            name: 'Commit'
        }),
        path: Flags.string({
            description: 'An optional path to filter the commit by. If supplied the details returned may not be for the specified commit. Instead, starting from the specified commit, they will be the details for the first commit affecting the specified path.',
            required: false,
            name: 'Path'
        }),
    };
    async run(): Promise<StashCLIResponse<Commit>> {
        const response = new StashCLIResponse<Commit>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).commits(this.flags.slug).get(this.flags.commit, this.flags.path);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Commit');
            this.ux.log(response.message);
            this.ux.table<Commit>([result], CommitColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}