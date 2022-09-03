import { ClusterNode, ClusterOutput, StashConnector } from "stash-connector";
import { BaseCommand, BuildCommands } from "../../libs/core/baseCommand";
import { StashCLIResponse } from "../../libs/core/stashResponse";
import { ClusterNodeColumns } from "../../libs/core/tables";

export default class Cluster extends BaseCommand {
    static description = 'Gets information about the nodes that currently make up the stash cluster'
    static examples = [
        `$ stash admin:cluster`,
        `$ stash admin:cluster --json`,
    ];
    static flags = {
        ...BaseCommand.flags,
        csv: BuildCommands.csv,
        alias: BuildCommands.alias,
    };
    async run(): Promise<StashCLIResponse<ClusterOutput>> {
        const response = new StashCLIResponse<ClusterOutput>();
        const connector = new StashConnector(this.localConfig.getConnectorOptions(this.flags.alias));
        try {
            const clusters = await connector.admin.cluster();
            response.result = clusters;
            response.status = 0;
            console.log('RUNNING: ' + clusters.running);
            console.log('\n------------------------------------\n');
            console.log('LOCAL NODE:');
            this.ux.table<ClusterNode>([clusters.localNode], ClusterNodeColumns, {
                csv: this.flags.csv
            });
            console.log('\n------------------------------------\n');
            console.log('NODES:');
            this.ux.table<ClusterNode>(clusters.nodes, ClusterNodeColumns, {
                csv: this.flags.csv
            });
        } catch (error) {
            this.processError(response, error);
        }
        return response;
    }
}