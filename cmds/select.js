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

exports.command = 'select <command>';
exports.desc = 'Select documents from the database';
exports.builder = function (yargs) {
    return yargs.commandDir('select_cmds')
        .alias('k', 'keys')
        .array('k')
        .describe('k', 'The key(s) to fetch')
        .alias('o', 'output-file')
        .alias('r', 'rev')
        .boolean(['r', 'e'])
        .describe('r', 'Fetch the documents without their revision')
        .default('r', true)
        .alias('e', 'with-error')
        .describe('e', 'Returns the documents even if they are errored')
        .default('e', false)
        .describe('o', 'Output file(else will dump to stdout')
        .global(['k', 'o', 'r', 'e']);
};
exports.handler = function (argv) {
};