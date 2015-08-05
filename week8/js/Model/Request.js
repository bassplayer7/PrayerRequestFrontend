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
 * @copyright Swift Otter Studios, 7/9/15
 */

define(function() {
    var RequestModel = function(request) {
        if (typeof request === "object") {
            for (var key in request) {
                if (request.hasOwnProperty(key)) {
                    this[key] = request[key];
                }
            }
        } else if (typeof request === "string") {
            this.Title = request;
        } else {
            throw "Unrecognized prayer request provided.";
        }

        if (typeof this.Id === "string") {
            this.Id = parseInt(this.Id);
        }

        if (!this.Date) {
            var date = new Date(),
                month = date.getMonth() + 1 + "",
                day = date.getDate() + "";
            month = month.length === 1 ? '0' + month : month;
            day = day.length === 1 ? '0' + day : day;

            this.Date = month +
                "-" + day +
                "-" + date.getFullYear();
        }

        if (this.Answered === "1") {
            this.Answered = true;
        } else {
            this.Answered = false;
        }
    };

    return RequestModel;
});
