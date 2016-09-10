/*
* @Author: dontry
* @Date:   2016-06-19 09:40:34
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-19 09:41:35
*/

'use strict';

App.Views.Dialog.RemoveQuiz = App.Views.Abstract.Dialog.extend({
    dialogName: 'remove_quiz',
    events: {

    },
    initialize: function(params){
        this.quiz = params.quiz || false;
        this.show();
    },
    onConfirm: function(){
        var that = this;
    }
})