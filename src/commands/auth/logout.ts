import { Flags } from "@oclif/core";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { InstanceColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";
import { Instance } from "../../libs/types";

export default class Logout extends BaseCommand {
    static loginRequired = false;
    static description = 'Logout againts Stash instance.';
    static examples = [
        `$ stash auth:logout -a "Alias" --json`,
        `$ stash auth:logout -a "Alias"`,
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
    };

    async run(): Promise<StashCLIResponse<Instance>> {
        const { alias } = this.flags;
        const response = new StashCLIResponse<Instance>();
        if (this.localConfig.instances && this.localConfig.instances[alias]) {
            delete this.localConfig.instances[alias];
        }
        this.localConfig.save();
        const message = 'Instace with alias ' + alias + ' logout successfully';
        response.status = 0;
        response.message = message
        response.result = this.localConfig.instances[alias];
        this.ux.table<Instance>([response.result], InstanceColumns, {
            csv: this.flags.csv,
        });
        return response;
    }
}