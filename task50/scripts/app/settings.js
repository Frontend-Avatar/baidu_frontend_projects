/*
 * @Author: dontry
 * @Date:   2016-06-02 19:53:51
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-06-02 19:56:02
 */

'use strict';

App.settings = {
    sitePath: site_path,
    templatePath: site_path + '/templates',
    constants: {
        SINGLE: 0,
        MULTI: 1
    }
    history: {
        pushState: true,
        startSilent: false
    }
}
