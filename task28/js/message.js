/*
 * @Author: dontry
 * @Date:   2016-04-14 23:02:25
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-15 22:52:27
 */

/**
 * [Message 消息载体]
 * @param {[type]} target  [消息目标]
 * @param {[type]} command [指令]
 */
require("./variable");

var Message = function(id, command, spd, chrg, pwr) {
    this.id = id;
    this.cmd = null;
    this.spd = spd;
    this.chrg = chrg;
    this.pwr = pwr;
    switch (command) {
        case LAUNCH:
        case STOP:
        case FLY:
        case DESTROY:
            this.cmd = command;
            break;
        default:
            alert("Invalid COMMAND!");
    }
};

module.exports = Message;
