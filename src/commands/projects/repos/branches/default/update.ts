import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";

export default class Update extends BaseCommand {
    static description = 'Update the default branch of a repository.';
    static examples = [
        `$ stash projects:repos:branches:default:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --branch "refs/head/main"`,
        `$ stash projects:repos:branches:default:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --branch "refs/head/other --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to retrieve the default branch',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the default branch',
            required: true,
            name: 'Slug'
        }),
        branch: Flags.string({
            description: 'The branch Id to set as new default branch (refs/heads/master)',
            required: true,
            name: 'Branch'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.repos(this.flags.project).branches(this.flags.slug).default().update(this.flags.branch);
            response.status = 0;
            response.message = this.getRecordUpdatedText('Default Branch');
            console.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}