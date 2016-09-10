/*
* @Author: dontry
* @Date:   2016-06-02 21:54:16
* @Last Modified by:   dontry
* @Last Modified time: 2016-06-02 22:19:06
*/

'use strict';
App.Collections.Questions = App.Collection.extend({
    model: App.Model.question,
    quiz_id: null,
    setQuizId: function() {

    }
});
