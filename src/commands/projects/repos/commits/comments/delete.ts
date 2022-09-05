import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { UX } from "../../../../../libs/core/ux";

export default class Delete extends BaseCommand {
    static description = 'Delete a commit comment. Anyone can delete their own comment. Only users with REPO_ADMIN and above may delete comments created by other users.';
    static examples = [
        `$ stash projects:repos:commits:comments:delete -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567 --csv`,
        `$ stash projects:repos:commits:comments:delete -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567 --json`,
        `$ stash projects:repos:commits:comments:delete -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to delete the commit comment',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to delete the commit comment',
            required: true,
            name: 'Slug',
        }),
        commit: Flags.integer({
            description: 'The commit Id to delete the comment',
            required: false,
            name: 'Commit Id',
        }),
        comment: Flags.integer({
            description: 'The Comment Id to delete',
            required: false,
            name: 'Comment Id',
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.repos(this.flags.project).commits(this.flags.slug).comments(this.flags.commit).delete(this.flags.comment);
            response.status = 0;
            response.message = this.getRecordDeletedText('Comment');
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}