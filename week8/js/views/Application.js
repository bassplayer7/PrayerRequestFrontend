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

define(["jquery", "PubSub", "evt", './Request', './Add', "HandleBars", "text!./template/empty.html"],
    function($, PubSub, evt, RequestView, AddView, HandleBars, emptyTemplate) {

    var ApplicationView = function(unansweredContainer, answeredContainer, RequestCollection) {
        var base = this;
        this.answeredContainer = answeredContainer;
        this.unansweredContainer = unansweredContainer;
        this.collection = RequestCollection;
        this.lists = ['answered', 'unanswered'];
        this.addView = new AddView();

        this.getListElement = function(answered) {
            var answeredStr = answered ? "answered" : "unanswered",
                $element = this[answeredStr + "Container"].find('.list-group');

            if ($element.length === 0) {
                $element = $('<ul></ul>').addClass('list-group');
                this[answeredStr + "Container"].append($element);
            }

            return $element;
        };

        this.addRequestToList = function(eventName, request) {
            var requestView = new RequestView(request),
                $newRequest = requestView.getElement();

            if (eventName === evt.REQUEST_NEW_ADD) {
                $newRequest.addClass("new");

                setTimeout(function() {
                    $newRequest.removeClass("new");
                }, 1500);
            }

            this.getListElement(request.Answered).append($newRequest);
        };
        
        this.addEmptyListMessage = function() {
            var $group = $('.list-group');

            $group.each(function() {
                if ($(this).children('li').length === 0) {
                    var template = HandleBars.compile(emptyTemplate);
                    $(this).before(template).remove();
                }
            });
        };

        this.removeMessageIfPopulated = function($container) {
            var $emptyList = $container.children('.empty-list');

            if ($container instanceof $ && $emptyList.length > 0 && $container.children('.list-group').length > 0) {
                $container.children('.empty-list').remove();
            }
        };

        this.clearEmptyListMessages = function() {
            this.removeMessageIfPopulated(this.unansweredContainer);
            this.removeMessageIfPopulated(this.answeredContainer);
        };

        this.markAsAnswered = function(eventName, data) {
            var $item = data.element;
            $item.find('.action-answer').remove();
            this.answeredContainer.find('.list-group').append($item);
            PubSub.publish(evt.LIST_ACTION_COMPLETE, $item);
        };

        this.endEdit = function() {
            $('.list-group-item').removeClass("edit-mode");
        };

        this.finishEdit = function(model, $el) {
            $el.siblings('.item-title').text($el.val());
            model.OldTitle = model.Title;
            model.Title = $el.val();
            base.endEdit();
            PubSub.publish(evt.REQUEST_UPDATE_SAVE, model);
            $el.off('keydown');
        };

        this.keyActions = function($input, model) {
            $input.keydown(function(e) {
                if (e.which === 13) {
                    base.finishEdit(model, $input);
                }

                if (e.which === 27) {
                    base.endEdit();
                }
            });
        };

        this.initRequestUpdate = function(eventName, data) {
            var $el = data.element,
                model = data.model,
                $listItem = $el.parents('.list-group-item'),
                $input = $listItem.find('.item-edit');

            $listItem.addClass("edit-mode");
            $input.val(model.Title).focus();

            this.keyActions($input, model, $el);
        };

        this.completeRequestUpdate = function(eventName, data) {
            console.log("Request updated successfully!");
            // will add more
        };

        this.removeRequestFromList = function(eventName, data) {
            var $el = data.element;

            if ($el) {
                $el.parents('.list-group-item').remove();
                PubSub.publish(evt.REQUEST_DELETE_CLEANUP, $el.parents('.list-group'));
                $el.remove(); // removes actual delete icon
            }
        };

        this.buildInitialList = function() {
            this.collection.buildInitialList();
        };

        this.setup = function() {
            PubSub.subscribe(evt.REQUEST_ADD, this.addRequestToList.bind(this));
            PubSub.subscribe(evt.REQUEST_NEW_ADD, this.addRequestToList.bind(this));
            PubSub.subscribe(evt.REQUEST_UPDATE_INIT, this.initRequestUpdate.bind(this));
            PubSub.subscribe(evt.REQUEST_UPDATE_COMPLETE, this.completeRequestUpdate.bind(this));
            PubSub.subscribe(evt.REQUEST_DELETE_CLEANUP, this.addEmptyListMessage);
            PubSub.subscribe(evt.REQUEST_DELETE_COMPLETE, this.removeRequestFromList.bind(this));
            PubSub.subscribe(evt.REQUEST_ANSWERED_COMPLETE, this.markAsAnswered.bind(this));
            PubSub.subscribe(evt.LIST_ACTION_COMPLETE, this.addEmptyListMessage);
            PubSub.subscribe(evt.REQUEST_NEW_ADD, this.clearEmptyListMessages.bind(this));
        };

        this.setup();
    };

    return ApplicationView;
});
