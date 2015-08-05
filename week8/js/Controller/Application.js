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

define(["jquery", "../Collection/Request", "../views/Application", "PubSub", "evt"],
    function($, RequestCollection, ApplicationView, PubSub, evt) {
    var Application = function(unansweredContainer, answeredContainer) {
        this.requestCollection = new RequestCollection();
        this.view = new ApplicationView(unansweredContainer, answeredContainer, this.requestCollection);

        this.showList = function() {
            this.view.buildInitialList();
        };

        $(document).keydown(function(e) {
            if (!$(":focus").is("input")) {
                if (e.which === 67) { // c for compose
                    e.preventDefault();
                    PubSub.publish(evt.REQUEST_NEW_SHOW);
                } else if (e.which === 85) { // u for unanswered
                    e.preventDefault();
                    $('.nav-tabs a[href="#unanswered"]').tab('show');
                } else if (e.which === 65) {// a for answered
                    e.preventDefault();
                    $('.nav-tabs a[href="#answered"]').tab('show');
                }
            }
        });
    };

    return Application;
});
