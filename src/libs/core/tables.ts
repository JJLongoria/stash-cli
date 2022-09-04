import { CliUx } from "@oclif/core";
import { ClusterNode, Group, License, MailHostConfiguration, PermissionGroups, User } from "stash-connector";
import { Instance } from "../types";

export const InstanceColumns: CliUx.Table.table.Columns<Record<string, Instance>> = {
    alias: {
        header: 'Alias',
        minWidth: 10
    },
    host: {
        header: 'Host URL',
        minWidth: 20,
    },
    token: {
        header: 'Token',
        minWidth: 20,
    }
};

export const GroupColumns: CliUx.Table.table.Columns<Record<string, Group>> = {
    name: {
        header: 'Name',
    },
    deletable: {
        header: 'Deletable',
    },
};

export const GroupPermissionsColumns: CliUx.Table.table.Columns<Record<string, PermissionGroups>> = {
    group: {
        header: 'Name',
        get: (row: any) => {
            return row.group.name;
        }
    },
    permission: {
        header: 'Permission',
    },
};

export const ClusterNodeColumns: CliUx.Table.table.Columns<Record<string, ClusterNode>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    address: {
        header: 'Address',
        get: (row) => { return row.hostName + ':' + row.port }
    },
    local: {
        header: 'Local',
    },
}

export const UserColumns: CliUx.Table.table.Columns<Record<string, User>> = {
    id: {
        header: 'ID',
    },
    name: {
        header: 'Name',
    },
    slut: {
        header: 'User Slug',
    },
    displayName: {
        header: 'Display Name',
    },
    emailAddress: {
        header: 'Email',
    },
    active: {
        header: 'Active',
        extended: true,
    },
    type: {
        header: 'Type',
        extended: true,
    },
    directoryName: {
        header: 'Directory Name',
        extended: true,
    },
    deletable: {
        header: 'Deletable',
        extended: true,
    },
    lastAuthenticationTimestamp: {
        header: 'Last Autentication',
        extended: true,
        get: (row: any) => {
            return new Date(row.lastAuthenticationTimestamp).toISOString();
        }
    },
    mutableDetails: {
        header: 'Mutable Details',
        extended: true,
    },
    mutableGroups: {
        header: 'Mutable Groups',
        extended: true,
    },
}

export const LicenseColumns: CliUx.Table.table.Columns<Record<string, License>> = {
    license: {
        header: 'License',
    },
    status: {
        header: 'Status',
        get: (row: any) => {
            return row.status.serverId + ' (' + row.status.currentNumberOfUsers + ')';
        }
    },
    serverId: {
        header: 'Server Id',
    },
    creationDate: {
        header: 'Creation Date',
        get: (row: any) => {
            return new Date(row.creationDate).toISOString();
        }
    },
    purchaseDate: {
        header: 'Purchase Date',
        get: (row: any) => {
            return new Date(row.purchaseDate).toISOString();
        }
    },
    expiryDate: {
        header: 'Expiry Date',
        get: (row: any) => {
            return new Date(row.expiryDate).toISOString();
        }
    },
    numberOfDaysBeforeExpiry: {
        header: 'Days before Expiry',
        extended: true,
    },
    maintenanceExpiryDate: {
        header: 'Maintenance Expiry Date',
        extended: true,
        get: (row: any) => {
            return new Date(row.maintenanceExpiryDate).toISOString();
        }
    },
    numberOfDaysBeforeMaintenanceExpiry: {
        header: 'Days Before Maintenance Expiry',
        extended: true,
    },
    gracePeriodEndDate: {
        header: 'Grace Period End Date',
        extended: true,
        get: (row: any) => {
            return new Date(row.gracePeriodEndDate).toISOString();
        }
    },
    numberOfDaysBeforeGracePeriodExpiry: {
        header: 'Days Before Grace Period Expiry',
        extended: true,
    },
    maximumNumberOfUsers: {
        header: 'Max Users',
        extended: true,
    },
    unlimitedNumberOfUsers: {
        header: 'Unlimited Users',
        extended: true,
    },
    supportEntitlementNumber: {
        header: 'Supporn Entitlement Number',
        extended: true,
    },
}

export const MailHostColumns: CliUx.Table.table.Columns<Record<string, MailHostConfiguration>> = {
    username: {
        header: 'Username',
    },
    'sender-address': {
        header: 'Sender Address',
    },
    hostname: {
        header: 'Host',
    },
    port: {
        header: 'Port',
    },
    protocol: {
        header: 'Protocol',
    },
    'use-start-tls': {
        header: 'User Start TLS',
    },
    'require-start-tls': {
        header: 'Required Start TLS',
    },
}