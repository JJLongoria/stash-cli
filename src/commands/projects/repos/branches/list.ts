import { Flags } from "@oclif/core";
import { Branch, Page, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { BranchColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve the branches matching the supplied filterText param. ' + UX.processDocumentation('<doc:Branch>');
    static examples = [
        `$ stash projects:repos:branches:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:branches:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --filter "FilterBranches" -l 100 -s 50 --json`,
        `$ stash projects:repos:branches:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --details --order ALPHABETICAL --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project key to retrieve repository branches',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the branches',
            required: true,
            name: 'Slug'
        }),
        base: Flags.string({
            description: 'Base branch or tag to compare each branch to (for the metadata providers that uses that information)',
            required: false,
            name: 'Base'
        }),
        details: Flags.boolean({
            description: 'Whether to retrieve plugin-provided metadata about each branch',
            required: false,
            name: 'Details'
        }),
        filter: Flags.string({
            description: 'The text to match on',
            required: false,
            name: 'Details'
        }),
        order: Flags.string({
            description: 'Whether to retrieve plugin-provided metadata about each branch',
            required: false,
            type: "option",
            options: ['ALPHABETICAL', 'MODIFICATION'],
            name: 'Order By'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Branch>>> {
        const response = new StashCLIResponse<Page<Branch>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Branch> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).branches(this.flags.slug).list({
                    base: this.flags.base,
                    details: this.flags.details,
                    filterText: this.flags.filter,
                    orderBy: this.flags.order,
                    pageOptions: this.allPageOptions
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).branches(this.flags.slug).list({
                        base: this.flags.base,
                        details: this.flags.details,
                        filterText: this.flags.filter,
                        orderBy: this.flags.order,
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).branches(this.flags.slug).list({
                    base: this.flags.base,
                    details: this.flags.details,
                    filterText: this.flags.filter,
                    orderBy: this.flags.order,
                    pageOptions: this.pageOptions
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Branch');
            console.log(response.message);
            this.ux.table<Branch>(result.values, BranchColumns, {
                csv: this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}