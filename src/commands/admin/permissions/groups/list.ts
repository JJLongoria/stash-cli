import { Flags } from "@oclif/core";
import { Group, Page, PermissionGroups, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { GroupColumns, GroupPermissionsColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class List extends BaseCommand {
    static description = 'Retrieve a page of Groups with at least one permission, or retrieve a page of Groups without any permission. ' + UX.processDocumentation('<doc:PermissionGroups>');
    static examples = [
        `$ stash admin:permissions:groups:list -a MyStashAlias --all`,
        `$ stash admin:permissions:groups:list -a MyStashAlias -l 100 -s 50`,
        `$ stash admin:permissions:groups:list -a MyStashAlias --filter "groupName" --limit 30`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        ...BuildFlags.pagination,
        filter: BuildFlags.filter('If specified only group names containing the supplied string will be returned'),
        none: Flags.boolean({
            description: 'Retrieve a page of groups that have no granted global permissions. ' + UX.processDocumentation('<doc:Group>'),
            name: 'None'
        }),
    };
    async run(): Promise<StashCLIResponse<Page<PermissionGroups | Group>>> {
        const response = new StashCLIResponse<Page<PermissionGroups | Group>>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let result: Page<PermissionGroups | Group> = new Page();
            if (this.flags.all) {
                if (this.flags.none) {
                    let tmp = await connector.admin.permissions().groups().none(this.flags.filter, this.allPageOptions);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.admin.permissions().groups().none(this.flags.filter, {
                            start: tmp.nextPageStart,
                            limit: 100,
                        });
                        result.values.push(...tmp.values);
                    }
                } else {
                    let tmp = await connector.admin.permissions().groups().list(this.flags.filter, this.allPageOptions);
                    result.values.push(...tmp.values);
                    result.isLastPage = true;
                    result.start = tmp.start;
                    while (!tmp.isLastPage) {
                        tmp = await connector.admin.permissions().groups().list(this.flags.filter, {
                            start: tmp.nextPageStart,
                            limit: 100,
                        });
                        result.values.push(...tmp.values);
                    }
                }
                result.size = result.values.length;
            } else {
                if (this.flags.none) {
                    result = await connector.admin.permissions().groups().none(this.flags.filter, this.pageOptions);
                } else {
                    result = await connector.admin.permissions().groups().list(this.flags.filter, this.pageOptions);
                }
            }
            response.result = result;
            response.status = 0;
            if (this.flags.none) {
                response.message = this.getRecordsFoundText(result.values.length, 'Groups');
                console.log(response.message);
                this.ux.table<Group>(result.values, GroupColumns, {
                    csv: this.flags.csv,
                });
            } else {
                response.message = this.getRecordsFoundText(result.values.length, 'Group Permissions');
                console.log(response.message);
                this.ux.table<PermissionGroups>(result.values, GroupPermissionsColumns, {
                    csv: this.flags.csv,
                });
            }
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}