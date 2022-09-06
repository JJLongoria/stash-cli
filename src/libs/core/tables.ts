import { CliUx } from "@oclif/core";
import { ApplicationProperties, Branch, ClusterNode, Comment, Commit, CommitDiff, Group, HookOutput, License, Line, Logger, MailHostConfiguration, Participant, PermissionGroups, PermissionUserOutput, PermissionUsersOutput, PermittedOutput, Project, PullRequest, PullRequestActivity, RepoChangesOutput, Repository, Task, TaskCountOutput, User } from "stash-connector";
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

export const ProjectColumns: CliUx.Table.table.Columns<Record<string, Project>> = {
    id: {
        header: 'ID',
    },
    key: {
        header: 'Key',
    },
    name: {
        header: 'Name',
    },
    description: {
        header: 'Description',
    },
    public: {
        header: 'Public',
        extended: true,
    },
    type: {
        header: 'Type',
        extended: true
    },
}

export const RepositoryColumns: CliUx.Table.table.Columns<Record<string, Repository>> = {
    id: {
        header: 'ID',
    },
    slug: {
        header: 'Slug',
    },
    name: {
        header: 'Name',
    },
    state: {
        header: 'State',
    },
    origin: {
        header: 'Description',
        extended: true,
        get: (row: any) => {
            return row.origin ? row.origin.slug : 'None';
        }
    },
    scmId: {
        header: 'SCM ID',
        extended: true,
    },
    statusMessage: {
        header: 'Status Message',
        extended: true,
    },
    forkable: {
        header: 'Forkable',
        extended: true,
    },
    project: {
        header: 'Project',
        extended: true,
        get: (row: any) => {
            return row.project ? row.project.key : 'None';
        }
    },
    public: {
        header: 'Public',
        extended: true,
    },
    cloneUrl: {
        header: 'Clone URL',
        extended: true,
    },
}

export const BranchColumns: CliUx.Table.table.Columns<Record<string, Branch>> = {
    id: {
        header: 'ID',
    },
    displayId: {
        header: 'Display Id',
    },
    latestChangeset: {
        header: 'Latest Changeset',
    },
    latestCommit: {
        header: 'Latest Commit',
    },
    isDefault: {
        header: 'Default',
    }
}

export const LineColumns: CliUx.Table.table.Columns<Record<string, Line>> = {
    text: {
        header: 'Text',
    },
}

export const RepoChangesColumns: CliUx.Table.table.Columns<Record<string, RepoChangesOutput>> = {
    contentId: {
        header: 'Content ID',
    },
    fromContentId: {
        header: 'From Content ID',
        extended: true,
    },
    path: {
        header: 'Path',
        get: (row: any) => {
            return row.path.toString;
        }
    },
    executable: {
        header: 'Executable',
        extended: true,
    },
    percentUnchanged: {
        header: 'Percent Unchanged',
    },
    type: {
        header: 'Type',
    },
    nodeType: {
        header: 'Node Type',
        extended: true,
    },
    srcPath: {
        header: 'Src path',
        get: (row: any) => {
            return row.path.toString;
        }
    },
    srcExecutable: {
        header: 'Src Executable',
        extended: true
    },
}

