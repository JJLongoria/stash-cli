import { Flags } from "@oclif/core";
import { Page, Repository, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { RepositoryColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of recently accessed repositories for the currently authenticated user. ' + UX.processDocumentation('<doc:Repository>');
    static examples = [
        `$ stash profile:recent:repos:list -a MyStashAlias --all`,
        `$ stash profile:recent:repos:list -a MyStashAlias -l 100 -s 50`,
        `$ stash profile:recent:repos:list -a MyStashAlias --permission "REPO_WRITE" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        permission: Flags.string({
            description: '',
            required: false,
            name: 'Permission',
            default: 'REPO_READ',
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Repository>>> {
        const response = new StashCLIResponse<Page<Repository>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Repository> = new Page();
            if (this.flags.all) {
                let tmp = await connector.profile.recent().repos(this.flags.permission, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.profile.recent().repos(this.flags.permission, {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.profile.recent().repos(this.flags.permission, this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Repository');
            this.ux.log(response.message);
            this.ux.table<Repository>(result.values, RepositoryColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv,
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}