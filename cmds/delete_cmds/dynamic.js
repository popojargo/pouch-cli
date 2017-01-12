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
exports.command = 'dynamic <indexkey> [keys]';
exports.desc = 'Deletes the documents from a indexkey and matching values(keys).';
exports.builder = {
    indexkey: {
        describe: 'The index key that will be used to create the dynamic view.'
    },
    d: {
        alias: 'useDesignDoc',
        describe: 'Determine if a design doc will be used for the request or if it will be temporary.'
    }, keys: {
        array: true,
        describe: 'The keys matching the index key that need to be deleted',
        default: []
    }
};
exports.handler = function (argv) {
    /**
     * @type PouchCommands
     */
    var cmds;
    try {
        cmds = new PouchCommands(argv.d, argv.u, argv.p);
    } catch (e) {
        console.error(e);
        return process.exit(1);
    }

    cmds.Query.getByKeyValue(argv.indexkey, argv.keys, argv.d).then(function (rows) {
        rows = cmds.cleanRows(rows);
        return cmds.delete(rows);
    }).then(function (result) {
        if (result && result.success)
            console.log("Successfully deleted");
        else
            console.log("An error occured");
    }).catch(function (err) {
        console.error(err);
        return process.exit(1);
    });
};
