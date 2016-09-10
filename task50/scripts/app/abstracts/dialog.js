/*
* @Author: dontry
* @Date:   2016-06-02 20:00:53
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-02 20:04:47
*/
App.Views.Abstract.Dialog = Backbone.View.extend({
    el: $('#dialog_wrapper'),
    isVisible: false,
    initialFocus: function() {

    } ,
    show: function(data){

    },
    renderLoading: function() {
        console.log('Dialog ' + this.dialogName + 'rendered loading');
    },
    renderHTML: function(data) {
        console.log('Dialog ' + that.dialogName + 'rendering');
    },
    hide: function(){
        console.log('Hide dialog');
        this.$el.children().modal('hide');
    }
})