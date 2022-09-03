import { Command, Flags } from "@oclif/core";
import { OutputArgs, OutputFlags } from "@oclif/core/lib/interfaces";
import { PageOptions, StashError } from "stash-connector";
import { Config } from "./config";
import { StashCLIErrorData, StashCLIResponse } from "./stashResponse";
import { UX } from "./ux";

export class BuildCommands {
    static alias = Flags.string({
        description: 'The Stash instance alias to identify user and instance on other operations',
        required: true,
        char: 'a',
        name: 'Alias'
    });
    static csv = Flags.boolean({
        description: 'Format output as CSV format',
        required: false,
        name: 'CSV',
        exclusive: ['json']
    });
    static pagination = {
        all: Flags.boolean({
            description: 'Return all records on the same page (instead paginate results)',
            required: false,
            name: 'All',
            exclusive: ['limit'],
            default: false,
        }),
        limit: Flags.integer({
            description: 'Indicates how many results to return per page',
            required: false,
            name: 'Limit',
            char: 'l',
            exclusive: [],
            default: 25,
        }),
        start: Flags.integer({
            description: 'Indicates which item should be used as the first item in the page of results',
            required: false,
            name: 'Start',
            char: 's',
            exclusive: [],
            default: 0,
        }),
    };
}



export class BaseCommand extends Command {

    protected localConfig: Config = new Config(this.config.dataDir);
    protected flags!: OutputFlags<any>;
    protected args!: OutputArgs;
    static flags: OutputFlags<any> = {
        loglevel: Flags.string({
            description: 'The logging level for this command execution',
            type: "option",
            options: ['error', 'warn', 'info', 'debug'],
        }),
    }
    static loginRequired = true;
    static enableJsonFlag = true;
    protected ux = new UX();

    protected get statics(): typeof BaseCommand {
        return this.constructor as typeof BaseCommand;
    }

    get pageOptions(): PageOptions | undefined {
        if (!this.flags.all) {
            return {
                limit: this.flags.limit,
                start: this.flags.start
            }
        }
        return undefined;
    }

    get allPageOptions(): PageOptions | undefined {
        if (this.flags.all) {
            return {
                limit: 100,
                start: this.flags.start
            }
        }
        return undefined;
    }

    checkLogin() {
        if (this.flags.alias && this.localConfig.instances) {
            if (!this.localConfig.instances[this.flags.alias]) {
                throw new Error('Not found instance with alias ' + this.flags.alias + '. Check spelling name or login as new instance');
            }
        }
    }

    log(message: string, level: 'info' | 'debug' | 'warn' | 'error') {
        switch (this.flags.loglevel) {
            case 'error':
                if (level === 'error') {
                    this.error(message);
                }
                break;
            case 'debug':
                if (level === 'debug') {
                    console.log(message);
                }
                break;
            case 'warn':
                if (level === 'warn') {
                    this.warn(message);
                }
                break;
            case 'info':
                if (level === 'info') {
                    this.warn(message);
                }
                break;
        }
    }

    /*public async _run<T>(): Promise<any> {
        // If a result is defined for the command, use that.  Otherwise check for a
        // tableColumnData definition directly on the command.
        let err: any;
        try {
            await this.init();
            return await this.run();
        } catch (e) {
            err = e as Error;
            await this.catch(e);
        } finally {
            await this.finally(err);
        }
    }*/

    async init() {
        // do some initialization
        this.localConfig.load();
        super.init();

        const { args, flags } = await this.parse(this.statics);
        this.flags = flags;
        this.args = args;
        if (this.statics.loginRequired) {
            this.checkLogin();
        }
    }

    processError(response: StashCLIResponse<any>, error: any) {
        const err = error as Error;
        if (err.name === 'StashError') {
            const stashError = error as StashError;
            response.status = -1;
            response.message = stashError.message || stashError.statusText;
            response.error = stashError;
            console.error(response.message);
            if (stashError.errors) {
                this.ux.table<StashCLIErrorData>(stashError.errors, {
                    id: {
                        header: 'ID',
                    },
                    name: {
                        header: 'Name',
                    },
                    address: {
                        header: 'Address',
                        get: (row) => { row.hostName + ':' + row.port }
                    },
                    local: {
                        header: 'Local',
                    },
                }, {
                    csv: this.flags.csv
                });
            }
        } else {
            throw err;
        }
    }

    async catch(err: any) {
        if (err.code === 'EEXIT') {
            throw err;
        }

        if (err instanceof Error) {
            err.name = err.name === 'StashError' ? 'StashError' : err.name.replace(/Error$/, '');
        }

        process.exitCode = process.exitCode || err.exitCode || 1;
        console.error('ERROR: ' + err.message);
    }
    async finally(err: any) {
        // called after run and catch regardless of whether or not the command errored
        return super.finally(err);
    }

    async run(): Promise<any> {

    }

}