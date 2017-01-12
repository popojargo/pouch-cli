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
var DEFAULT_DESIGN_DOC = 'pouchdb-commands';

//Module loading
var Clone = require("clone");
var Promise = require("lie");
var Equal = require("deep-equal");
var Merge = require("merge");

/**
 * Constructor of the PouchCommands object.
 * This object is a higher level wrapper for PouchDB.
 * Simplify queries with easier functions.
 * @constructor
 * @param {PouchDB} db The pouchDB instance to work with.
 * @throws {TypeError} If db is not a PouchDB instance.
 */
var Query = function (db) {
    if (!db || typeof db !== "object")
        throw new TypeError("The db parameter must be of type PouchDB");

    /**
     * @public
     * @type PouchDB
     */
    this.db = db
};


/**
 * Get all the document according to the keys.
 * @param {Array|String} keys The id or the keys of the documents to fetch.
 * @param {Object} [queryOpts={}]  Additionnal PouchDB query options.
 * @returns {Promise}    Returns a promise with the an array of rows as result.
 */
Query.prototype.all = function (keys, queryOpts) {
    var options = {include_docs: true};
    //Keys convert to string
    if ((keys !== null && keys !== undefined) && !Array.isArray(keys))
        keys = keys + "";
    if (keys) {
        if (!Array.isArray(keys))
            options.key = keys;
        else
            options.keys = keys;
    }
    if (queryOpts && typeof queryOpts === "object")
        options = Merge(queryOpts, options);
    return this.db.allDocs(options);
};


/**
 * Get the rows from a view.
 * @throws {TypeError} If keys is set and startkey and/or endkey are used
 * @param {String} view        The view name without the _design. Eg : "global/by_name".
 * @param {Array|String} keys    The key or keys to fetch from the view.
 * @param {Object} [queryOptions={include_docs:true}]    Additionnal PouchDB query options.
 * @returns {Promise}    Returns a promise with the rows as result.
 */
Query.prototype.byView = function (view, keys, queryOptions) {
    if (keys && (queryOptions.startKey || queryOptions.endKey))
        throw new TypeError("You can't combine the query options keys with startKey and/or endKey");
    var options = {include_docs: true};

    //Keys convert to string
    if ((keys !== null && keys !== undefined) && !Array.isArray(keys))
        keys = keys + "";
    if (keys)
        options['key' + (Array.isArray(keys) ? 's' : '')] = keys;

    if (queryOptions && typeof queryOptions === "object")
        options = Merge(queryOptions, options);
    return this.db.query(view, options).then(function (result) {
        return new Promise(function (resolve) {
            resolve(result);
        });
    }).catch(function (err) {
        console.error(err);
    });
};

/**
 * Get rows by a key-values conditions.
 *
 * @throws {TypeError} If the key parameter is null.
 * @param {String} key    The key of each doc that will be compared.
 * @param {Array|String} values    The value(s) to fetch from the key-value condition.
 * @param {boolean|null} [useDesignDoc=false] Determine if a design document will be created or no.
 * @param {Object|null} [queryOptions={}]    Additionnal  PouchDB query options.
 * @returns {Promise}    Return a promise with the rows that matched the key-value condition.
 */
Query.prototype.getByKeyValue = function (key, values, useDesignDoc, queryOptions) {
    //Callback reference fix
    var that = this;

    //Parameter validation
    if (!key)
        throw new TypeError("The key parameter must not be null");
    if (useDesignDoc == null)
        useDesignDoc = false;
    if (queryOptions == null)
        queryOptions = {};

    var defaultOpts = {include_docs: true};
    //Keys convert to string
    if ((values !== null && values !== undefined) && !Array.isArray(values))
        values = values + "";
    if (values)
        defaultOpts["key" + (Array.isArray(values) ? 's' : '')] = values;

    return this._getViewParameter(key, useDesignDoc).then(function (view) {
        queryOptions = Merge(queryOptions, defaultOpts);
        return that.db.query(view, queryOptions);
    }).then(function (result) {
        return new Promise(function (resolve) {
            resolve(result);
        });
    }).catch(function (err) {
        console.error(err);
    });
};


/**
 * Create a view on the defined design document.
 * @private
 * @throws {TypeError} Throws a TypeError if the supplied parameters are invalids.
 * @param {String} name    The name of the view to add
 * @param {Function|String} [map=""] The map function or string.
 * @param {Function|String} [reduce=""]    The reduce string or function
 * @returns {Promise}    Returns a promise.
 */
Query.prototype._getOrCreateView = function (name, map, reduce) {
    var that = this;
    if (!name)
        throw new TypeError("You must specified the name of your view");

    //Check if it exists
    return that._getDesignDoc(DEFAULT_DESIGN_DOC).then(function (doc) {
        var newDoc = that._putView(doc, name, map, reduce);
        if (Equal(doc, newDoc)) {
            return new Promise(function (resolve) {
                resolve(newDoc);
            });
        } else
            return that.db.put(doc);

    }).then(function () {
        return new Promise(function (resolve) {
            resolve(DEFAULT_DESIGN_DOC + '/' + name);
        });
    }).catch(function (err) {
        console.error("An error occured" + err);
    });
};

/**
 * Put a view into a design document
 * @private
 * @param {Object} doc    The document to add the view to.
 * @param {String} name    The name of the view to add or update
 * @param {String|Function} [map=""]    The map function or the map string
 * @param {String|Function} [reduce=""]    The reduce function or the reduce string.
 * @returns {Object}    Returns the document updated if possible.
 */
Query.prototype._putView = function (doc, name, map, reduce) {
    if (!doc || typeof doc !== "object")
        return doc;
    //Document validation
    var newDoc = Clone(doc);
    if (!newDoc.views)
        newDoc.views = {};
    //Create the view
    if (!newDoc.views[name])
        newDoc.views[name] = {};
    //Validate map and reduce props.
    if (!newDoc.views[name].map)
        newDoc.views[name] = {map: "", reduce: ""};
    //Add map
    if (map && newDoc.views.map != map.toString()) //Update if necessary
        newDoc.views[name].map = map.toString();
    //Add reduce
    if (reduce && newDoc.views.reduce != map.toString())
        newDoc.views[reduce].reduce = reduce.toString();
    return newDoc;
};

/**
 * Get the design doc and creates it if it's not existing
 * @private
 * @param {String} name    The name of the design document
 * @returns {Promise}
 */
Query.prototype._getDesignDoc = function (name) {
    var id = '_design/' + name;
    var that = this;
    this.db.get(id).catch(function (err) {
        if (err.status === '404')
            return that.put({
                _id: '_design/' + name,
                language: "javascript"
            });
    });
};

/**
 * Returns a promise with the view parameter of the .query() function.
 * This could be either a design/view name or a map function.
 * @param {String} key    The key used for the mapping
 * @param {boolean} [useDesignDoc=false] Determine if a design document will be created in the database.
 *  If not, it will be filtered locally.
 * @returns {Promise}    Returns a promise with the first parameter.
 */
Query.prototype._getViewParameter = function (key, useDesignDoc) {
    var mapFn = "function(doc){if(doc." + key + ")emit(doc." + key + ");}";
    if (useDesignDoc) { //We try to fetch a _design/view string
        return this._getOrCreateView('by_' + key, mapFn);
    } else { //We use local filtering with a javascript function
        return new Promise(function (resolve) {
            resolve({map: mapFn});
        });
    }
};


module.exports = Query;
