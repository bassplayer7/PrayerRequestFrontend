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
define([
        "jquery",
        "PubSub",
        "evt",
        "../Model/Request"
    ],
    function($, PubSub, evt, RequestModel) {

        var collection = [],
            //baseUrl = "http://api.js101.net/jessemaxwell1/request/"
            baseUrl = "http://prayer.dev/bassplayer7/request/";

        var loadRequests = function(onComplete) {
            $.ajax(baseUrl + "all", {
                method: "GET",
                dataType: 'json'
            }).done(function(data, status) {
                loadRequestsCompleted(data, status, onComplete);
            }).fail(function(data, status) {
                    PubSub.publish(evt.ERROR, { data: data, status: status });
                }
            );
        };

        var loadRequestsCompleted = function(data, status, onComplete) {
            if (data.hasOwnProperty("prayer_requests")) {
                var serverRequests = data.prayer_requests;
                for (var request in serverRequests) {
                    requestAdd(serverRequests[request]);
                }
            } else {
                PubSub.publish(evt.ERROR_UNKNOWN, status);
            }

            if (onComplete) {
                onComplete(data);
            }
        };

        var requestAdd = function(request) {
            if (typeof request !== RequestModel) {
                request = new RequestModel(request);
            }

            collection.push(request);
            PubSub.publish(evt.REQUEST_ADD, request);

            return request;
        };

        var RequestCollection = function() {
            this.buildInitialList = function() {
                loadRequests();
            };

            PubSub.subscribe(evt.REQUEST_NEW_INIT, this.requestNew.bind(this));
            PubSub.subscribe(evt.REQUEST_DELETE_INIT, this.requestDelete.bind(this));
            PubSub.subscribe(evt.REQUEST_ANSWERED_INIT, this.requestAnswered.bind(this));
            PubSub.subscribe(evt.REQUEST_UPDATE_SAVE, this.requestUpdate.bind(this));
        };

        RequestCollection.prototype.requestNewComplete = function(data, model) {
            PubSub.publish(evt.REQUEST_ADD, model);
            model.Id = data.id;
            collection.push(model);
        };

        RequestCollection.prototype.requestDelete = function(event, request) {
            var base = this;

            $.ajax(baseUrl + "delete/" + request.model.Id, {
                dataType: "json",
                method: "DELETE"
            }).done(function(data, status) {
                console.log(status);
                base.requestDeleteComplete(status, request.model, request.element);
            }).fail(function(data) {
                    PubSub.publish(evt.ERROR, data);
                }
            );
        };

        RequestCollection.prototype.requestDeleteComplete = function(status, model, element) {
            for (var i in collection) {
                if (collection[i] === model) {
                    collection.splice(i, 1);
                }
            }

            PubSub.publish(evt.REQUEST_DELETE_COMPLETE, {
                status: status,
                model: model,
                element: element
            });
        };

        RequestCollection.prototype.requestUpdate = function(event, request) {
            $.ajax(baseUrl + "update/" + request.Id, {
                dataType: "json",
                method: "PUT",
                data: { "prayer_request": request }
                })
                .done(function(data, status) {
                    PubSub.publish(evt.REQUEST_UPDATE_COMPLETE, status);
                })
                .fail(function(data, status) {
                    console.log(status);
                    PubSub.publish(evt.ERROR, {data: data, model: request});
                }
            );
        };

        RequestCollection.prototype.requestAnswered = function(event, request) {
            $.ajax(baseUrl + "update/" + request.model.Id, {
                dataType: "json",
                method: "PUT",
                data: {"prayer_request": {"Answered": true}}
            }).done(function(data, status) {
                PubSub.publish(evt.REQUEST_ANSWERED_COMPLETE, {
                    status: status,
                    element: request.element,
                    model: request.model
                });
            }).fail(function(data, status) {
                    console.log(status);
                    PubSub.publish(evt.ERROR, {data: data, model: request});
                }
            );
        };

        RequestCollection.prototype.requestNew = function(eventName, request) {
            if (typeof eventName === "object") {
                request = eventName;
            }

            var model = new RequestModel(request);

            $.ajax({
                url: baseUrl + "new",
                dataType: 'json',
                method: "PUT",
                data: { "prayer_request": model }
            }).done(function(data, status) {
                console.log(status);
                model.Id = data.id;
                requestAdd(model);
            }).fail(function(data) {
                    PubSub.publish(evt.ERROR, data);
                }
            );
        };

        return RequestCollection;
    }
);