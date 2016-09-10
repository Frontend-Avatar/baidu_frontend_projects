/*
* @Author: dontry
* @Date:   2016-06-19 09:26:55
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-19 09:41:48
*/

'use strict';

App.Views.Dialog.AddQuestion = App.Views.Abstract.Dialog.extend({
    dialogName: 'add_question',
    events: {

    },
    initialize: function(params){
        this.question = params.question || false;
        this.show();
    },
    onConfirm: function(){
        var that = this;
    }
});