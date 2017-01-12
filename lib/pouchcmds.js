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
'use strict';

//Module loading
var Query = require("./query.js");
var PouchDB = require("pouchdb");
var URL = require("url");
var Promise = require("lie");
/**
 * Constructor for the PouchCommands object.
 * @constructor
 * @throws {TypeError} Throws a type error if the username and password are not well supplied.
 * @param {String} url The url of the PouchDB database.
 * @param {String} [username] The username of the remote database if required.
 * @param {String} [password] The password of the remote database if required.
 */
var PouchCommands = function (url, username, password) {

    url = this._buildUrl(url, username, password);

    /**
     * @public
     */
    this.db = new PouchDB(url);

    /**
     * The query library that leverage the difficulties to query PouchDB
     * @type {Query}
     */
    this.Query = new Query(this.db);
};

/**
 * Delete the document(s) and return the Promise.
 * @public
 * @param  {object|Array} docs A document or an array of documents to delete.
 * You must specify the _rev and the _id else it's wont be deleted.
 * @return {Promise}      Return a promise from bulkDocs or a promise with ({result:true}) if the docs where empty.
 */
PouchCommands.prototype.delete = function (docs) {
    debugger;
    if (!docs || ( Array.isArray(docs) && docs.length == 0))
        return new Promise(function (resolve) {
            resolve({success: true});
        });
    if (!Array.isArray(docs))
        docs = [docs];
    for (var i = 0; i < docs.length; i++) {
        if (!docs[i]._rev && !docs[i]._id)
            continue;
        docs[i]._deleted = true;
    }
    return this.db.bulkDocs(docs);
};

/**
 * @typedef {Object} PouchCommands.cleanRows.Options Options for the cleaning of the rows
 * @property {boolean} [withoutRev=false] False keep the revisions on the rows.Otherwise they are removed.
 * @property {boolean} [withError=false] True, keeps errored rows. Otherwise they are removed.
 */

/**
 * Clean the result object of CouchDB by returning only valid rows.
 * @public
 * @param {Object} result
 * @param {PouchCommands.cleanRows.Options|null} [opts={}]  The options for the cleaning
 * @returns {Array} Returns an array of valid rows.
 */
PouchCommands.prototype.cleanRows = function (result, opts) {
    if (!opts || opts === {} || typeof opts !== "object")
        opts = {withoutRev: false, withError: false};

    var rows = [];
    if (result && result.rows && result.rows.length > 0)
        for (var i = 0; i < result.rows.length; i++) {
            var eligible = (result.rows[i].error && opts.withError) || !result.rows[i].error;
            if (eligible && result.rows[i].doc) {
                if (opts.withoutRev)
                    delete result.rows[i].doc._rev;
                rows.push(result.rows[i].doc);
            }
        }
    return rows;
};


//<editor-fold desc="Private functions" defaultstate="collapsed">

/**
 * Build the database URL for PouchDB.
 * @private
 * @throws {TypeError} Throws a type error if the username and password are not well supplied.
 * @param {String} url The url of the database
 * @param {String} [username] The username for the remote database if required.
 * @param {String} [password] The password for the remote database if required.
 */
PouchCommands.prototype._buildUrl = function (url, username, password) {
    if ((password && !username) || (!password && username))
        throw new TypeError("Both username and password must be defined. You can't provide only one of them.");
    if (username) {
        var parsedUrl = URL.parse(url);
        if (!parsedUrl.protocol)
            throw new TypeError("Username/Password are only for remote databases");
        url = parsedUrl.protocol + '//' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + parsedUrl.host + parsedUrl.path;
    }
    return url;
};

//</editor-fold>


//Compatibility tweaking
if (!Object.values) {
    Object.prototype.values = function (obj) {
        var vals = [];
        for (var n in obj) {
            if (obj.hasOwnProperty(n)) {
                vals.push(obj[n]);
            }
        }
        return vals;
    }
}

module.exports = PouchCommands;
