import { Flags } from "@oclif/core";
import { BaseCommand, BuildFlags } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { InstanceColumns } from "../../libs/core/tables";
import { UX } from "../../libs/core/ux";
import { Instance } from "../../libs/types";

export default class Login extends BaseCommand {
    static loginRequired = false;
    static description = 'Login againts Stash instance. Return the Stash Instance data. ' + UX.processDocumentation('<doc:Instance>');
    static examples = [
        `$ stash auth:login -a "Alias" -u "username" -p "password" -h "http.//stash.example.com" --csv`,
        `$ stash auth:login -a "Alias" -u "username" -p "password" -h "http.//stash.example.com" -o --json`,
    ];

    static flags = {
        ...BaseCommand.flags,
        alias: BuildFlags.alias,
        csv: BuildFlags.csv,
        username: Flags.string({
            description: 'The Stash username to login',
            required: true,
            char: 'u',
            name: 'Username'
        }),
        password: Flags.string({
            description: 'The Stash password',
            required: true,
            char: 'p',
            name: 'Password',
        }),
        host: Flags.url({
            description: 'The Stash host URL to login and work with it',
            required: true,
            char: 'h',
            name: 'Host'
        }),
        override: Flags.boolean({
            description: 'Override the existing Stash instance configuration',
            required: false,
            char: 'o',
            name: 'Override'
        })
    };

    async run(): Promise<StashCLIResponse<Instance>> {
        const { host, alias, username, password } = this.flags;
        const response = new StashCLIResponse<Instance>();
        if (this.localConfig.instances && this.localConfig.instances[alias]) {
            if (this.flags.override) {
                this.localConfig.instances[alias] = {
                    host: host.href,
                    alias: alias,
                    token: Buffer.from(username + ':' + password).toString('base64'),
                }
            } else {
                throw new Error('An existing instance exists with the same alias. Use override flag if you want to override it');
            }
        } else {
            this.localConfig.instances[alias] = {
                host: host.href,
                alias: alias,
                token: Buffer.from(username + ':' + password).toString('base64'),
            }
        }
        this.localConfig.save();
        const message = 'Instace with alias ' + alias + ' logged successfully';
        response.status = 0;
        response.message = message
        response.result = this.localConfig.instances[alias];
        this.ux.table<Instance>([response.result], InstanceColumns, {
            csv: this.flags.csv,
        });
        return response;
    }
}