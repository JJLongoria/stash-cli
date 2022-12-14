import { Flags } from "@oclif/core";
import { Commit, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { CommitColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Commits extends BaseCommand {
    static description = 'Gets the commits accessible from the from changeset but not in the to changeset. If either the from or to changeset are not specified, they will be replaced by the default branch of their containing repository. ' + UX.processDocumentation('<doc:Commit>');
    static examples = [
        `$ stash projects:repos:compare:commits -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:compare:commits -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --from "45ajd3k4" -l 100 -s 50 --json`,
        `$ stash projects:repos:compare:commits -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --from "45ajd3k4" --to "asj767skf6" --limit 30`,
        `$ stash projects:repos:compare:commits -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --from-repo "project/repo" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to compare commits',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to compare commits',
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
            description: 'An optional parameter specifying the source repository containing the source changeset if that changeset is not present in the current repository; the repository can be specified by either its ID 42 or by its Project Key (or user slug like ~userSlug) plus its repo slug separated by a slash: projectKey/repoSlug',
            required: false,
            name: 'From Repo'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Commit>>> {
        const response = new StashCLIResponse<Page<Commit>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Commit> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).compare(this.flags.slug).commits().list({
                    from: this.flags.from,
                    to: this.flags.to,
                    fromRepo: this.flags['from-repo'],
                    pageOptions: this.allPageOptions
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).compare(this.flags.slug).commits().list({
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
                result = await connector.projects.repos(this.flags.project).compare(this.flags.slug).commits().list({
                    from: this.flags.from,
                    to: this.flags.to,
                    fromRepo: this.flags['from-repo'],
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Commit');
            this.ux.log(response.message);
            this.ux.table<Commit>(result.values, CommitColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}