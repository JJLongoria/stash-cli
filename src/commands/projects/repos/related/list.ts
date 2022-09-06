import { Flags } from "@oclif/core";
import { Page, Repository, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { RepositoryColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve repositories which are related to this one. Related repositories are from the same hierarchy as this repository. ' + UX.processDocumentation('<doc:Repository>');
    static examples = [
        `$ stash projects:repos:related:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:related:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" -l 100 -s 50 --json`,
        `$ stash projects:repos:related:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to retrieve related repositories',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve related repositories from',
            required: true,
            name: 'Slug'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Repository>>> {
        const response = new StashCLIResponse<Page<Repository>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Repository> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).related(this.flags.slug).list(this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).related(this.flags.slug).list({
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).related(this.flags.slug).list(this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Repository');
            this.ux.log(response.message);
            this.ux.table<Repository>(result.values, RepositoryColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}