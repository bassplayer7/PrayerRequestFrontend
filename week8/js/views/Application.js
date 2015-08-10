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

define(["jquery", "PubSub", "evt", 'errorMsg', './Request', '../Model/Request', './Add', "HandleBars", "text!./template/empty.html"],
    function($, PubSub, evt, errorMsg, RequestView, RequestModel, AddView, HandleBars, emptyTemplate) {

        var ApplicationView = function(unansweredContainer, answeredContainer, RequestCollection) {
            this.answeredContainer = answeredContainer;
            this.unansweredContainer = unansweredContainer;
            this.collection = RequestCollection;
            this.updateButtonText = "Update";

            this.getParent = function($el) {
                return $el.parents(".list-group-item");
            };

            this.setup = function() {
                PubSub.subscribe(evt.REQUEST_ADD, this.addRequestToList.bind(this));
                PubSub.subscribe(evt.REQUEST_NEW_ADD, this.addRequestToList.bind(this));
                PubSub.subscribe(evt.REQUEST_UPDATE_END, this.endEdit.bind(this));
                PubSub.subscribe(evt.REQUEST_UPDATE_COMPLETE, this.completeRequestUpdate.bind(this));
                PubSub.subscribe(evt.REQUEST_DELETE_CLEANUP, this.addEmptyListMessage);
                PubSub.subscribe(evt.REQUEST_DELETE_COMPLETE, this.removeRequestFromList.bind(this));
                PubSub.subscribe(evt.REQUEST_ANSWERED_COMPLETE, this.toggleAnsweredComplete.bind(this));
                PubSub.subscribe(evt.REQUEST_NEW_ADD, this.clearEmptyListMessages.bind(this));
                PubSub.subscribe(evt.LIST_ACTION_COMPLETE, this.addEmptyListMessage);
                PubSub.subscribe(evt.INITIALIZE_SYSTEM, this.addEmptyListMessage.bind(this));
                PubSub.subscribe(evt.ERROR_UPDATE, this.updateError.bind(this));
                PubSub.subscribe(evt.ERROR, this.generalError.bind(this));
            };

            this.setup();
        };

        ApplicationView.prototype.lists = ['answered', 'unanswered'];
        ApplicationView.prototype.addView = new AddView();

        ApplicationView.prototype.getListElement = function(answered) {
            var answeredStr = answered ? "answered" : "unanswered",
                $element = this[answeredStr + "Container"].find('.list-group');

            if ($element.length === 0) {
                $element = $('<ul></ul>').addClass('list-group');
                this[answeredStr + "Container"].append($element);
            }

            return $element;
        };

        ApplicationView.prototype.addRequestToList = function(eventName, request) {
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

        ApplicationView.prototype.addEmptyListMessage = function() {
            var $group = $('.list-group'),
                template = HandleBars.compile(emptyTemplate);

            if ($group.length < 1) {
                this.answeredContainer.append(template);
                this.unansweredContainer.append(template);
            }

            $group.each(function() {
                if ($(this).children('li').length === 0) {
                    $(this).before(template).remove();
                }
            });
        };

        ApplicationView.prototype.removeMessageIfPopulated = function($container) {
            var $emptyList = $container.children('.empty-list');

            if ($container instanceof $ && $emptyList.length > 0 && $container.children('.list-group').length > 0) {
                $container.children('.empty-list').remove();
            }
        };

        ApplicationView.prototype.clearEmptyListMessages = function() {
            this.removeMessageIfPopulated(this.unansweredContainer);
            this.removeMessageIfPopulated(this.answeredContainer);
        };

        ApplicationView.prototype.toggleAnsweredComplete = function(eventName, data) {
            var $item = data.element;
            $item.removeClass("answer").find('.status-text').remove();

            if (data.model.Answered) {
                // currently a page refresh is required to show the checkmark as green under #answered
                // I do not know why this isn't having any effect
                $item.find(".action-answer").addClass("hover");
                this.answeredContainer.find('.list-group').append($item);
                $('[href="#answered"]').addClass("success");
            } else {
                $item.find(".action-answer").removeClass("hover");
                this.unansweredContainer.find('.list-group').append($item);
                $('[href="#unanswered"]').addClass("success");
            }

            setTimeout(function() {
                $(".nav .success").removeClass("success");
            }, 1500);

            PubSub.publish(evt.LIST_ACTION_COMPLETE, $item);
        };

        ApplicationView.prototype.endEdit = function() {
            $('.list-group-item')
                .off('keydown')
                .removeClass("edit-mode")
                .find(".error-message")
                .text('')
                .removeClass("active");

            $(".button-update")
                .text(this.updateButtonText)
                .prop("disabled", false);
        };

        ApplicationView.prototype.completeRequestUpdate = function(eventName, data) {
            this.endEdit();
            data.element.addClass("new");

            setTimeout(function() {
                data.element.removeClass("new");
            }, 1500);
        };

        ApplicationView.prototype.updateError = function(eventName, data) {
            var $el = data.element,
                errorCode = data.response.status,
                $errorElement = $el.find(".error-message").addClass("active");

            $el.find(".title-edit").focus();
            $el.find(".button-update").prop("disabled", false).text("Try again");
            $errorElement.text(errorMsg[errorCode]);
        };

        ApplicationView.prototype.removeRequestFromList = function(eventName, data) {
            var $el = data.element;

            if ($el) {
                var $parent = this.getParent($el);
                $parent.addClass("fade-out");

                setTimeout(function() {
                    $parent.remove();
                    PubSub.publish(evt.REQUEST_DELETE_CLEANUP, $el.parents('.list-group'));
                    $el.remove(); // removes actual delete icon
                }, 500);
            }
        };

        ApplicationView.prototype.generalError = function(eventName, data) {
            var text = errorMsg[data.data.status] || "I'm sorry, but there has been an error.",
                $errorElement = $(".global.error-message");

            $errorElement.addClass("active").text(text);

            setTimeout(function() {
                $errorElement.text('').removeClass("active");
            }, 3000);
        };

        ApplicationView.prototype.buildInitialList = function() {
            this.collection.buildInitialList();
        };

    return ApplicationView;
});
