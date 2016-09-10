App.Views.Dialog.RemoveQuestion = App.Views.Abstract.Dialog.extend({
    dialogName: 'remove_question',
    events: {

    },
    initialize: function(params) {
        this.question = params.question || false;
        this.show();
    },
    onConfirm: function() {
        var that = this;
    },
    doProcess: function() {
        var that = this;
    }
});
