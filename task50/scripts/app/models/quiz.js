/*
* @Author: dontry
* @Date:   2016-06-02 21:36:42
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-02 21:46:14
*/

'use strict';
App.Models.quiz = Backbone.Model.extend({
    url: function() {
        return App.settings.sitePath + 'quiz/' + (typeof(this.id) === 'undefined' ? '' : this.id);
    },
    getQuestions: function() {
        var deffered = jQuery.Deffered();
    },
    edit: function() {
    }
});