/*
* @Author: dontry
* @Date:   2016-06-02 21:43:44
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-02 21:50:12
*/

'use strict';
App.Models.result = App.Model.extend({
    defaults: {
        name: null
    },
    url: function() {
        return App.settings.sitePath + 'result/' + (typeof(this.id) === 'undefined' ? '' : this.id);
    }
})