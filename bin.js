#!/usr/bin/env node

'use strict';
/* global process */

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

// TODO : Update examples

var yargs = require('yargs')
    .help()
    .commandDir('cmds')
    .demand(1, ['d'])
    .alias('d', 'db')
    .describe('d', 'The database URL or base')
    .alias('u', 'username')
    .describe('u', 'Username for the CouchDB database (if it\'s protected)')
    .alias('p', 'password')
    .describe('p', 'Password for the CouchDB database (if it\'s protected)')
    .global(['d', 'u', 'p'])
    .example('$0 http://localhost:5984/mydb > dump.txt',
        'Dump from the "mydb" CouchDB to dump.txt')
    //  .example('$0 /path/to/mydb > dump.txt',
    //    'Dump from the "mydb" LevelDB-based PouchDB to dump.txt')
    .example('$0 http://localhost:5984/mydb -o dump.json',
        'Dump to the specified file instead of stdout')
    .example('$0 http://example.com/mydb -u myUsername -p myPassword > dump.txt',
        'Specify a CouchDB username and password if it\'s protected').argv;