export const PullRequestColumns: CliUx.Table.table.Columns<Record<string, PullRequest>> = {
    id: {
        header: 'ID',
    },
    version: {
        header: 'Version',
    },
    title: {
        header: 'Title',
    },
    description: {
        header: 'Description',
    },
    state: {
        header: 'State',
    },
    open: {
        header: 'Open',
        extended: true,
    },
    closed: {
        header: 'Closed',
        extended: true,
    },
    canMerge: {
        header: 'Can Merge',
    },
    conflicted: {
        header: 'Conflicted',
    },
    createdDate: {
        header: 'Created Date',
        get: (row: any) => {
            return new Date(row.createdDate).toISOString();
        },
        extended: true,
    },
    updatedDate: {
        header: 'Updated Date',
        get: (row: any) => {
            return new Date(row.updatedDate).toISOString();
        },
        extended: true,
    },
    fromRef: {
        header: 'From Ref',
        get: (row: any) => {
            return row.fromRef.id;
        },
    },
    toRef: {
        header: 'To Ref',
        get: (row: any) => {
            return row.fromRef.id;
        },
    },
    locked: {
        header: 'Locked',
        extended: true,
    },
    author: {
        header: 'Author',
        get: (row: any) => {
            return row.author.user.name;
        },
    },
    vetoes: {
        header: 'Vetoes',
        get: (row: any) => {
            if (row.vetoes && row.vetoes.length) {
                const result: string[] = [];
                for (const veto of row.vetoes) {
                    result.push(veto.summaryMessage);
                }
                return result.join(', ');
            } else {
                return 'None';
            }
        },
        extended: true,
    },
    reviewers: {
        header: 'Reviewers',
        get: (row: any) => {
            if (row.reviewers && row.reviewers.length) {
                const result: string[] = [];
                for (const participant of row.reviewers) {
                    result.push(participant.user.name);
                }
                return result.join(', ');
            } else {
                return 'None';
            }
        },
        extended: true,
    },
    participants: {
        header: 'Participants',
        get: (row: any) => {
            if (row.participants && row.participants.length) {
                const result: string[] = [];
                for (const participant of row.participants) {
                    result.push(participant.user.name);
                }
                return result.join(', ');
            } else {
                return 'None';
            }
        },
        extended: true,
    },
}

export const PullRequestMergeColumns: CliUx.Table.table.Columns<Record<string, PullRequest>> = {
    canMerge: {
        header: 'Can Merge',
    },
    conflicted: {
        header: 'Conflicted',
    },
    vetoes: {
        header: 'Vetoes',
        get: (row: any) => {
            if (row.vetoes && row.vetoes.length) {
                const result: string[] = [];
                for (const veto of row.vetoes) {
                    result.push(veto.summaryMessage);
                }
                return result.join(', ');
            } else {
                return 'None';
            }
        },
    },
}

export const PullRequestActivityColumns: CliUx.Table.table.Columns<Record<string, PullRequestActivity>> = {
    id: {
        header: 'ID',
    },
    createdDate: {
        header: 'Created Date',
        get: (row: any) => {
            return new Date(row.createdDate).toISOString();
        },
    },
    user: {
        header: 'User',
        get: (row: any) => {
            return row.user.name;
        },
    },
    action: {
        header: 'Action',
    },
    commentAction: {
        header: 'Comment Action',
        extended: true,
    },
    comment: {
        header: 'Comment',
        extended: true,
    },
    fromHash: {
        header: 'From Hash',
        extended: true,
    },
    previousFromHash: {
        header: 'Previous From Hah',
        extended: true,
    },
    previousToHash: {
        header: 'Previous To Hast',
        extended: true,
    },
    toHash: {
        header: 'To Hash',
        extended: true,
    }
}

export const ParticipantColumns: CliUx.Table.table.Columns<Record<string, Participant>> = {
    user: {
        header: 'User',
        get: (row: any) => {
            return row.user.name;
        },
    },
    role: {
        header: 'Role',
    },
    approved: {
        header: 'Approved',
    },
}

export const CommentColumns: CliUx.Table.table.Columns<Record<string, Comment>> = {
    id: {
        header: 'ID',
    },
    version: {
        header: 'Version',
    },
    text: {
        header: 'Text',
    },
    author: {
        header: 'Author',
        get: (row: any) => {
            return row.user.name;
        },
    },
    createdDate: {
        header: 'Created Date',
        get: (row: any) => {
            return new Date(row.createdDate).toISOString();
        },
    },
    updatedDate: {
        header: 'Updated Date',
        get: (row: any) => {
            return new Date(row.createdDate).toISOString();
        },
    },
    editable: {
        header: 'Editable',
        get: (row: any) => {
            return new Date(row.permittedOperations.editable).toISOString();
        },
        extended: true,
    },
    deletable: {
        header: 'Delerable',
        get: (row: any) => {
            return new Date(row.permittedOperations.deletable).toISOString();
        },
        extended: true,
    },
}

