/*
 * @Author: dontry
 * @Date:   2016-04-14 22:38:26
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-15 22:51:47
 */
require("./variable");

function Spaceship(id, spd, chrg) {
    'use strict';
    this.id = id;
    this.power = 100; //飞船初始电量
    this.spd = spd;
    this.chrg = chrg;
    this.currState = "stop"; //飞船初始状态
    this.mediator = null; //飞船注册的mediator
    this.orbit = 100 + 50 * id - SPACESHIP_SIZE / 2; //飞船所在轨道的半径
    this.deg = 0; //飞船初始位置的角度
    this.timer = null;
};

module.exports = Spaceship;

/**
 * [dynamicManager 飞船动力系统，控制飞船的飞行以及停止]
 */
Spaceship.prototype.dynamicManager = function() {
    var self = this;
    var fly = function() {
        self.timer = setInterval(function() {
            self.deg += self.spd;
            if (self.deg >= 360) self.deg = 0; //飞完一圈时，重置角度
        }, 20);
        ConsoleUtil.show("Spaceship No." + self.id + " is flying.");
    };

    var stop = function() {
        clearInterval(self.timer);
        ConsoleUtil.show("Spaceship No." + self.id + " has stop.");
    };

    return {
        fly: fly,
        stop: stop
    };
};

//能源系统 控制飞船能源
Spaceship.prototype.powerManager = function() {
    var self = this;
    /**
     * [charge: 飞船充电]
     * @return {[boolean]} [充电返回true]
     */
    var charge = function() {
        var chargeRate = self.chrg;
        var timer = setInterval(function() {
            //若飞船在飞行或者被销毁则不再充电
            if (self.currState == FLY || self.currState == DESTROY) {
                clearInterval(timer);
                return false;
            }
            if (self.power >= 100) { //如果飞船满电则不再充电
                clearInterval(timer);
                self.power = 100;
                return false;
            }
            self.power += chargeRate;
            self.signalManager().send(DataCenter);
            return true;
        }, 20);
        ConsoleUtil.show("Spaceship No." + self.id + " is charging.");
    };

    /**
     * [discharge: 飞船放电]
     * @return {[boolean]} [放电返回true]
     */
    var discharge = function() {
        var dischargeRate = DEFAULT_DISCHARGE_RATE;
        var timer = setInterval(function() {
            //若飞船停止或者被销毁则不再放电
            if (self.currState == "stop" || self.currState == DESTROY) {
                clearInterval(timer);
                return false;
            }
            if (self.power <= 0) {
                clearInterval(timer);
                self.power = 0;
                self.stateManager().changeState("stop");
                return false;
            }
            self.power -= dischargeRate;
            self.signalManager().send(DataCenter);
        }, 20);
        ConsoleUtil.show("Spaceship No." + self.id + " is discharging.");
    };

    return {
        charge: charge,
        discharge: discharge
    };
};

//stateManager  状态系统采用状态模式设计
Spaceship.prototype.stateManager = function() {
    var self = this;
    //istantiate several states of the spaceship
    var states = {
        fly: function(state) {
            self.currState = FLY;
            self.dynamicManager().fly();
            self.powerManager().discharge();
        },
        stop: function(state) {
            self.currState = "stop";
            self.dynamicManager().stop();
            self.powerManager().charge();
        },
        destroy: function(state) {
            self.currState = DESTROY;
            self.mediator.remove(self);
            // AnimUtil.onDraw(self.mediator.getSpaceships());
        }
    };

    /**
     * [changeState 执行指令改变飞船状态]
     * @param  {[type]} state [spaceship state: fly, stop, destroy]
     * @return {[type]}       [description]
     */
    var changeState = function(state) {
        //根据状态执行指令
        states[state] && states[state]();
        ConsoleUtil.show("Spaceship No." + self.id + " state is " + state);
    };

    return {
        changeState: changeState
    };
};

//信号系统 飞船接收指令模块
Spaceship.prototype.signalManager = function() {
    var self = this;
    return {
        receive: function(code, from) {
            var msg = MessageAdapter.decompile(code);
            if (self.currState != msg.cmd && self.id == msg.id) {
                self.stateManager().changeState(msg.cmd);
                self.signalManager().send(DataCenter);
            }
        },
        send: function(to) {
            var msg = new Message(self.id, self.currState, self.spd, self.chrg, self.power);
            code = MessageAdapter.compile(msg);
            to.receive(code, self);
        }
    };
};
