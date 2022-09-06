[**Stash CLI Application**]()
=================

[![Version](https://img.shields.io/npm/v/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash)
[![Total Downloads](https://img.shields.io/npm/dt/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash/core)
[![Downloads/Month](https://img.shields.io/npm/dm/cli-stash?logo=npm)](https://www.npmjs.com/package/cli-stash)
[![Issues](https://img.shields.io/github/issues/jjlongoria/stash-cli)](https://github.com/JJLongoria/stash-cli/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/JJLongoria/cli-stash/badge.svg)](https://snyk.io/test/github/JJLongoria/cli-stash)
[![Code Size](https://img.shields.io/github/languages/code-size/jjlongoria/stash-cli)](https://github.com/JJLongoria/stash-cli)
[![License](https://img.shields.io/github/license/jjlongoria/stash-cli?logo=github)](https://github.com/JJLongoria/stash-cli/blob/master/LICENSE)

CLI application to manage and work with Atlassian Stash. Work with your Stash project and repositories from Command lines.

To learn more or read a full documentation of the Stash CLI Application, go to the [**Official Documentation Site**](https://github.com/JJLongoria/stash-cli/wiki).

This CLI Application use the [**Stash Connector**](https://github.com/JJLongoria/stash-connector) library to connect and work with stash. 

- [**Stash CLI Application**](#stash-cli-application)
- [**Usage**](#usage)
- [**Core CLI Commands**](#core-cli-commands)
  - [**`stash help [COMMAND]`**](#stash-help-command)
  - [**`stash update`**](#stash-update)
  - [**`stash commands`**](#stash-commands)
  - [**`stash plugins`**](#stash-plugins)
  - [**`stash plugins:install PLUGIN...`**](#stash-pluginsinstall-plugin)
  - [**`stash plugins:inspect PLUGIN...`**](#stash-pluginsinspect-plugin)
  - [**`stash plugins:link PLUGIN`**](#stash-pluginslink-plugin)
  - [**`stash plugins:uninstall PLUGIN...`**](#stash-pluginsuninstall-plugin)
- [**CLI Main Topics**](#cli-main-topics)
  - [**Auth**](#auth)
  - [**Admin**](#admin)
  - [**App**](#app)
  - [**Groups**](#groups)
  - [**Hooks**](#hooks)
  - [**Logs**](#logs)
  - [**Markup**](#markup)
  - [**Profile**](#profile)
  - [**Projects**](#projects)
  - [**Repos**](#repos)
  - [**Tasks**](#tasks)
  - [**User**](#user)
- [**JSON Objects Schemes**](#json-objects-schemes)
  - [**AddGroupInput**](#addgroupinput)
  - [**AddUsersInput**](#addusersinput)
  - [**ApplicationProperties**](#applicationproperties)
  - [**Avatar**](#avatar)
  - [**Branch**](#branch)
  - [**ClusterOutput**](#clusteroutput)
  - [**ClusterNode**](#clusternode)
  - [**ClusterAddress**](#clusteraddress)
  - [**Comment**](#comment)
  - [**CommentAnchor**](#commentanchor)
  - [**CommentInput**](#commentinput)
  - [**Commit**](#commit)
  - [**CommitDiff**](#commitdiff)
  - [**CommitDiffHunk**](#commitdiffhunk)
  - [**CommitDiffHunk**](#commitdiffhunk-1)
  - [**CommitDiffLine**](#commitdiffline)
  - [**CommitDiffOutput**](#commitdiffoutput)
  - [**CreateUserInput**](#createuserinput)
  - [**FilePath**](#filepath)
  - [**ForkRepoInput**](#forkrepoinput)
  - [**Group**](#group)
  - [**Instance**](#instance)
  - [**License**](#license)
  - [**LicenseStatus**](#licensestatus)
  - [**Line**](#line)
  - [**Link**](#link)
  - [**LinkRef**](#linkref)
  - [**Logger**](#logger)
  - [**MailHostConfiguration**](#mailhostconfiguration)
  - [**Participant**](#participant)
  - [**ParticipantInput**](#participantinput)
  - [**PermissionGroups**](#permissiongroups)
  - [**PermissionUsersOutput**](#permissionusersoutput)
  - [**Project**](#project)
  - [**ProjectInput**](#projectinput)
  - [**PullRequest**](#pullrequest)
  - [**PullRequestActivity**](#pullrequestactivity)
  - [**PullRequestActivityChanges**](#pullrequestactivitychanges)
  - [**PullRequestInput**](#pullrequestinput)
  - [**PullRequestRef**](#pullrequestref)
  - [**PullRequestRefInput**](#pullrequestrefinput)
  - [**PullRequestVeto**](#pullrequestveto)
  - [**PullRequestUpdateInput**](#pullrequestupdateinput)
  - [**Repository**](#repository)
  - [**RepoChangesOutput**](#repochangesoutput)
  - [**UpdateRepoInput**](#updaterepoinput)
  - [**Task**](#task)
  - [**TaskCountOutput**](#taskcountoutput)
  - [**User**](#user-1)

* [Usage](#usage)
* [Commands](#commands)

# [**Usage**]()
```sh-session
$ npm install -g cli-stash
$ stash COMMAND
running command...
$ stash (--version)
cli-stash/0.1.0 win32-x64 node-v16.10.0
$ stash --help [COMMAND]
USAGE
  $ stash COMMAND
...
```
# [**Core CLI Commands**]()

## **`stash help [COMMAND]`**

Display help for Stash CLI.

```
USAGE
  $ stash help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for stash.
```

## **`stash update`**

Update the Stash CLI.

```
USAGE
  $ stash update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  Update the Stash CLI

EXAMPLES
  Update to the stable channel:

    $ stash update stable

  Update to a specific version:

    $ stash update --version 1.0.0

  Interactively select version:

    $ stash update --interactive

  See available versions:

    $ stash update --available
```

## **`stash commands`**

List all the commands

```
USAGE
  $ stash commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all the commands
```

## **`stash plugins`**

List installed plugins.

```
USAGE
  $ stash plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ stash plugins
```


## **`stash plugins:install PLUGIN...`**

Installs a plugin into the CLI.

```
USAGE
  $ stash plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a "hello" command, installing a user-installed plugin with a "hello" command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ stash plugins add

EXAMPLES
  $ stash plugins:install myplugin 

  $ stash plugins:install https://github.com/someuser/someplugin

  $ stash plugins:install someuser/someplugin
```

## **`stash plugins:inspect PLUGIN...`**

Displays installation properties of a plugin.

```
USAGE
  $ stash plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ stash plugins:inspect myplugin
```

## **`stash plugins:link PLUGIN`**

Links a plugin into the CLI for development.

```
USAGE
  $ stash plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a "hello" command, installing a linked plugin with a "hello"
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ stash plugins:link myplugin
```

## **`stash plugins:uninstall PLUGIN...`**

Removes a plugin from the CLI.

```
USAGE
  $ stash plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ stash plugins unlink
  $ stash plugins remove
```

Removes a plugin from the CLI.

```
USAGE
  $ stash plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ stash plugins unlink
  $ stash plugins remove
```


# [**CLI Main Topics**]()

The [**Stash CLI Application**]() has to many commands to handle all Stash features. All commands are grouped in **topics**, any many topics has **subtopics** to better organization of commands (and better to learn and understand).

The main topics are listed below.

## [**Auth**]()

## [**Admin**]()

## [**App**]()

## [**Groups**]()

## [**Hooks**]()

## [**Logs**]()

## [**Markup**]()

## [**Profile**]()

## [**Projects**]()

## [**Repos**]()

## [**Tasks**]()

## [**User**]()



# [**JSON Objects Schemes**]()

All JSON Schemes used by the Stash CLI application as response or data input are listed bellow.

**Schema definition**:
```json
{
  "FieldName": "FieldType", // Required field
  "FieldName?": "FieldType", // Optional field
}
```
---
## [**AddGroupInput**]()
```json
{
    "user": "string",
    "groups": "string[]",
}
```
---
## [**AddUsersInput**]()
```json
{
    "group": "string",
    "users": "string[]",
}
```
---
## [**ApplicationProperties**]()
```json
{
  "version": "string",
  "buildNumber": "number",
  "buildDate": "number",
  "displayName": "string",
}
```
---
## [**Avatar**]()
```json
{
    "type": "string",
    "content": "string",
}
```
---
## [**Branch**]()
```json
{
    "id": "string",
    "displayId": "string",
    "latestChangeset": "string",
    "latestCommit": "string",
    "isDefault": "boolean",
}
```
---
## [**ClusterOutput**]()
```json
{
    "localNode": "ClusterNode",
    "nodes": "ClusterNode[]",
    "running": "boolean",
}
```
- See [`ClusterNode`](#clusternode) Definition

---
## [**ClusterNode**]()

```json
{
    "id": "string",
    "name": "string",
    "address": "ClusterAddress",
    "local": "boolean",
}
```
- See [`ClusterAddress`](#clusteraddress) Definition

---
## [**ClusterAddress**]()
```json
{
    "hostName": "string",
    "port": "number",
}
```
---
## [**Comment**]()
```json
{
    "properties": "{ [key: string]: string }",
    "id": "number",
    "version": "number",
    "text": "string",
    "author": "User",
    "createdDate": "number",
    "updatedDate": "number",
    "comments": "Comment"[],
    "attributes": "{ [key: string]: string }",
    "tasks": "{ [key: string]: string }",
    "permittedOperations": {
        "editable": "boolean",
        "deletable": "boolean",
    }
}
```
- See [`User`](#user) Definition

---
## [**CommentAnchor**]()
```json
{
    "fromHash?": "string",
    "toHash?": "string",
    "line?": "number",
    "lineType?": "'ADDED' | 'REMOVED' | 'CONTEXT'",
    "fileType?": "'FROM' | 'TO'",
    "path?": "string",
    "srcPath?": "string",
    "orphaned?": "boolean",
}
```
- See [`User`](#user) Definition

---
## [**CommentInput**]()
```json
{
    "text": "string",
    "parent?": "string",
    "commentAnchor?": "CommentAnchor"
}
```
- See [`commentAnchor`](#commentanchor) Definition
- See [`User`](#user) Definition

---
## [**Commit**]()
```json
{
    "id": "string",
    "displayId": "string",
    "author": "User",
    "authorTimestamp": "number",
    "message": "string",
    "parents": "Commit[]",
    "attributes": "{ [key: string]: string }",
}
```
- See [`User`](#user) Definition

---
## [**CommitDiff**]()
```json
{
    "source": "FilePath",
    "destination": "FilePath",
    "hunks": "CommitDiffHunk[]",
    "truncated": "boolean",
}
```
- See [`FilePath`](#filepath) Definition
- See [`CommitDiffHunk`](#commitdiffhunk) Definition

---
## [**CommitDiffHunk**]()
```json
{
    "sourceLine": "number",
    "sourceSpan": "number",
    "destinationLine": "number",
    "destinationSpan": "number",
    "segments": "CommitDiffHunkSegment[]",
    "truncated": "boolean",
}
```
- See [`CommitDiffHunkSegment`](#commitdiffhunksegment) Definition

---
## [**CommitDiffHunk**]()
```json
{
    "type": "string",
    "lines": "CommitDiffLine[]",
    "truncated": "boolean",
}
```
- See [`CommitDiffLine`](#commitdiffline) Definition

## [**CommitDiffLine**]()
```json
{
    "destination": "number",
    "source": "number",
    "line": "string",
    "truncated": "boolean",
}
```

---
## [**CommitDiffOutput**]()
```json
{
    "diffs": "CommitDiff[]",
}
```
- See [`CommitDiff`](#commitdiff) Definition

---
## [**CreateUserInput**]()
```json
{
    "name": "string",
    "password": "string",
    "displayName": "string",
    "emailAddress": "string",
    "addToDefaultGroup": "boolean",
    "notify": "string",
}
```
---
## [**FilePath**]()
```json
{
    "components": "string[]",
    "parent": "string",
    "name": "string",
    "extension": "string",
    "toString": "string",
}
```
---
## [**ForkRepoInput**]()
```json
{
    "slug?": "string",
    "name?": "string",
    "project?": {
        "key": "string",
    },
}
```
---
## [**Group**]()
```json
{
    "name": "string",
    "deletable": "boolean",
}
```
---
## [**Instance**]()
```json
{
    "alias": "string",
    "host": "string",
    "token": "string",
}
```
---
## [**License**]()
```json
{
    "creationDate": "number",
    "purchaseDate": "number",
    "expiryDate": "number",
    "numberOfDaysBeforeExpiry": "number",
    "maintenanceExpiryDate": "number",
    "numberOfDaysBeforeMaintenanceExpiry": "number",
    "gracePeriodEndDate": "number",
    "numberOfDaysBeforeGracePeriodExpiry": "number",
    "maximumNumberOfUsers": "number",
    "unlimitedNumberOfUsers": "boolean",
    "serverId": "string",
    "supportEntitlementNumber": "string",
    "license": "string",
    "status": "LicenseStatus",
}
```
- See [`LicenseStatus`](#licensestatus) Definition

---
## [**LicenseStatus**]()
```json
{
    "serverId": "string",
    "currentNumberOfUsers": "number",
}
```
---
## [**Line**]()
```json
{
    "text": "string",
}
```
---
## [**Link**]()
```json
{
    "url": "string",
    "rel": "string",
}
```
---
## [**LinkRef**]()
```json
{
    "href": "string",
}
```
---
## [**Logger**]()
```json
{
    "logLevel": "'TRACE' | 'DEBUG' | 'INFO' | 'WARN ' | 'ERROR'",
}
```
---
## [**MailHostConfiguration**]()
```json
{
    "hostname": "string",
    "port": "number",
    "protocol": "string",
    "use-start-tls": "boolean",
    "require-start-tls": "boolean",
    "username": "string",
    "sender-address": "string",
}
```
---
## [**Participant**]()
```json
{
    "user": "User",
    "role": "'AUTHOR' | 'REVIEWER' | 'PARTICIPANT'",
    "approved": "boolean",
}
```
- See [`User`](#user) Definition

---
## [**ParticipantInput**]()
```json
{
    "user": {
      "name": "string",
    },
    "role": "'AUTHOR' | 'REVIEWER' | 'PARTICIPANT'"
}
```
---
## [**PermissionGroups**]()
```json
{
    "group": "User",
    "permission": "'LICENSED_USER' | 'PROJECT_CREATE' | 'ADMIN' | 'SYS_ADMIN' | 'PROJECT_READ' | 'PROJECT_WRITE",
}
```
- See [`Group`](#group) Definition

---
## [**PermissionUsersOutput**]()
```json
{
    "user": "User",
    "permission": "'LICENSED_USER' | 'PROJECT_CREATE' | 'ADMIN' | 'SYS_ADMIN' | 'PROJECT_READ' | 'PROJECT_WRITE",
}
```
- See [`User`](#user) Definition

---
## [**Project**]()
```json
{
    "key": "string",
    "id": "string",
    "name": "string",
    "description": "string",
    "public": "boolean",
    "type": "string",
    "link": "Link",
    "links": "{ [key: string]: LinkRef[] }",
}
```
- See [`Link`](#link) Definition.
- See [`LinkRef`](#linkref) Definition

---
## [**ProjectInput**]()
```json
{
    "key": "string",
    "name": "string",
    "description": "string",
    "avatarFile": "string",
}
```
---
## [**PullRequest**]()
```json
{
    "id": "number",
    "version": "number",
    "title": "string",
    "description": "string",
    "state": "'ALL' | 'OPEN' | 'DECLINED' | 'MERGED'",
    "open": "boolean",
    "closed": "boolean",
    "canMerge": "boolean",
    "conflicted": "boolean",
    "vetoes": "PullRequestVeto[]",
    "createdDate": "number",
    "updatedDate": "number",
    "fromRef": "PullRequestRef",
    "toRef": "PullRequestRef",
    "locked": "boolean",
    "author": "Participant",
    "reviewers": "Participant[]",
    "participants": "Participant[]",
}
```
- See [`PullRequestVeto`](#pullrequestveto) Definition.
- See [`PullRequestRef`](#pullrequestref) Definition.
- See [`Participant`](#participant) Definition.

---
## [**PullRequestActivity**]()
```json
{
    "id": "number",
    "createdDate": "number",
    "user": "User",
    "action": "string",
    "commentAction?": "string",
    "comment?": "Comment",
    "commentAnchor?": "CommentAnchor",
    "fromHash?": "string",
    "previousFromHash?": "string",
    "previousToHash?": "string",
    "toHash?": "string",
    "added?": "PullRequestActivityChanges",
    "removed?": "PullRequestActivityChanges",
}
```
- See [`User`](#user) Definition.
- See [`Comment`](#comment) Definition.
- See [`CommentAnchor`](#commentanchor) Definition.
- See [`PullRequestActivityChanges`](#pullrequestactivitychanges) Definition.

---
## [**PullRequestActivityChanges**]()
```json
{
    "changesets?": "Commit[]",
    "commits?": "Commi[]",
    "total": "number",
}
```
- See [`Commit`](#commit) Definition.

---
## [**PullRequestInput**]()
```json
{
    "title": "string",
    "description": "string",
    "state": "'ALL' | 'OPEN' | 'DECLINED' | 'MERGED'",
    "open?": "boolean",
    "closed?": "boolean",
    "fromRef": "PullRequestInputRef",
    "toRef": "PullRequestInputRef",
    "locked?": "boolean",
    "reviewers?": "ParticipantInput[]",
}
```
- See [`PullRequestInputRef`](#pullrequestrefinput) Definition.
- See [`ParticipantInput`](#participantinput) Definition.

---
## [**PullRequestRef**]()
```json
{
    "id": "string",
    "repository": "Repository",
}
```
- See [`Repository`](#repository) Definition.

---
## [**PullRequestRefInput**]()
```json
{
    "id": "string",
    "repository": {
      "slug": "string",
      "project": {
          "key": "string",
      }
    },
}
```
---
## [**PullRequestVeto**]()
```json
{
    "summaryMessage": "string",
    "detailedMessage": "string",
}
```
---
## [**PullRequestUpdateInput**]()
```json
{
    "title?": "string",
    "description?": "string",
    "toRef?": "PullRequestInputRef",
    "reviewers?": "ParticipantInput[]",
}
```
- See [`PullRequestInputRef`](#pullrequestrefinput) Definition.
- See [`ParticipantInput`](#participantinput) Definition.

---
## [**Repository**]()
```json
{
    "slug": "string",
    "id": "string",
    "name": "string",
    "origin?": "Repository",
    "scmId": "string",
    "state": "string",
    "statusMessage": "string",
    "forkable": "boolean",
    "project": "Project",
    "public": "boolean",
    "cloneUr": "string",
    "link": "Link",
    "links": "{ [key: string]: LinkRef[] }",
}
```
- See [`Project`](#project) Definition
- See [`Link`](#link) Definition.
- See [`LinkRef`](#linkref) Definition

---
## [**RepoChangesOutput**]()
```json
{
    "contentId": "string",
    "fromContentId": "string",
    "path": "FilePath",
    "executable": "boolean",
    "percentUnchanged":" number",
    "type": "string",
    "nodeType": "string",
    "srcPath": "FilePath",
    "srcExecutable": "boolean",
    "link": "Link",
    "links": "{ [key: string]: LinkRef[] }",
}
```
- See [`FilePath`](#filepath) Definition
- See [`Link`](#link) Definition.
- See [`LinkRef`](#linkref) Definition

---
## [**UpdateRepoInput**]()
```json
{
    "slug?": "string",
    "name?": "string",
    "scmId?": "string",
    "forkable?": "boolean",
    "project?": {
        "key": "string",
    },
    "public?": "boolean",
}
```
---
## [**Task**]()
```json
{
    "id": "number",
    "properties": "{ [key: string]: string }",
    "anchor": "Comment",
    "author": "User",
    "createdDate": "number",
    "permittedOperations": {
        "deletable": "boolean",
        "editable": "boolean",
        "transitionable": "boolean",
    },
    "text": "string",
    "state": "'OPEN' | 'RESOLVED'",
}
```
- See [`Comment`](#comment) Definition
- See [`User`](#user) Definition

---
## [**TaskCountOutput**]()
```json
{
    "open": "number",
    "resolved": "number",
}
```
---
## [**User**]()
```json
{
    "name": "string",
    "emailAddress": "string",
    "id": "number",
    "displayName": "string",
    "active": "boolean",
    "slug": "string",
    "type": "string",
    "directoryName?": "string",
    "deletable?": "boolean",
    "lastAuthenticationTimestamp?": "number",
    "mutableDetails?": "boolean",
    "mutableGroups?": "boolean",
}
```
---


