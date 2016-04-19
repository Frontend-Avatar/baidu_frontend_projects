/*
* @Author: dontry
* @Date:   2016-04-14 22:38:33
* @Last Modified by:   dontry
* @Last Modified time: 2016-04-15 22:52:44
*/

/**
 * [Mediator Mediator的作用是让不同对象进行消息传递，并保存更新飞船队列数据；该对象把
 * 飞船队列以及指挥官通过闭包封装为私有变量，外界无法直接获取]
 */
require("./variable");

function Mediator() {
    var spaceships = [];
    var commander = null;
    return {
        /**
         * [register: 所有对象需要在Mediator里面注册，否则无法通讯]
         * @param  {[type]} obj [注册对象]
         * @return {[type]}     [注册成功返回true，注册失败返回false]
         */
        register: function(obj) {
            if (obj instanceof Commander) {
                commander = obj;
                obj.mediator = this;
                ConsoleUtil.show("mediator register " + "Commander " + obj.id);
                return true;
            } else if (obj instanceof Spaceship) {
                spaceships[obj.id] = obj;
                obj.mediator = this;
                ConsoleUtil.show("mediator register " + "Spaceship " + obj.id);
                return true;
            }
            ConsoleUtil.show("mediator register failed");
            return false;
        },

        /**
         * [send 发送消息，当发送超过失败率后，对方可以收到数据；有单播和广播两种发送方式]
         * @param  {[type]} msg  [消息]
         * @param  {[type]} from [发送方]
         * @param  {[type]} to   [接收方]
         * @return {[type]}      [发送成功返回true，失败返回false]
         */
        send: function(msg, from, to) {
            var code = MessageAdapter.compile(msg);
            BUS.transmit.apply(this, [code, from, to]);
        },

        /**
         * [remove 移除通讯对象]
         * @param  {[type]} obj [移除对象]
         * @return {[type]}     [description]
         */
        remove: function(obj) {
            if (obj instanceof Spaceship) {
                ConsoleUtil.show("destroy spaceship No." + obj.id);
                delete spaceships[obj.id];
                // spaceships[obj.id] = undefined;
                return true;
            }
            ConsoleUtil.show("mediator remove failed");
            return false;
        },

        /**
         * [create 创建通讯对象]
         * @param  {[type]} msg [信息]
         * @return {[type]}     [创建失败返回false， 成功返回true]
         */
        create: function(msg) {
            if (spaceships[msg.id] !== undefined) {
                ConsoleUtil.show("Spaceship already exists");
                return false;
            }
            var spaceship = new Spaceship(msg.id, msg.spd, msg.chrg);
            this.register(spaceship);
            // DataCenter.addInfo(spaceship);
            return true;
        },

        /**
         * [getSpaceships 获取飞船队列，由于飞船队列spaceships已经封装起来，因此外界只能通过该方法获取飞船队列]
         * @return {[type]} [返回飞船队列]
         */
        getSpaceships: function() {
            return spaceships;
        }
    };
};

module.exports = Mediator;