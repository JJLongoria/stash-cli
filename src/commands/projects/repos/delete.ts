import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";

export default class Delete extends BaseCommand {
    static description = 'Schedule the repository matching the supplied projectKey and repositorySlug to be deleted.';
    static examples = [
        `$ stash projects:repos:delete -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug"`,
        `$ stash projects:repos:delete -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to delete the repository',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to delete',
            required: true,
            name: 'Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.repos(this.flags.project).delete(this.flags.slug)
            response.status = 0;
            response.message = this.getRecordDeletedText('Repository');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}