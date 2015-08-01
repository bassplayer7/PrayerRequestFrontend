/**
 * SwiftOtter_Base is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SwiftOtter_Base is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with SwiftOtter_Base. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright: 2015 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 7/18/15
 */
define({
    // Request has been created by user:
    REQUEST_NEW_INIT: "request.new.init",

    // Request has been saved/processed and is ready to be added to list:
    REQUEST_NEW_ADD: "request.new.add",

    //REQUEST_NEW_SAVE: "request.new.save",

    // Request has been added to list and all actions related to its creation have been finalized:
    REQUEST_NEW_COMPLETE: "request.new.complete",

    REQUEST_NEW_ERROR: "request.new.error",

    // Delete request action has been initialized:
    REQUEST_DELETE_INIT: "request.delete.start",

    // Main Delete action
    REQUEST_DELETE: "request.delete.remove",

    // The request has been deleted:
    REQUEST_DELETE_COMPLETE: "request.delete.complete",
    REQUEST_DELETE_CLEANUP: "request.delete.cleanup",

    // Request has been marked as updated:
    REQUEST_ANSWERED_INIT: "request.answered.init",
    REQUEST_ANSWERED_COMPLETE: "request.answered.complete",

    REQUEST_UPDATE_INIT: "request.update.init",
    REQUEST_UPDATE_SAVE: "request.update.save",
    REQUEST_UPDATE_COMPLETE: "request.update.complete",

    // Add request to list:
    REQUEST_ADD: "request.add",

    LIST_ACTION_COMPLETE: "list.action.complete",

    ERROR: "error",
    ERROR_UNKNOWN: "error.unknown"
});