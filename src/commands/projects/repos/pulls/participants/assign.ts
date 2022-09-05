import { Flags } from "@oclif/core";
import { Participant, ParticipantInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../../libs/core/stashResponse";
import { ParticipantColumns } from "../../../../../libs/core/tables";
import { UX } from "../../../../../libs/core/ux";

export default class Assign extends BaseCommand {
    static description = 'Assigns a participant to an explicit role in pull request. Currently only the REVIEWER role may be assigned. ' + UX.processDocumentation('<doc:Participant>');
    static examples = [
        `$ stash projects:repos:pulls:participants:assign -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --user "UserName" --csv`,
        `$ stash projects:repos:pulls:participants:assign -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --user "UserName" --role "REVIEWER" --json`,
        `$ stash projects:repos:pulls:participants:assign -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --pull 1234 --user "UserName"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        alias: BuildFlags.alias,
        project: Flags.string({
            description: 'The Project key to create the pull request comment',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to create the pull request comment',
            required: true,
            name: 'Slug',
        }),
        pull: Flags.integer({
            description: 'The Pull Request Id to create the pull request comment',
            required: true,
            name: 'Pull Request Id',
        }),
        user: Flags.string({
            description: 'The Participant name to assign',
            required: true,
            name: 'User',
        }),
        role: Flags.string({
            description: 'The Participant role to assign',
            default: 'REVIEWER',
            options: ['AUTHOR', 'REVIEWER', 'PARTICIPANT'],
            type: "option",
            name: 'Role',
        }),
    };
    async run(): Promise<StashCLIResponse<Participant>> {
        const response = new StashCLIResponse<Participant>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let inputData: ParticipantInput = {
                role: this.flags.role,
                user: {
                    name: this.flags.user,
                }
            };
            const comment = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).participants(this.flags.pull).assign(inputData);
            response.result = comment;
            response.status = 0;
            response.message = this.getRecordCreatedText('Comment');
            this.ux.log(response.message);
            this.ux.table<Participant>([comment], ParticipantColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}