export const CommitColumns: CliUx.Table.table.Columns<Record<string, Commit>> = {
    id: {
        header: 'ID',
    },
    displayId: {
        header: 'Display ID',
    },
    author: {
        header: 'Author',
        get: (row: any) => {
            return row.author.name;
        },
    },
    authorTimestamp: {
        header: 'Author Date',
        get: (row: any) => {
            return new Date(row.authorTimestamp).toISOString();
        },
    },
    message: {
        header: 'Message',
    },
}

export const CommitDiffColumns: CliUx.Table.table.Columns<Record<string, CommitDiff>> = {
    source: {
        header: 'Source',
        get: (row: any) => {
            return row.toString;
        },
    },
    destination: {
        header: 'Destination',
        get: (row: any) => {
            return row.toString;
        },
    },
    truncated: {
        header: 'Truncated',
    },
}

export const TaskColumns: CliUx.Table.table.Columns<Record<string, Task>> = {
    id: {
        header: 'ID',
    },
    text: {
        header: 'Text',
    },
    createdDate: {
        header: 'Created Date',
        get: (row: any) => {
            return new Date(row.createdDate).toISOString();
        },
    },
    author: {
        header: 'Author',
        get: (row: any) => {
            return row.author.name;
        },
    },
    state: {
        header: 'State',
    },
    deletable: {
        header: 'Deletable',
        get: (row: any) => {
            return row.deletable;
        },
        extended: true,
    },
    editable: {
        header: 'Editable',
        get: (row: any) => {
            return row.editable;
        },
        extended: true,
    },
    transitionable: {
        header: 'Transitionable',
        get: (row: any) => {
            return row.transitionable;
        },
        extended: true,
    },
}

export const TaskCountColumns: CliUx.Table.table.Columns<Record<string, TaskCountOutput>> = {
    open: {
        header: 'Open',
    },
    resolved: {
        header: 'Resolved',
    },
}


export const AppPropertiesColumns: CliUx.Table.table.Columns<Record<string, ApplicationProperties>> = {
    displayName: {
        header: 'Display Name',
    },
    version: {
        header: 'Version',
    },
    buildNumber: {
        header: 'Build Number',
    },
    buildDate: {
        header: 'Build Date',
    },
}


export const LoggerColumns: CliUx.Table.table.Columns<Record<string, Logger>> = {
    logLevel: {
        header: 'Log Level',
    },
}

export const PermissionUserColumns: CliUx.Table.table.Columns<Record<string, PermissionUserOutput>> = {
    user: {
        header: 'User',
        get: (row: any) => {
            return row.user.name;
        },
    },
    deletable: {
        header: 'Deletable',
    }
}

export const PermissionUsersColumns: CliUx.Table.table.Columns<Record<string, PermissionUsersOutput>> = {
    user: {
        header: 'User',
        get: (row: any) => {
            return row.user.name;
        },
    },
    permission: {
        header: 'Permission'
    }
}

export const PermittedColumns: CliUx.Table.table.Columns<Record<string, PermittedOutput>> = {
    permitted: {
        header: 'Permitted'
    }
}

export const HookColumns: CliUx.Table.table.Columns<Record<string, HookOutput>> = {
    key: {
        header: 'Key',
        get: (row: any) => {
            return row.details.key;
        }
    },
    name: {
        header: 'Name',
        get: (row: any) => {
            return row.details.name;
        }
    },
    type: {
        header: 'Type',
        get: (row: any) => {
            return row.details.type;
        }
    },
    description: {
        header: 'Description',
        get: (row: any) => {
            return row.details.key;
        }
    },
    version: {
        header: 'Version',
        get: (row: any) => {
            return row.details.key;
        },
        extended: true,
    },
    configFormKey: {
        header: 'Config Form key',
        get: (row: any) => {
            return row.details.configFormKey;
        },
        extended: true,
    },
    enabled: {
        header: 'Enabled'
    },
    configured: {
        header: 'Configured',
        extended: true,
    },
}

