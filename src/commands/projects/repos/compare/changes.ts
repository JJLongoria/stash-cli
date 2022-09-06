import { Flags } from "@oclif/core";
import { Page, RepoChangesOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { RepoChangesColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Changes extends BaseCommand {
    static description = 'Gets the file changes available in the from changeset but not in the to changeset. If either the from or to changeset are not specified, they will be replaced by the default branch of their containing repository. ' + UX.processDocumentation('<doc:RepoChangesOutput>');
    static examples = [
        `$ stash projects:repos:compare:changes -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:compare:changes -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --from "45ajd3k4" -l 100 -s 50 --json`,
        `$ stash projects:repos:compare:changes -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --from "45ajd3k4" --to "asj767skf6" --limit 30`,
        `$ stash projects:repos:compare:changes -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --from-repo "project/repo" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to compare changes',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to compare changes',
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
    };
    async run(): Promise<StashCLIResponse<Page<RepoChangesOutput>>> {
        const response = new StashCLIResponse<Page<RepoChangesOutput>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<RepoChangesOutput> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).compare(this.flags.slug).changes().list({
                    from: this.flags.from,
                    to: this.flags.to,
                    fromRepo: this.flags['from-repo'],
                    pageOptions: this.allPageOptions
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).compare(this.flags.slug).changes().list({
                        from: this.flags.from,
                        to: this.flags.to,
                        fromRepo: this.flags['from-repo'],
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).compare(this.flags.slug).changes().list({
                    from: this.flags.from,
                    to: this.flags.to,
                    fromRepo: this.flags['from-repo'],
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Change');
            this.ux.log(response.message);
            this.ux.table<RepoChangesOutput>(result.values, RepoChangesColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}