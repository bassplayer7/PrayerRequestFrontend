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

define(['jquery', 'HandleBars', 'PubSub', 'evt', 'text!./template/add.html', "BootstrapTab"],
    function($, HandleBars, PubSub, evt, AddTemplate) {
    var AddView = function() {
        var base = this;
        this.buttonText = undefined;
        this.button = undefined;

        this.getElement = function() {
            return $('#add_request_input');
        };

        this.getButton = function() {
            if (this.button !== undefined) {
                return this.button;
            } else {
                return $('#add_request');
            }
        };

        this.registerOpenInputClick = function() {
            this.getButton().off('click').click(base.showInput.bind(base));
        };

        this.registerSubmitRequestClick = function() {
            this.getButton().off('click').click(base.submitRequest.bind(base));
        };

        this.hideInput = function() {
            this.getElement().remove();

            if (this.buttonText !== undefined) {
                this.getButton().text(this.buttonText).removeClass('opened');
                this.registerOpenInputClick();
            }
        };

        this.addRequest = function($title, $date, $answered) {
            if (typeof $title !== "string") {
                return false;
            }

            PubSub.publish(evt.REQUEST_NEW_INIT, {
                Title: $title,
                Date: $date,
                Answered: $answered
            });
        };

        this.submitRequest = function() {
            var $inputValue = this.getElement().val();

            if ($inputValue) {
                this.addRequest($inputValue);
                this.hideInput();
            }
        };

        this.keyActions = function($el) {
            $el.keydown(function(e) {
                if (e.which === 13) {
                    base.submitRequest.call(base);
                }

                if (e.which === 27) {
                    base.hideInput();
                }
            });
        };

        this.showInput = function() {
            var template = HandleBars.compile($(AddTemplate).html()),
                button = this.getButton();

            this.buttonText = this.getButton().text();
            this.button = button;

            button.before(template);

            button.text('Save').addClass('opened');
            this.registerSubmitRequestClick();
            this.keyActions(button.parent());

            this.getElement().focus();
        };

        this.setup = function() {
            this.registerOpenInputClick();

            $(document).keydown(function(e) {
                if (!$(":focus").is("input")) {
                    if (e.which === 67) { // c for compose
                        e.preventDefault();
                        base.showInput.apply(base);
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

        this.setup();
    };

    return AddView;
});