import { Flags } from "@oclif/core";
import { PullRequest, PullRequestInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../../../libs/core/baseCommand";
import { StashCLIResponse } from "../../../../libs/core/stashResponse";
import { PullRequestColumns } from "../../../../libs/core/tables";
import { UX } from "../../../../libs/core/ux";

export default class Create extends BaseCommand {
    static description = 'Create a new pull request between two branches. The branches may be in the same repository, or different ones. When using different repositories, they must still be in the same hierarchy. ' + UX.processDocumentation('<doc:PullRequest>');
    static examples = [
        `$ stash projects:repos:pulls:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --data "{'title':'<Title>','description':'<description>','state':'OPEN','open':true,'closed':false,'fromRef':{'id':'refs/heads/feature-ABC-123','repository':{'slug':'MyRepoSlug','name':null,'project':{'key':'ProjectKey'}}},'toRef':{'id':'refs/heads/master','repository':{'slug':'MyRepoSlug','name':null,'project':{'key':'ProjectKey'}}},'locked':false,'reviewers':[{'user':{'name':'jonh.smith'}}]}" --json`,
        `$ stash projects:repos:pulls:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --file "path/to/json/data/file" --csv`,
        `$ stash projects:repos:pulls:create -a MyStashAlias --project "ProjectKey" --slug "MyRepoSlug" --title "Title" --description "desc" --from "develop" --to "main" --reviewers "john.smith, jenny.smith"`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:PullRequestInput>', false, ['from', 'to', 'title', 'description', 'from', 'reviewers']),
        file: BuildFlags.input.jsonFile('<doc:PullRequestInput>', false, ['from', 'to', 'title', 'description', 'from', 'reviewers']),
        project: Flags.string({
            description: 'The Project Key (or user slug like ~userSlug) to create the pull request',
            required: true,
            name: 'Project'
        }),
        slug: Flags.string({
            description: 'The Repository slug to create the pull request',
            required: true,
            name: 'Slug'
        }),
        title: Flags.string({
            description: 'The Pull Request Title',
            required: false,
            name: 'Title',
            exclusive: ['data', 'file'],
            dependsOn: ['to', 'description', 'from']
        }),
        description: Flags.string({
            description: 'The Pull Request Description',
            required: false,
            name: 'Description',
            exclusive: ['data', 'file'],
            dependsOn: ['to', 'from', 'title']
        }),
        from: Flags.string({
            description: 'The source (from ref) branch to create tthe pull request',
            required: false,
            name: 'From',
            exclusive: ['data', 'file'],
            dependsOn: ['to', 'description', 'title']
        }),
        to: Flags.string({
            description: 'The target (to ref) branch to create the pull request',
            required: false,
            name: 'To',
            exclusive: ['data', 'file'],
            dependsOn: ['from', 'description', 'title']
        }),
        reviewers: Flags.string({
            description: 'Comma separated pull requests reviewers names',
            required: false,
            name: 'Reviewers',
            exclusive: ['data', 'file'],
            dependsOn: ['from', 'description', 'title', 'to'],
            parse: (input): any => {
                return BuildFlags.parseArray(input);
            }
        }),
    };
    async run(): Promise<StashCLIResponse<PullRequest>> {
        const response = new StashCLIResponse<PullRequest>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            let inputData: PullRequestInput;
            if (this.hasInputData()) {
                inputData = this.getInputData() as PullRequestInput;
            } else {
                inputData = {
                    description: this.flags.description,
                    title: this.flags.title,
                    fromRef: {
                        id: '',
                        repository: {
                            slug: this.flags.slug,
                            project: {
                                key: this.flags.project
                            }
                        }
                    },
                    toRef: {
                        id: '',
                        repository: {
                            slug: this.flags.slug,
                            project: {
                                key: this.flags.project
                            }
                        }
                    },
                    state: "OPEN",
                    closed: false,
                    open: true,
                    locked: false,
                    reviewers: this.flags.reviewers,
                }
                const fromBranchResult = await connector.projects.repos(this.flags.project).branches(this.flags.slug).list({
                    filterText: this.flags.from,
                });
                if (fromBranchResult.values.length === 0) {
                    throw new Error('From branch not found (' + this.flags.from + ')');
                } 
                if(fromBranchResult.values.length > 1){
                    throw new Error('Found more than one branch as from with name (' + this.flags.from + ')');
                }
                const toBranchResult = await connector.projects.repos(this.flags.project).branches(this.flags.slug).list({
                    filterText: this.flags.to,
                });
                if (toBranchResult.values.length === 0) {
                    throw new Error('From branch not found (' + this.flags.from + ')');
                }
                if(toBranchResult.values.length > 1){
                    throw new Error('Found more than one branch as to with name (' + this.flags.to + ')');
                }
                const fromBranch = fromBranchResult.values[0];
                const toBranch = toBranchResult.values[0];
                inputData.fromRef.id = fromBranch.id;
                inputData.toRef.id = toBranch.id;
            }
            const pullRequest = await connector.projects.repos(this.flags.project).pullRequests(this.flags.slug).create(inputData);
            response.result = pullRequest;
            response.status = 0;
            response.message = this.getRecordCreatedText('Pull Request');
            this.ux.log(response.message);
            this.ux.table<PullRequest>([pullRequest], PullRequestColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}