import { Flags } from "@oclif/core";
import { StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";

export default class Revoke extends BaseCommand {
    static description = 'Revoke all permissions for the specified repository for a group.';
    static examples = [
        `$ stash projects:repos:permissions:groups:revoke -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --name groupName --csv`,
        `$ stash projects:repos:permissions:groups:revoke -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --name groupName --json`,
        `$ stash projects:repos:permissions:groups:revoke -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --name otherGroup`,
    ];
    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to revoke permission groups',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository to revoke permission groups',
            required: true,
            name: 'Slug'
        }),
        name: Flags.string({
            description: 'The name of the group',
            required: true,
            name: 'Name'
        }),
    };
    async run(): Promise<StashCLIResponse<any>> {
        const response = new StashCLIResponse<any>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            await connector.projects.repos(this.flags.project).permissions(this.flags.input).groups().revoke(this.flags.name);
            response.status = 0;
            response.message = 'Group Permissions Revoked successfully';
            this.ux.log(response.message);
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}