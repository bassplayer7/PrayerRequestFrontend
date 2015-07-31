require.config({
    paths: {
        jquery: "https://code.jquery.com/jquery-2.1.4.min",
        PubSub: "./util/pubsub-1.5.2",
        evt: "./util/event",
        HandleBars: "./util/handlebars-v3.0.3",
        BootstrapTab: "../../global/assets/javascripts/bootstrap/tab"
    },
    shim: {
        'hanlebars': {
            exports: 'HandleBars'
        }
    }
});

requirejs(['jquery', 'Model/Request', 'views/Request', 'views/Application', 'Controller/Application'],
    function($, RequestModel, RequestView, ApplicationView, Application) {

        "use strict";

        var application = new Application($('#unanswered-container'), $('#answered-container'));

        application.showList();

        console.log(application);
});