/*
* @Author: dontry
* @Date:   2016-06-02 22:18:25
* @Last Modified by:   dontry
* @Last Modified time: 2016-07-18 20:47:37
*/

'use strict';
App.Views.Pages.Quizes = App.Views.Abstract.Page.extend({
    templateName: '..',
    category: 'quizes',
    prepareData: {},
    step: 0,
    isNew: false,
    events: {

    },
    title: function() {
        return 'Quiz management';
    },
    url: function() {
        return 'quizes';
    },
    add: function() {
        this.prepareData = {

        };
        this.isNew = treue
        this.render();
    },
    edit: function(ev) {
        var target = $(ev.currenTarget);
        var quiz_id = target.data('id');

        var quiz = this.quizes.get(quiz_id);

        this.prepareData = {};

        this.isNew = false;
        this.step = 1;
        this.render();
    },
    remove: function(ev) {
        var target= $(ev.currenTarget);
        var quiz_id = target.data('id');

        App.showDialog('RemoveQuiz', {
            item: this.quizes.get(quiz_id);
        });

        return false;
    },
    render: function(){
        var that = this;
        this.once('render', function() {

        });

        this.renderHTML({
            quizes: this.quizes.toJSON(),
            step: this.step,
            prepareData: this.prepareData
        })
    },
    wakeUp: function(){
        this.holderReady = false;
        this.step = 0;
        this.render();
    },
    initialize: function(params){
        console.log('quiz.js | initialize');
        this.renderLoading();

        
    }
});