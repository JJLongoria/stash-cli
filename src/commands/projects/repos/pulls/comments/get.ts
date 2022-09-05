import { Flags } from "@oclif/core";
import { Comment, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { CommentColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Retrieves a pull request comment. ' + UX.processDocumentation('<doc:Comment>');
    static examples = [
        `$ stash projects:repos:pulls:comments:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --coment 4567 --csv`,
        `$ stash projects:repos:pulls:comments:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --coment 4567 --json`,
        `$ stash projects:repos:pulls:comments:get -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --coment 4567 `,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to get the pull request comment',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to get the pull request comment',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to get the pull request comment',
            required: true,
            name: 'Pull Request Id',
        }),
        comment: Flags.integer({
            description: 'The Comment Id to get',
            required: false,
            name: 'Comment Id',
            exclusive: ['data', 'file']
        }),
    };
    async run(): Promise<StashCLIResponse<Comment>> {
        const response = new StashCLIResponse<Comment>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const comment = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).comments(this.flags.pull).get(this.flags.comment);
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