# pouchdb-cli
Inspired from [pouchdb-dump-cli](https://www.npmjs.com/package/pouchdb-dump-cli). This module let you perform basic operations on Cloudant/CouchDB/PouchDB databases. The main mission of this module is to give quick commands to daily operations on your database. You can access it via the CLI or directly using the library. *Note that importing this package into your code only gives you an easy access to query your PouchDB instance.*

#Installation
To install this package, simply run this command : `npm i pouchdb-cli`. 
If you plan to use the CLI, I suggest that you install it globally like this : `npm i  -g pouchdb-cli`.


#CLI

Once installed, you can use this command to access the CLI : `pouchdb-cli`.

Full parameters bellow :

```
Options:
  -h, --help         Help message  [boolean]
  -v, --view         The view name including the design doc prefix
  --vk, --viewkey    The view key on wich the documents will be indexed.
  -k, --key          The key(s) to fetch
  --dd, --designdoc  Determine if a design doc will be created if querying views.
  -o, --output-file  output file (else will dump to stdout)
  -u, --username     username for the CouchDB database (if it's protected)
  -p, --password     password for the CouchDB database (if it's protected)
  -s, --split        split into multiple files, for every n docs

Examples:
  C:\Users\user\AppData\Roaming\npm\node_modules\pouchdb-dump-select\bin.js http://localhost:5984/mydb > dump.txt                           Dump from the "mydb" CouchDB to dump.txt
  C:\Users\user\AppData\Roaming\npm\node_modules\pouchdb-dump-select\bin.js /path/to/mydb > dump.txt                                        Dump from the "mydb" LevelDB-based PouchDB to dump.txt
  C:\Users\user\AppData\Roaming\npm\node_modules\pouchdb-dump-select\bin.js /path/to/mydb -o dump.txt                                       Dump to the specified file instead of stdout
  C:\Users\user\AppData\Roaming\npm\node_modules\pouchdb-dump-select\bin.js http://example.com/mydb -u myUsername -p myPassword > dump.txt  Specify a CouchDB username and password if it's protected

```



#Library

The actual library is a constructor with 3 public methods. 

You can access the full documentation [here](https://popojargo.github.io/pouchdb-dump-select/docs/index.html).

So first of all, you  need to require the library :
```
var PDS = require("pouchdb-dump-select");
```





#Note
This package is **not stable yet**, so don't put it in a production environment. CLI parameters and functions might change. I will try to write a changelog if it happens.



#TODO :
- Complete README doc.
- Add unit test on the main code
- Add tests on the CLI.
- Add some format parameter so this tool is compatible with PouchDB-load
- Reimplement the split file save


##Want to contribute?

Since this module is fresh from the woods, I'm not very strict on the way of contributing to this module. Feel free to submit bugs and feature request. As the owner, I will make my possible to solve the issues and develop feature requests on my free time.

Any new feature can be discussed so it gets well implemented in the current module. Do your Pull Request with a clear understanding message of what you have done. Test would be appreciated!

##Contact

You can contact me via gitter : [] or by email at alexiscote19@hotmail.com.


