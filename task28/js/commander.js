/*
 * @Author: dontry
 * @Date:   2016-04-14 22:58:51
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-14 22:59:43
 */
/**
 * [Commander 指挥官，负责单向指令发送，不接收外界消息]
 */
function Commander() {
    this.id = "Don";
    this.cmds = [];
    this.mediator = null;
};

module.exports = Commander;

/**
 * [send 发送指令，并将指令压入指令历史cmds中]
 * @param  {[type]} msg [消息]
 * @return {[type]}     [description]
 */
Commander.prototype.send = function(msg) {
    this.mediator.send(msg);
    this.cmds.push(msg);
};
