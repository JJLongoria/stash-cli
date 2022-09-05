import { Flags } from "@oclif/core";
import { Comment, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { CommentColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Get extends BaseCommand {
    static description = 'Retrieves a commit comment. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        `$ stash projects:repos:commits:comments:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567 --csv`,
        `$ stash projects:repos:commits:comments:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567 --json`,
        `$ stash projects:repos:commits:comments:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567 `,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to get the commit comment',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to get the commit comment',
            required: true,
            name: 'Slug',
        }),
        commit: Flags.integer({
            description: 'The commit Id to get the comment',
            required: false,
            name: 'Commit Id',
        }),
        comment: Flags.integer({
            description: 'The Comment Id to get',
            required: false,
            name: 'Comment Id',
        }),
    };
    async run(): Promise<StashCLIResponse<Comment>> {
        const response = new StashCLIResponse<Comment>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const comment = await connector.projects.repos(this.flags.project).commits(this.flags.slug).comments(this.flags.commit).get(this.flags.comment);
            response.result = comment;
            response.status = 0;
            response.message = this.getRecordRetrievedText('Comment');
            this.ux.log(response.message);
            this.ux.table<Comment>([comment], CommentColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}