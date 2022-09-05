import { Flags } from "@oclif/core";
import { Avatar, Project, ProjectInput, StashConnector } from "stash-connector";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { ProjectColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";
import { FileChecker, FileReader, PathUtils } from "../../libs/fileSystem";
import { CLIProjectInput } from "../../libs/types";

export default class Update extends BaseCommand {
    static description = 'Update the project matching the projectKey. ' + UX.processDocumentation('<doc:Project>');
    static examples = [
        `$ stash projects:update -a MyStashAlias --key "ProjectKey" --data "{ 'key': 'projectkey', 'name':'projectName', 'description'; 'desc', 'avatarFile': 'path/to/avatar' }" --json`,
        `$ stash projects:update -a MyStashAlias --key "ProjectKey" --file "path/to/json/data/file" --csv`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildFlags.csv,
        extended: BuildFlags.extended,
        alias: BuildFlags.alias,
        data: BuildFlags.input.jsonData('<doc:ProjectInput>', false),
        file: BuildFlags.input.jsonFile('<doc:ProjectInput>', false),
        key: Flags.string({
            description: 'The Project key to update',
            required: true,
            name: 'Key'
        }),
    };
    async run(): Promise<StashCLIResponse<Project>> {
        const response = new StashCLIResponse<Project>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const input = this.getJSONInputData() as CLIProjectInput;
            const data: ProjectInput = {
                description: input.description,
                key: input.key,
                name: input.name,
            }
            if(input.avatarFile){
                const extension = PathUtils.getFileExtension(input.avatarFile);
                const absoluePath = PathUtils.getAbsolutePath(input.avatarFile);
                if(!extension || extension.toLocaleLowerCase() !== 'png'){
                    throw new Error('Not allowed format. Only PNG images are allowed');
                }
                if(FileChecker.isExists(absoluePath)){
                    data.avatar = new Avatar(extension, btoa(FileReader.readFileSync(absoluePath)));
                } else {
                    throw new Error('File path ' + absoluePath + ' does not exists');
                }
            }
            const project = await connector.projects.update(this.flags.key, data);
            response.result = project;
            response.status = 0;
            response.message = this.getRecordCreatedText('Project');
            this.ux.log(response.message);
            this.ux.table<Project>([project], ProjectColumns, {
                csv: this.flags.csv,
                extended: this.flags.extended || this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}