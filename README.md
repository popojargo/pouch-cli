[![Stories in Ready](https://badge.waffle.io/popojargo/pouch-cli.png?label=ready&title=Ready)](https://waffle.io/popojargo/pouch-cli)
#pouch-cli
Inspired from [pouchdb-dump-cli](https://www.npmjs.com/package/pouchdb-dump-cli). This module let you perform basic operations on Cloudant/CouchDB/PouchDB databases. The main mission of this module is to give quick commands to daily operations on your database. You can access it via the CLI or directly using the library. 

This is currently under development so use it at your own risks.  

#Table of content

- [Installation](#installation)
- [Cli](#cli)
- [Changelog](#changelog)
- [Commands](#commands)
    + [Document's commands](#documents-commands)
        * [select \<command\>](#select-command)
            - [select normal](#select-normal)
            - [select view \<design/view_name\>](#select-view-designview_name)
            - [select dynamic \<indexkey\>](#select-dynamic-indexkey)
        * [delete \<command\>](#delete-command)
            - [delete normal [keys]](#delete-normal-keys)
            - [delete view \<design/view_name\> [keys]](#delete-view-designview_name-keys)
            - [delete dynamic \<indexkey\> [keys]](#delete-dynamic-indexkey-keys)
- [Notes](#notes)
- [Contributions](#contributions)
- [Contact](#contact)

#Installation
To install this package, simply run this command: `npm i pouch-cli`.
If you plan to use the CLI, I suggest that you install it globally like this: `npm i  -g pouch-cli`.


#CLI

Once installed, you can use this command to access the CLI: `pouch-cli`.

#Changelog

Coming soon.

#Commands

For every commands you use, they are some global options that you need or can set.

| Option |   Alias   | Type | Default | Required | Description |
| ------ |   -----   | ---- | ------- | -------- | ----------- |
| -d | --db | string | | Yes | The url of the database on which you want to execute your commands. |
| -u | -&nbsp;-&nbsp;username | string | No | | The username for access to the database (if securized) |
| -p | -&nbsp;-&nbsp;password | string | No | | Option to set the password to use during the query. |


##Document's commands

###select \<command\>

To access the select commands, simply run: `pouch-cli select --help`.

At this level, you still have other global options. 

| Option |   Alias   | Type | Default |  Description |
| ------ |   -----   | ---- | ------- | ----------- |
| -k | --keys | Array|string | | Can be either an array of keys to fetch or a single key to fetch. |
| -r | --rev | boolean | true | Determine if the documents must be returned with their revision. | 
| -e | --with-error | boolean | false | Determine if the document with errors should be returned. | 
| -o | --output-file | string | | The path there the response should be saved.

From this point, you have three possible subcommands to use.

####select normal
The normal select let you query the database and select particulars documents base on their ids.

For example, if we want to get the document with the _id *test_doc*, we would do the following: 

```bash
pouch-cli select normal -k test_doc -d "http://localhost:5984/db"
```

You can also fetch multiple keys:  

```bash
pouch-cli select normal -k "test_doc" "test_doc2" -d "http://localhost:5984/db"
```

####select view \<design/view_name\>

The view subcommand let you query the documents from one of your view. It's the same usage as for the normal command except that you must specify the viewname. Here's an example:

```bash
pouch-cli select view "design_doc/view_name" -d "http://localhost:5984/db"
```

####select dynamic \<indexkey\>

The dynamic subcommand let you query more dynamic queries. This is only generating basic javascript queries for you. This is not an efficient way to query your database but this can be useful for quick operations. The index key defines on what field should the document be queried. For example, if you want to get the documents based on the name, the indexkey would be *name*. You can also make temporary queries by using the (-udd false) option(see note below). 

*Note: Since CouchDB 2.0 release, the temporary views are disabled. Since PouchDB queries with temporary views are not working, you have to create a design document for your queries. Also, be aware that views are created based on the index key. For example, if you query by the name, you will have a view named "by_name".*

```bash
pouch-cli select dynamic "name" -k "John" -d "http://localhost:5984/db"
```

---

###delete \<command\>

The delete command is very similar to the select command. It let you query the documents but instead of returning the results, it deletes it. Here are listed the different global options available for this command :

| Option |   Alias   | Type | Default |  Description |
| ------ |   -----   | ---- | ------- | ----------- |
| -k | --keys | Array|string | | Can be either an array of keys to fetch or a single key to fetch. |

####delete normal [keys]

This command is very simple. It is simply querying all the documents by the keys. If you do not specify any keys, all of the documents will be deleted.

Command examples :

```bash
pouch-cli delete normal -d "http://localhost:5984/db"
```

For a specific key :

```bash
pouch-cli delete normal -d "http://localhost:5984/db" -k "specific_id"
```

For multiple keys : 

```bash
pouch-cli delete normal -d "http://localhost:5984/db" -k "first_id" "second_id"
```

####delete view \<design/view_name\> [keys]

The view subcommand let you delete the documents from one of your view. It's the same usage as for the normal command except that you must specify the viewname. Here's an example:

```bash
pouch-cli delete view "design_doc/view_name" -d "http://localhost:5984/db"
```

####delete dynamic \<indexkey\> [keys]

The dynamic subcommand let you delete document dynamically. This is only generating basic javascript queries for you. This is not an efficient way to query and delete documents from your database but this can be useful for quick operations. The index key defines on what field should the document be queried. For example, if you want to get the documents based on the name, the indexkey would be *name*. You can also make temporary queries by using the (-udd false) option(see note below). 

*Note: Since CouchDB 2.0 release, the temporary views are disabled. Since PouchDB queries with temporary views are not working, you have to create a design document for your queries. Also, be aware that views are created based on the index key. For example, if you query by the name, you will have a view named "by_name".*

```bash
pouch-cli delete dynamic "name" -k "John" -d "http://localhost:5984/db"
```


---

#Notes
This package is **not stable yet**, so don't put it in a production environment. CLI parameters and functions might change. I will try to write a changelog if it happens.

#Contributions?

Since this module is fresh from the woods, I'm not very strict on the way of contributing to this module. Feel free to submit bugs and feature request. As the owner, I will make my possible to solve the issues and develop feature requests on my free time.

Any new feature can be discussed so it gets well implemented in the current module. Do your Pull Request with a clear understanding message of what you have done. Tests would be appreciated!

#Contact

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/popojargo/pouch-cli)

You can contact me via email at [alexiscote19@hotmail.com](mailto:alexiscote19@hotmail.com?subject=Feedback).


