import { Flags } from "@oclif/core";
import { Page, PullRequest, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { PullRequestColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of pull requests to or from the specified repository. ' + UX.processDocumentation('<doc:PullRequest>');
    static examples = [
        `$ stash projects:repos:pulls:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --all --csv`,
        `$ stash projects:repos:pulls:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --direction OUTGOING -l 100 -s 50 --json`,
        `$ stash projects:repos:pulls:list -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --state OPEN --order OLDEST --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to retrieve repository pull requests',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to retrieve the pull requests',
            required: true,
            name: 'Slug'
        }),
        direction: Flags.string({
            description: 'The direction relative to the specified repository',
            required: false,
            options: ['INCOMING', 'OUTGOING'],
            default: 'INCOMING',
            type: "option",
            name: 'Direction'
        }),
        at: Flags.string({
            description: 'A fully-qualified branch ID to find pull requests to or from, such as refs/heads/master',
            required: false,
            name: 'At'
        }),
        state: Flags.string({
            description: ' Supply ALL to return pull request in any state. If a state is supplied only pull requests in the specified state will be returned',
            required: false,
            options: ['ALL', 'OPEN', 'DECLINED', 'MERGED'],
            type: "option",
            name: 'State'
        }),
        order: Flags.string({
            description: 'The order to return pull requests in, either OLDEST or NEWEST',
            required: false,
            options: ['OLDEST', 'NEWEST'],
            type: "option",
            name: 'Order'
        }),
        'with-attributes': Flags.boolean({
            description: 'Defaults to true, whether to return additional pull request attributes',
            required: false,
            default: true,
            name: 'With Attributes'
        }),
        'with-properties': Flags.boolean({
            description: 'Defaults to true, whether to return additional pull request properties',
            required: false,
            name: 'With Properties'
        }),

    };
    async run(): Promise<StashCLIResponse<Page<PullRequest>>> {
        const response = new StashCLIResponse<Page<PullRequest>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<PullRequest> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).list({
                    at: this.flags.at,
                    direction: this.flags.direction,
                    order: this.flags.order,
                    state: this.flags.state,
                    withAttributes: this.flags['with-attributes'],
                    withProperties: this.flags['with-properties'],
                    pageOptions: this.allPageOptions,
                });
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).list({
                        at: this.flags.at,
                        direction: this.flags.direction,
                        order: this.flags.order,
                        state: this.flags.state,
                        withAttributes: this.flags['with-attributes'],
                        withProperties: this.flags['with-properties'],
                        pageOptions: {
                            start: tmp.nextPageStart,
                            limit: 100,
                        }
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).list({
                    at: this.flags.at,
                    direction: this.flags.direction,
                    order: this.flags.order,
                    state: this.flags.state,
                    withAttributes: this.flags['with-attributes'],
                    withProperties: this.flags['with-properties'],
                    pageOptions: this.pageOptions,
                });
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Pull Request');
            this.ux.log(response.message);
            this.ux.table<PullRequest>(result.values, PullRequestColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}