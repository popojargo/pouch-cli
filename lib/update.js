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
var Utils = require("./utils.js");
var Merge = require("merge");
var asyncProcess = require("async-process");


/**
 * Constructor of the PouchCommands object.
 * This object is a higher level wrapper for PouchDB.
 * Simplify queries with easier functions.
 * @constructor
 * @param {PouchDB} db The pouchDB instance to work with.
 * @throws {TypeError} If db is not a PouchDB instance.
 */
var Update = function (db) {
    if (!db || typeof db !== "object")
        throw new TypeError("The db parameter must be of type PouchDB.");

    /**
     * @public
     * @type PouchDB
     */
    this.db = db
};


/**
 * Get all the document according to the keys.
 * @param {string|object|Array} data The data to be inserted/updated in the database. Can be either a JSON string or Object(s).
 * @returns {Promise}    Returns a promise with the an array of rows as result.
 */
Update.prototype.fromData = function (data) {
    if (data == null)
        data = "";

    //We try to parse it as json
    if (typeof data == "string")
        try {
            data = JSON.parse(data);
        } catch (e) {
            throw new TypeError("The supplied parameter was not a valid JSON string,Object or Array or objects");
        }
    else if (!Array.isArray(data))
        data = [data];

    return this._update(data);
};

Update.prototype.fromFiles = function (file) {
    if (files == null)
        return new TypeError("The [files] parameter must be specified");
    if (!Array.isArray(files))
        files = [files];
    return new Promise(function (resolve, reject) {
        var loadedData = {};
        new asyncProcess(files, function (file, cb) {
            fs.readFile(file, function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    loadedData[file] = data;
                    cb();
                }
            });
        }, function () {
            resolve(loadedData);
        });

    }).then(function (data) {
        return this._update(data);
    });
};

/**
 * Update the documents in the database
 * @param {Array} docs  An array of documents to update or create
 * @private
 * @returns {Promise} Returns a promise from PouchDB
 */
Update.prototype._update = function (docs) {
    var that = this;
    var indexedArray = Utils.indexArray(docs, "_id");
    return this.db.allDocs({
        keys: Object.keys(indexedArray),
        include_docs: true
    }).then(function (result) {
        var newDocs = {};
        if (result.rows)
            for (var i = 0; i < result.rows.length; i++)
                if (!result.error && result.doc) {
                    var row = result.rows[i];
                    newDocs[row.id] = row.doc;
                }
        //Merge
        newDocs = Merge(newDocs, indexedArray);
        return that.db.bulkDocs(Object.values(newDocs));
    })
};


module.exports = Update;
