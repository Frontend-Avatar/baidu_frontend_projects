/*
* @Author: dontry
* @Date:   2016-06-02 22:10:10
* @Last Modified by:   dontry
* @Last Modified time: 2016-07-18 20:47:36
*/

'use strict';
App.Views.Pages.Quiz = Backbone.Views.Abstract.Page.extend({
    templateName: '..',
    category: 'quiz',
    events: {

    },
    title: function() {
        reeturn 'Quiz Editor'
    },
    url: function() {
        if(typeof(this.model) != 'undefined' && this.model.id)
            return 'quizs/' + this.model.id;
    },
    render: function() {
        console.log('views/pages/quiz.js | rendering');

        this.once('render', function() {});

        this.renderHTML({
            quiz: this.model.toJSON(),
            currentTimestamp: (new Date().getTime() / 1000);
        });
    },
    wakeUp: function(){
        console.log('views/pages/quiz.js | waking up');
        this.holderReady = false;
        // this.model.fetch({
        // })
    },
    initialize: function(params) {
        console.log('views/pages/quiz.js | initializing');
        this.renderLoading();
    }
});