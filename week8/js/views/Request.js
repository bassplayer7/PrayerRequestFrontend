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

            compiledTemplate.find('.action-delete').click(base.initRequestRemove.bind(this));
            compiledTemplate.find('.action-answer').click(base.initToggleAnswered.bind(this));
            compiledTemplate.find('.action-edit').click(base.initRequestUpdate.bind(this));
            compiledTemplate.find(".button-update").click(base.finishEdit.bind(this));
            compiledTemplate.find(".button-cancel").click(base.cancelEdit.bind(this));

            this.getElement = function() {
                return compiledTemplate;
            };
        };

        RequestView.prototype.initRequestRemove = function() {
            var $el = this.getElement(),
                $deleteText = $('<span class="status-text">(deleting)</span>');

            $el.addClass("delete");

            $el.find(".item-title").after($deleteText);
            this._publishEvent(evt.REQUEST_DELETE_INIT, $el);
        };

        RequestView.prototype.initToggleAnswered = function() {
            var $el = this.getElement(),
                $answeredText = $('<span class="status-text green">(updating)</span>');

            $el.addClass("answer");

            $el.find(".item-title").after($answeredText);
            this._publishEvent(evt.REQUEST_ANSWERED_INIT, $el);
        };

        RequestView.prototype.initRequestUpdate = function() {
            var $el = this.getElement(),
                $title = $el.find('.title-edit'),
                $date = $el.find('.date-edit');

            this.model.OldTitle = this.model.Title;
            this.model.OldDate = this.model.Date;
            $el.addClass("edit-mode");
            $title.val(this.model.Title).focus();
            $date.val(this.model.Date);

            this.keyActions();
        };

        RequestView.prototype.cancelEdit = function() {
            var $el = this.getElement();

            this.model.Title = this.model.OldTitle;
            this.model.Date = this.model.OldDate;

            $el.find(".item-title").text(this.model.OldTitle);
            $el.find(".item-date").text(this.model.OldDate);

            this._publishEvent(evt.REQUEST_UPDATE_END, $el);
        };

        RequestView.prototype.finishEdit = function() {
            var $el = this.getElement(),
                newTitle = $el.find(".title-edit").val(),
                newDate = $el.find(".date-edit").val(),
                $updateBtn = $el.find(".button-update");

            $el.find('.item-title').text(newTitle);
            $el.find('.item-date').text(newDate);
            this.model.Title = newTitle;
            this.model.Date = newDate;

            $updateBtn.text('saving...').prop('disabled', true);
            this._publishEvent(evt.REQUEST_UPDATE_SAVE, $el);
        };

        RequestView.prototype._publishEvent = function(EVENT, $el) {
            PubSub.publish(EVENT, {
                model: this.model,
                element: $el
            });
        };

        RequestView.prototype.keyActions = function() {
            var base = this,
                $el = this.getElement();

            $el.keydown(function(e) {
                if (e.which === 13) {
                    base.finishEdit.call(base);
                }

                if (e.which === 27) {
                    base.cancelEdit.call(base);
                }
            });
        };

    return RequestView;
});
