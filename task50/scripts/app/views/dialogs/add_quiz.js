/*
* @Author: dontry
* @Date:   2016-06-19 09:30:14
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-19 09:35:48
*/

'use strict';


App.Views.Dialog.AddQuiz = App.Views.Abstract.Dialog.extend({
    dialogName: 'add_quiz',
    events: {

    },
    initialize: function(params){
        this.quiz = params.quiz || false;
        this.show();
    },
    onConfirm: function(){
        var that = this;
    }
});