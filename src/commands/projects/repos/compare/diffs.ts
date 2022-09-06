import { Flags } from "@oclif/core";
import { CommitDiff, CommitDiffOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { CommitDiffColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Diffs extends BaseCommand {
    static description = 'Retrieve changesets for the specified pull request. ' + UX.processDocumentation('<doc:CommitDiffOutput>');
    static examples = [
        `$ stash projects:repost:compare:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --context-lines 5 --csv`,
        `$ stash projects:repost:compare:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --src "path/to/src/path" --'without-comments' --json`,
        `$ stash projects:repost:compare:diffs -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --path "path/to/file" --limit 30`,
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
        from: Flags.string({
            description: 'The source changeset (can be a partial/full changeset id or qualified/unqualified ref name)',
            required: false,
            name: 'From'
        }),
        to: Flags.string({
            description: 'The target changeset (can be a partial/full changeset id or qualified/unqualified ref name)',
            required: false,
            name: 'To'
        }),
        'from-repo': Flags.string({
            description: 'An optional parameter specifying the source repository containing the source changeset if that changeset is not present in the current repository; the repository can be specified by either its ID 42 or by its project key plus its repo slug separated by a slash: projectKey/repoSlug',
            required: false,
            name: 'From Repo'
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
            const result = await connector.projects.repos(this.flags.project).compare(this.flags.slug).diff().list({
                contextLines: this.flags['context-lines'],
                srcPath: this.flags.src,
                whitespace: this.flags.whitespace,
                from: this.flags.from,
                to: this.flags.from,
                fromRepo: this.flags['from-repo'],
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