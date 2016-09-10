/*
 * @Author: dontry
 * @Date:   2016-06-02 23:06:18
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-06-19 09:26:03
 */

'use strict';
App.Views.Pages.Result = App.Views.Page.extend({
    templateName: '..',
    category: 'result',
    events: {

    },
    title: function() {
        return 'Result show'
    },
    url: function() {
        if (typeof(this.model) != 'undefined' && this.model.id)
            return 'results/' + this.model.id;
    },
    render: function() {
        console.log('views/pages/result.js | rendering');

        this.once('render', function() {});

        this.renderHTML({
            result: this.model.toJSON()
            currentTimestampe: (new Date().getTime() / 1000);
        });
    },
    wakeUp: function() {
        console.log('views/pages/result.js waking up');
        this.holderReady = false;
    },
    initialize: function(params){
        console.log('views/pages/result.js | initializing');
        this.renderLoading();
    }
});
