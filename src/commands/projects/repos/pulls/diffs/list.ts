import { Flags } from "@oclif/core";
import { CommitDiff, CommitDiffOutput, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { CommitDiffColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve changesets for the specified pull request. ' + UX.processDocumentation('<doc:CommitDiffOutput>');
    static examples = [
        `$ stash projects:repost:pulls:diffs:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --context-lines 5 --csv`,
        `$ stash projects:repost:pulls:diffs:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --src "path/to/src/path" --'without-comments' --json`,
        `$ stash projects:repost:pulls:diffs:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --path "path/to/file" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to retrieve repository pull requests commits',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the pull requests commits',
            required: true,
            name: 'Slug'
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to retrieve commits',
            required: true,
            name: 'Pull Request Id',
        }),
        'context-lines': Flags.integer({
            description: 'The number of context lines to include around added/removed lines in the diff.',
            required: false,
            default: -1,
            name: 'Context Lines',
        }),
        src: Flags.string({
            description: 'The previous path to the file, if the file has been copied, moved or renamed.',
            required: false,
            name: 'Src Path',
        }),
        whitespace: Flags.string({
            description: 'optional whitespace flag which can be set to ignore-all.',
            required: false,
            name: 'Whitespace',
        }),
        'without-comments': Flags.boolean({
            description: 'False to embed comments in the diff (the default); otherwise, true to stream the diff without comments.',
            required: false,
            name: 'Context Lines',
        }),
        path: Flags.string({
            description: 'the path to the file which should be diffed.',
            required: false,
            name: 'Path',
        }),
    };
    async run(): Promise<StashCLIResponse<CommitDiffOutput>> {
        const response = new StashCLIResponse<CommitDiffOutput>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).diff(this.flags.pull).list({
                contextLines: this.flags['context-lines'],
                srcPath: this.flags.src,
                whitespace: this.flags.whitespace,
                withComments: !this.flags['without-comments'],
                pageOptions: this.pageOptions,
            }, this.flags.path);
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.diffs.length, 'Diff');
            this.ux.log(response.message);
            this.ux.table<CommitDiff>(result.diffs, CommitDiffColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}