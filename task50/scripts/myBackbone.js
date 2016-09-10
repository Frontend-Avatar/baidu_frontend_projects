/*
 * @Author: dontry
 * @Date:   2016-05-19 17:14:03
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-05-24 16:12:39
 */

'use strict';
// var Backbone = require('backbone');
// var Mustache = require('mustache');

var app = app || {};

/*------------Model---------------*/
app.Quiz = Backbone.Model.extend({
    defaults: {
        id: 'Unknown',
        name: 'Unknown',
        title: 'Unknown',
        time: '1900-1-1',
        status: '未发布', //未发布，已发布
        questions: []
    }
});

app.Question = Backbone.Model.extend({
    defaults: {
        index: -1,
        type: 0, //single: 0, multi: 1
        option_count: -1,
        title: 'Unknown',
        options: [] //option[{name, value, content}]
    }
});

app.Result = Backbone.Model.extend({
    defaults: {
        index: -1,
        type: 0, //single: 0, multi: 1
        option_count: -1,
        options: [] //option[{name, value, content, ratio}]
    }
});

/*-----------Collection-----------*/
app.Quizes = Backbone.Collection.extend({
    model: app.Quiz
});

app.Questions = Backbone.Collection.extend({
    model: app.Question
});

app.Results = Backbone.Collection.extend({
    model: app.Result
});

/*-----------Item View-----------------*/
app.QuizView = Backbone.View.extend({
    tagName: 'tr',
    className: 'item-quiz',
    events: {
        'click .btn.edit': 'edit',
        'click .btn.delete': 'delete',
        'click .btn.check': 'check'
    },
    template: function(model) {
        var template = $('#quiz-template').html();
        Mustache.parse(template);
        return Mustache.render(template, model);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));

        return this;
    },
    close: function() {
        this.stopListening();
    },
    edit: function() {
        console.log('edit');
    },
    delete: function() {
        console.log('deltete');
    },
    check: function() {
        console.log('check');
    }
});

app.QuestionView = Backbone.View.extend({
    tagName: 'div',
    className: 'question',
    template: function(model) {
        if (model.type === Constants.SINGLE) { //single option
            var template = $('#single-question-template').html();
        } else if (model.type === Constants.MULTI) {
            var template = $('#multi-question-template').html();
        }
        Mustache.parse(template);
        return Mustache.render(template, model);
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));

        return this;
    },
    close: function() {
        this.stopListening();
    }
});


/*----------List View------------------------*/
app.QuizListView = Backbone.View.extend({
    el: '#quiz-list',
    initialize: function(initialItems) {
        this.collection = new app.Quizes(initialItems);
        this.render();
    },
    render: function() {
        this.$el.html('');
        this.collection.each(function(item) {
            this.renderItem(item);
        }, this);
    },
    renderItem: function(item) {
        var itemView = new app.QuizView({ model: item });
        this.$el.append(itemView.render().el);
    }
});

app.QuestionListView = Backbone.View.extend({
    el: '#question-list',
    initialize: function(initialItems) {
        this.collection = new app.Questions(initialItems);
        this.render();
    },
    render: function() {
        this.$el.html('');
        this.collection.each(function(item) {
            this.renderItem(item);
        }, this);
    },
    renderItem: function(item) {
        var itemView = new app.QuestionView({ model: item });
        this.$el.append(itemView.render().el);
    }
});

/*－－－－－－－－－－－App View－－－－－－－－－－－－*/
var MainView = Backbone.View.extend({
    el: $('#main'),
})
