/*
 * @Author: dontry
 * @Date:   2016-04-14 23:04:58
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-15 22:54:06
 */

require("./variable");

//BUS传输介质
var BUS = {
    transmit: function(code, from, to) {
        var self = this;
        var spaceships = this.getSpaceships();
        var timer = null;
        timer = setInterval(function() {
            var success = Math.random() > BUS_FAILURE_RATE ? true : false; //若随机数大于发送失败率则执行消息发送
            if (success) {
                clearInterval(timer);
                var msg = MessageAdapter.decompile(code);
                if (to) { //unicast
                    to.receive(code, from);
                } else { //broadcast;
                    if (msg.cmd === LAUNCH) { //若收到的指令是Launch则执行创建对象
                        self.create(msg);
                    }
                    for (var key in spaceships) {
                        if (spaceships[key] !== from) { //所有飞船迭代接收消息
                            spaceships[key].signalManager().receive(code, from);
                        }
                    }

                }
                ConsoleUtil.show("TRANSMISSION DONE");
                return true;
            } else {
                ConsoleUtil.show("TRANSMISSION FAILURE");
                return false;
            }
        }, BUS_TRANSMIT_SPEED);
    }
};

module.exports = BUS;
