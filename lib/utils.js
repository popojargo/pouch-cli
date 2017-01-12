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
var fs = require('fs');

var Utils = {};

Utils.writeContent = function (content, outfile) {
    var outstream;
    if (outfile) {
        outstream = fs.createWriteStream(outfile, {
            encoding: 'utf8'
        });
    } else {
        if (typeof process.stdout.setEncoding === 'function') {
            process.stdout.setEncoding('utf8');
        }
        outstream = process.stdout;
    }
    outstream.on('finish', function () {
        console.info("File has been written.");
    });
    outstream.write(JSON.stringify(content));
    if (outfile)
        outstream.end();
};

/**
 * Get the ids of an array of documents
 * @param {Array} documents The array of documents to analyze
 * @return {Array}  Returns an array of keys(string).
 */
Utils.getIdsFromArray = function (documents) {
    if (!Array.isArray(documents))
        throw new TypeError("The supplied parameter was not an Array.");
    var keys = [];
    for (var n in documents)
        if (documents.hasOwnProperty(n) && documents[n]._id != null)
            keys.push(documents[n]._id);
    return keys;
};

/**
 * Convert an array to an object by indexing a certain parameter
 * @param {Array} array An array of documents to convert to an object. Each value must contains the index key or it won't be indexed
 * @param {string} [idxKey="id"]    The key used to index every documents
 * @return {Object} Returns an object. Each property is the key indexed. The value is the document associated to this key.
 */
Utils.indexArray = function (array, idxKey) {
    if (!Array.isArray(array))
        throw new TypeError("The first parameter must be of type Array");
    if (!idxKey)
        idxKey = "id";

    var indexed = {};
    for (var i = 0; i < array.length; i++) {
        if (array[i][idxKey])
            indexed[array[i][idxKey]] = array[i];
    }
    return indexed;
};


module.exports = Utils;