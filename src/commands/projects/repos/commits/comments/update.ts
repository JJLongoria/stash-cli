import { Flags } from "@oclif/core";
import { Comment, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { CommentColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Update the text of a comment. Only the user who created a comment may update it. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        `$ stash projects:repos:commits:comments:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567 --text "Text to update" --version 2 --csv`,
        `$ stash projects:repos:commits:comments:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567 --text "Text to update" --version 2 --json`,
        `$ stash projects:repos:commits:comments:update -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --commit "a62ajdu128" --comment 4567 --text "Text to update" --version 2 `,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to update the commit comment',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to update the commit comment',
            required: true,
            name: 'Slug',
        }),
        commit: Flags.integer({
            description: 'The commit Id to update the comment',
            required: false,
            name: 'Commit Id',
        }),
        comment: Flags.integer({
            description: 'The Comment Id to update',
            required: false,
            name: 'Comment Id',
        }),
        text: Flags.string({
            description: 'The Comment text to update',
            required: true,
            name: 'Text',
        }),
        version: Flags.integer({
            description: 'The version of the comment to update. A version that must match the server\'s version of the comment or the update will fail',
            required: true,
            name: 'Text',
        }),
    };
    async run(): Promise<StashCLIResponse<Comment>> {
        const response = new StashCLIResponse<Comment>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const comment = await connector.projects.repos(this.flags.project).commits(this.flags.slug).comments(this.flags.pull).update(this.flags.comment, this.flags.text, this.flags.version);
            response.result = comment;
            response.status = 0;
            response.message = this.getRecordUpdatedText('Comment');
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