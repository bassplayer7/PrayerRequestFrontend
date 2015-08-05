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
 * @copyright Swift Otter Studios, 7/20/15
 */

define(['jquery', 'HandleBars', 'PubSub', 'evt', 'errorMsg', 'text!./template/add.html', "BootstrapTab"],
    function($, HandleBars, PubSub, evt, errorMsg, AddTemplate) {
        var AddView = function() {
            this.setup = function() {
                this.registerOpenInputClick();
                PubSub.subscribe(evt.REQUEST_NEW_SHOW, this.showInput.bind(this));
                PubSub.subscribe(evt.REQUEST_NEW_COMPLETE, this.completeAddRequest.bind(this));
                PubSub.subscribe(evt.REQUEST_NEW_ERROR, this.displayError.bind(this));
            };

            this.setup();
        };

        AddView.prototype.buttonText = undefined;
        AddView.prototype.button = undefined;
        AddView.prototype.container = $('.add-request-container');

        AddView.prototype.getContainer = function() {
            return this.container;
        };

        AddView.prototype.getInput = function() {
            return $('#add_request_input');
        };

        AddView.prototype.getTitle = function() {
            return $('#add_request_title');
        };

        AddView.prototype.getDate = function() {
            return $('#add_request_date');
        };

        AddView.prototype.getButton = function() {
            if (this.button !== undefined) {
                return this.button;
            } else {
                return $('#add_request');
            }
        };

        AddView.prototype.registerOpenInputClick = function() {
            var base = this;
            this.getButton().off('click').click(base.showInput.bind(base));
        };

        AddView.prototype.registerSubmitRequestClick = function() {
            var base = this;
            this.getButton().off('click').click(base.submitRequest.bind(base));
        };

        AddView.prototype.hideInput = function() {
            this.getInput().remove();
            this.getErrorElement().addClass("hidden");

            if (this.buttonText !== undefined) {
                this.getButton()
                    .text(this.buttonText)
                    .removeClass('opened')
                    .removeClass('sending')
                    .prop("disabled", false);

                this.registerOpenInputClick();
            }
        };

        AddView.prototype.addRequest = function($title, $date) {
            if (typeof $title !== "string") {
                return false;
            }

            PubSub.publish(evt.REQUEST_NEW_INIT, {
                Title: $title,
                Date: $date
            });
        };

        AddView.prototype.submitRequest = function() {
            var $titleValue = this.getTitle().val();

            if ($titleValue) {
                this.getButton().text('Sending...').prop("disabled", true);
                this.getInput().addClass('sending');
                this.addRequest($titleValue, this.getDate().val());
            }
        };

        AddView.prototype.keyActions = function($el) {
            var base = this;
            $el.off('keydown');

            $el.keydown(function(e) {
                if (e.which === 13) { // enter
                    base.submitRequest.call(base);
                }

                if (e.which === 27) { // esc
                    base.hideInput();
                }
            });
        };

        AddView.prototype.showInput = function() {
            if (this.getInput().length >= 1) {
                return false;
            }

            var template = HandleBars.compile(AddTemplate),
                $button = this.getButton();

            this.buttonText = $button.text();
            this.button = $button;

            $button.before(template);

            $button.text('Save').addClass('opened');
            this.registerSubmitRequestClick();
            this.keyActions($button.parent());

            this.getTitle().focus();
        };

        AddView.prototype.completeAddRequest = function() {
            this.hideInput();
            this.getErrorElement().addClass("hidden");
        };

        AddView.prototype.enableAddRequest = function() {
            this.getButton().text("Try Again").prop("disabled", false);
            this.getInput().removeClass("sending");
        };

        AddView.prototype.getErrorElement = function() {
            if (this.errorEl === undefined) {
                var $errorEl = $("<div></div>");
                $errorEl.addClass("add-request-error");
                this.getContainer().append($errorEl);
                this.errorEl = $errorEl;
            }

            this.errorEl.text('').removeClass("hidden");

            return this.errorEl;
        };

        AddView.prototype.displayError = function(eventName, response) {
            this.enableAddRequest();
            this.getErrorElement().text(errorMsg[response.status]);
        };

    return AddView;
});