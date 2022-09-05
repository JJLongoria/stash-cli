import { Flags } from "@oclif/core";
import { Page, Project, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { ProjectColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of projects. ' + UX.processDocumentation('<doc:Project>');
    static examples = [
        `$ stash projects:list -a MyStashAlias --all --csv`,
        `$ stash projects:list -a MyStashAlias --name "projectname" -l 100 -s 50 --json`,
        `$ stash projects:list -a MyStashAlias --permission "ADMIN" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        name: Flags.string({
            description: 'Search projects by name',
            required: false,
            name: 'Name'
        }),
        permission: Flags.string({
            description: 'Search projects by permission',
            required: false,
            name: 'Permission'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<Project>>> {
        const response = new StashCLIResponse<Page<Project>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<Project> = new Page();
            if (this.flags.all) {
                let tmp = await connector.projects.list(this.flags.name, this.flags.permission, this.allPageOptions);
                result.values.push(...tmp.values);
                result.isLastPage = true;
                result.start = tmp.start;
                while (!tmp.isLastPage) {
                    tmp = await connector.projects.list(this.flags.name, this.flags.permission, {
                        start: tmp.nextPageStart,
                        limit: 100,
                    });
                    result.values.push(...tmp.values);
                }
                result.size = result.values.length;
            } else {
                result = await connector.projects.list(this.flags.name, this.flags.permission, this.pageOptions);
            }
            response.result = result;
            response.status = 0;
            response.message = this.getRecordsFoundText(result.values.length, 'Project');
            this.ux.log(response.message);
            this.ux.table<Project>(result.values, ProjectColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}