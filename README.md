# pouchdb-cli
Inspired from [pouchdb-dump-cli](https://www.npmjs.com/package/pouchdb-dump-cli). This module let you perform basic operations on Cloudant/CouchDB/PouchDB databases. The main mission of this module is to give quick commands to daily operations on your database. You can access it via the CLI or directly using the library. *Note that importing this package into your code only gives you an easy access to query your PouchDB instance.*

#Installation
To install this package, simply run this command : `npm i pouch-cli`.
If you plan to use the CLI, I suggest that you install it globally like this : `npm i  -g pouch-cli`.


#CLI

Once installed, you can use this command to access the CLI : `pouch-cli`.

#Commands

For every commands you use, they are some global options that you need or can set.

| Option |   Alias   | Type | Default | Required | Description |
| ------ |   -----   | ---- | ------- | -------- | ----------- |
| -d | --db | string | | Yes | The url of the database on which you want to execute your commands. |
| -u | -&nbsp;-&nbsp;username | string | No | | The username for access to the database (if securized) |
| -p | -&nbsp;-&nbsp;password | string | No | | Option to set the password to use during the query. |


##Documents commands

###Select

To access the select commands, simply run : `pouch-cli select --help`.

At this level, you still have other global options. 

| Option |   Alias   | Type | Default |  Description |
| ------ |   -----   | ---- | ------- | ----------- |
| -k | --keys | Array|string | | Can be either an array of keys to fetch or a single key to fetch. |
| -r | --rev | boolean | true | Determine if the documents must be returned with their revision. | 
| -e | --with-error | boolean | false | Determine if the document with errors should be returned. | 
| -o | --output-file | string | | The path there the response should be saved.

From this point, you have three possible subcommands to use.

####normal
The normal select let you query the database and select particulars documents base on their ids.

For example, if we want to get the document with the _id *test_doc*, we would do the following : 

```bash
pouch-cli select normal -k test_doc -d "http://localhost:5984/db"
```

You can also fetch multiple keys :  

```bash
pouch-cli select normal -k ["test_doc","test_doc2"] -d "http://localhost:5984/db"
```

---

####viewname



---

####dynamic




#Note
This package is **not stable yet**, so don't put it in a production environment. CLI parameters and functions might change. I will try to write a changelog if it happens.

##Want to contribute?

Since this module is fresh from the woods, I'm not very strict on the way of contributing to this module. Feel free to submit bugs and feature request. As the owner, I will make my possible to solve the issues and develop feature requests on my free time.

Any new feature can be discussed so it gets well implemented in the current module. Do your Pull Request with a clear understanding message of what you have done. Test would be appreciated!

##Contact

[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/popojargo/pouch-cli)

You can contact me via email at [alexiscote19@hotmail.com](mailto:alexiscote19@hotmail.com?subject=Feedback).


