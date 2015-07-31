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

define(['jquery', 'PubSub', 'evt', 'HandleBars', 'text!./template/request.html'],
    function($, PubSub, evt, HandleBars, requestTemplate) {
        var RequestView = function(model) {
            this.model = model;

            var base = this,
                template = HandleBars.compile(requestTemplate),
                compiledTemplate = $(template(this.model));

            compiledTemplate.find('.action-delete').click(function() {
                base.removeListItem($(this));
            });

            compiledTemplate.find('.action-answer').click(function() {
                base.answerListItem($(this));
            });

            compiledTemplate.find('.action-edit').click(function() {
                base.updateListItem($(this));
            });

            this.getElement = function() {
                return compiledTemplate;
            };
        };

        RequestView.prototype.removeListItem = function($el) {
            PubSub.publish(evt.REQUEST_DELETE_INIT, {
                model: this.model,
                element: $el
            });
        };

        RequestView.prototype.updateListItem = function($el) {
            PubSub.publish(evt.REQUEST_UPDATE_INIT, {
                model: this.model,
                element: $el
            });
        };

        RequestView.prototype.answerListItem = function($el) {
            PubSub.publish(evt.REQUEST_ANSWERED_INIT, {
                model: this.model,
                element: $el.parents('.list-group-item')
            });
        };

    return RequestView;
});
