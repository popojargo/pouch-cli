/* 
 * Copyright (C) 2016 Alexis
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var PouchCommands = require("../../lib/pouchcmds.js");
var utils = require("../../lib/utils.js");
exports.command = 'dynamic <indexkey>';
exports.desc = 'Gets the documents from a indexkey and matching values(keys).';
exports.builder = {
    indexkey: {
        describe: 'The index key that will be used to create the dynamic view.'
    },
    useDesignDoc: {
        alias: 'useDesignDoc',
        describe: 'Determine if a design doc will be used for the request of if it will be temporary.'
    }
};
exports.handler = function (argv) {
    /**
     * @type PouchCommands
     */
    var pds;
    try {
        pds = new PouchCommands(argv.d, argv.u, argv.p);
    } catch (e) {
        console.error(e);
        return process.exit(1);
    }

    pds.Query.getByKeyValue(argv.indexkey, argv.k, argv.useDesignDoc).then(function (rows) {
        var opts = {withError: argv.e, withoutRev: argv.r};
        rows = pds.cleanRows(rows, opts);
        utils.writeContent(rows, argv.o);
    }).catch(function (err) {
        console.error(err);
        return process.exit(1);
    });
};
