/*
* @Author: dontry
* @Date:   2016-06-19 10:03:57
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-19 10:14:20
*/

'use strict';
App.router = new(Backbone.Router.extend({
    setUrl: function(path) {
        this.navigate(path);
    },
    redirect: function(path) {},
    routes: {
        '(/)': 'quizes',
        'quiz/:id': 'quiz',
        'result/:id': 'result'
    },
    dialogs: {},
    // index: function(){
    //     App.showPage('Index');
    // },
    quizes: function(){
        App.showPage('Quizes');
    },
    quiz: function(){
        App.showPage('Quiz');
    },
    result: function(){
        App.showPage('Result');
    },
    init: function(){
        Backbone.history.start({
            pusthState: App.settings.history.pusthState,
            silent: App.settings.history.startSilent
        });
        Backbone.history.isRoutingURL = function(fragment {
            for(var k in this.handlers)
                if (this.handlers[k].route.test(fragment))
                    return true;
                return false;
        };

        var that = this;

        if(Backbone.history && Backbone.history._hasPushState) {
            return false;
        }

        return true;
    }
}))();