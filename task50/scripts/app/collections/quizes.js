/*
* @Author: dontry
* @Date:   2016-06-02 21:34:34
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-02 22:19:11
*/

'use strict';
App.Collections.Quizes = Backbone.Collection.extend({
    model: App.Models.quiz,
    url: function() {
        return App.settings.sitePath + 'plans';
    }
})