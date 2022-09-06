import { Flags } from "@oclif/core";
import { CommitDiff, CommitDiffOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../libs/core/stashResponse";
import { CommitDiffColumns } from "../../../libs/core/tables";
import { UX } from "../../../libs/core/ux";

export default class Diff extends BaseCommand {
    static description = 'Retrieve changesets for the specified pull request. ' + UX.processDocumentation('<doc:CommitDiffOutput>');
    static examples = [
        `$ stash projects:repos:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --until "as48llmdf" --context-lines 5 --csv`,
        `$ stash projects:repos:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --until "as48llmdf" --src "path/to/src/path" --'without-comments' --json`,
        `$ stash projects:repos:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --until "as48llmdf" --path "path/to/file" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to compare diffs',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to compare diffs',
            required: true,
            name: 'Slug'
        }),
        since: Flags.string({
            description: 'The base revision to diff from. If omitted the parent revision of the until revision is used',
            required: false,
            name: 'From'
        }),
        until: Flags.string({
            description: 'The target revision to diff to (required)',
            required: true,
            name: 'To'
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
        path: Flags.string({
            description: 'The path to the file which should be diffed.',
            required: false,
            name: 'Path',
        }),
    };
    async run(): Promise<StashCLIResponse<CommitDiffOutput>> {
        const response = new StashCLIResponse<CommitDiffOutput>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const result = await connector.projects.repos(this.flags.project).diff(this.flags.slug).list({
                contextLines: this.flags['context-lines'],
                srcPath: this.flags.src,
                whitespace: this.flags.whitespace,
                since: this.flags.since,
                until: this.flags.until,
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