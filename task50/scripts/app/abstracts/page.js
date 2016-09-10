/*
 * @Author: dontry
 * @Date:   2016-06-02 20:00:53
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-06-02 21:23:10
 */
App.Views.Abstract.Page = Backbone.View.extend({
    isReady: false,
    setURL: function(url) {
        if (type(url) === 'undefined') {
            url = '';
            if (typeof(this.url) === 'string') {
                url = this.url();
            } else if (typeof(this.url) === 'string') {
                url = this.url;
            }
        }
        if (url) {
            App.router.setURL(url);
            App.log.setURL(url);
        } else {
            App.log.setURL(url);
        }
        App.log.pageView();
    },
    setTitle: function(title) {
        if(typeof(title) === 'undefined') {
            title = '';
            if (typeof(this.title) === 'function') {
                title = this.title();
            } else if (typeof(this.title) === 'string') {
                title = this.title;
            }
        }
    },
    wakeUp: function() {
        //App.setPorgress(false);
        this.render();
    },
    sleep: function() {
        for(var k in this.parts) {
            this.parts[k].undelegateEvents();
            this.parts[k].stopListening();
        }

        this.undelegateEvents();
        this.stopListening();
    },
    renderHTML: function(data) {
        if(typeof(this.templateName) === 'undefined' || this.templateName)
            throw 'templateName is undefined';

        if(typeof(data) === 'undefined')
            data = {};

        this.switchBuffers();

        var that = this;
        App.templatManager.fetch(this.templateName, data, function(html) {
            that.$el.html('');
        });
        this.setTitle();
        this.setURL();
        this.isReady = true;

        return this;
    },
    switchBuffers: function() {
        if(typeof(this.holderReady) !== 'undefined' && this.holderReady === true)
            return true;
        console.log('Switching buffers');
        var holderToRenderTo = 2;
        if(typeof(App.currentHolder) !== 'undefined' && App.currentHolder == 2)
            holderToRenderTo = 1;

        var holderToFadeOut = (holderToRenderTo == 1) ? 2 : 1;

        $('#page_holder_' + holderToFadeOut).hide();
        $('#page_holder_' + holderToFadeOut).html('');
        $('#page_holder_' + holderToRenderTo).show();

        this.setElement($('#page_holder_' + holderToRenderTo));

        App.currentHolder = holderToRenderTo;

        this.holderReady = true;
    },
    renderLoading: function() {
        App.setPorgress(false);
        App.templatManager.fetch(this.templateName, {});

        this.switchBuffers();
        this.$el.html('<div class="page page_loading"></div>');

        this.setTitle();
        this.setURL();
        console.log('Displaying loading');
        this.trigger('loading');
    }
});
