/*
 * @Author: dontry
 * @Date:   2016-04-07 09:55:36
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-10 21:40:33
 */

/**
 * 该设计将飞船划分为动力系统，状态系统，能源系统 以及信号系统，四个模块。  
 * 通过Mediator与指挥官发出测消息指令进行接收和执行
 * 
 */



(function() {
        var DEFAULT_SPACESHIP_SPEED = 2; //飞船飞行速度
        var SPACESHIP_SIZE = 40; //飞船大小
        var SPACESHIP_COUNT = 4; //飞船数量
        var DEFAULT_CHARGE_RATE = 0.3; //飞船充电速度
        var DEFAULT_DISCHARGE_RATE = 0.2; //飞船放电速度

        var LAUNCH = "launch";
        var FLY = "fly";
        var STOP = "stop";
        var DESTROY = "destroy";
        var SLOW = "slow";
        var MEDIUM = "medium";
        var FAST = "fast";

        var SPACESHIP_SPEED_SLOW = 0.5; //慢速飞行
        var SPACESHIP_SPEED_MEDIUM = 2; //中速飞行
        var SPACESHIP_SPEED_FAST = 8; //快速飞行

        var CHARGE_RATE_SLOW = 0.05; //慢速充电
        var CHARGE_RATE_MEDIUM = 0.3; //中速充电
        var CHARGE_RATE_FAST = 1; //快速充电

        var SPEED_CODE_NULL = "00";
        var SPEED_CODE_SLOW = "01";
        var SPEED_CODE_MEDIUM = "10";
        var SPEED_CODE_FAST = "11";

        var CHARGE_CODE_NULL = "00";
        var CHARGE_CODE_SLOW = "01";
        var CHARGE_CODE_MEDIUM = "10";
        var CHARGE_CODE_FAST = "11";


        var POWERBAR_POS_OFFSET = 5; //电量条位置位移
        var POWERBAR_COLOR_GOOD = "#70ed3f"; //电量良好状态颜色
        var POWERBAR_COLOR_MEDIUM = "#fccd1f"; //电量一般状态颜色
        var POWERBAR_COLOR_BAD = "#fb0000"; //电量差状态颜色
        var POWERBAR_WIDTH = 5; //电量条宽度

        var SCREEN_WIDTH = 800; //屏幕宽度
        var SCREEN_HEIGHT = 800; //屏幕高度
        var SCREEN_CENTER_X = SCREEN_WIDTH / 2; //屏幕X轴中心坐标
        var SCREEN_CENTER_Y = SCREEN_HEIGHT / 2; //屏幕Y轴中心坐标

        var PLANET_RADIUS = 50; //行星半径
        var ORBIT_COUNT = 4; //轨道数量
        var FAILURE_RATE = 0.3; //消息发送失败率
        var BUS_FAILURE_RATE = 0.1; //BUS消息发送失败率
        var BUS_TRANSMIT_SPEED = 300; //BUS消息发送速度

        var LAUNCH_CODE = "00";
        var FLY_CODE = "01";
        var STOP_CODE = "10";
        var DESTROY_CODE = "11";

        //根据浏览器类型设置相应的requestAnimationFrame
        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        /**
         * [Spaceship 飞船]
         * @param {[type]} id [飞船id]
         */
        var Spaceship = function(id, spd, chrg) {
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


        /**
         * [Commander 指挥官，负责单向指令发送，不接收外界消息]
         */
        var Commander = function() {
            this.id = "Don";
            this.cmds = [];
            this.mediator = null;
        };

        /**
         * [send 发送指令，并将指令压入指令历史cmds中]
         * @param  {[type]} msg [消息]
         * @return {[type]}     [description]
         */
        Commander.prototype.send = function(msg) {
            this.mediator.send(msg);
            this.cmds.push(msg);
        };


        /**
         * [Mediator Mediator的作用是让不同对象进行消息传递，并保存更新飞船队列数据；该对象把
         * 飞船队列以及指挥官通过闭包封装为私有变量，外界无法直接获取]
         */
        var Mediator = function() {
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

        /**
         * [Message 消息载体]
         * @param {[type]} target  [消息目标]
         * @param {[type]} command [指令]
         */
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

        /**
         * [MessageAdapter 消息适配器]
         * @type {Object}
         */
        var MessageAdapter = {
            compile: function(msg) {
                var idCode = msg.id.toString(2).length < 2 ? "0" + msg.id.toString(2) : msg.id.toString(2);
                var cmdCode = null;
                var spdCode = null;
                var chrgCode = null;
                var pwrCode = null;
                var code = null;
                switch (msg.cmd) {
                    case LAUNCH:
                        cmdCode = LAUNCH_CODE;
                        break;
                    case FLY:
                        cmdCode = FLY_CODE;
                        break;
                    case STOP:
                        cmdCode = STOP_CODE;
                        break;
                    case DESTROY:
                        cmdCode = DESTROY_CODE;
                        break;
                    default:
                        ConsoleUtil.show("Invalid CMD Message");
                }

                switch (msg.spd) {
                    case undefined:
                    case null:
                        spdCode = SPEED_CODE_NULL;
                        break;
                    case SLOW:
                    case SPACESHIP_SPEED_SLOW:
                        spdCode = SPEED_CODE_SLOW;
                        break;
                    case MEDIUM:
                    case SPACESHIP_SPEED_MEDIUM:
                        spdCode = SPEED_CODE_MEDIUM;
                        break;
                    case FAST:
                    case SPACESHIP_SPEED_FAST:
                        spdCode = SPEED_CODE_FAST;
                        break;
                    default:
                        ConsoleUtil.show("Invalid SPD Message");
                }

                switch (msg.chrg) {
                    case undefined:
                    case null:
                        chrgCode = CHARGE_CODE_NULL;
                        break;
                    case SLOW:
                    case CHARGE_RATE_SLOW:
                        chrgCode = CHARGE_CODE_SLOW;
                        break;
                    case MEDIUM:
                    case CHARGE_RATE_MEDIUM:
                        chrgCode = CHARGE_CODE_MEDIUM;
                        break;
                    case FAST:
                    case CHARGE_RATE_FAST:
                        chrgCode = CHARGE_CODE_FAST;
                        break;
                    default:
                        ConsoleUtil.show("Invalid CHRG Message");
                }


                pwrCode = msg.pwr ? msg.pwr.toString(2) : "11111111"
                code = idCode + cmdCode + spdCode + chrgCode + pwrCode;
                // ConsoleUtil.show("SENDING CODE:" + code);
                return code;
            },

            decompile: function(code) {
                var idCode = code.substring(0, 2);
                var cmdCode = code.substring(2, 4);
                var spdCode = code.substring(4, 6);
                var chrgCode = code.substring(6, 8);
                var pwrCode = code.substring(8, 16);
                var id = parseInt(idCode, 2);
                var cmd = null;
                var spd = null;
                var chrg = null;
                var pwr = null;
                switch (cmdCode) {
                    case LAUNCH_CODE:
                        cmd = LAUNCH;
                        break;
                    case FLY_CODE:
                        cmd = FLY;
                        break;
                    case STOP_CODE:
                        cmd = STOP;
                        break;
                    case DESTROY_CODE:
                        cmd = DESTROY;
                        break;
                    default:
                        ConsoleUtil.show("Invalid CMD Code");
                }


                switch (spdCode) {
                    case SPEED_CODE_NULL:
                        spd = null;
                        break;
                    case SPEED_CODE_SLOW:
                        spd = SPACESHIP_SPEED_SLOW;
                        break;
                    case SPEED_CODE_MEDIUM:
                        spd = SPACESHIP_SPEED_MEDIUM;
                        break;
                    case SPEED_CODE_FAST:
                        spd = SPACESHIP_SPEED_FAST;
                        break;
                    default:
                        ConsoleUtil.show("Invalid SPD Code");
                }

                switch (chrgCode) {
                    case CHARGE_CODE_NULL:
                        chrg = null;
                        break;
                    case CHARGE_CODE_SLOW:
                        chrg = CHARGE_RATE_SLOW;
                        break;
                    case CHARGE_CODE_MEDIUM:
                        chrg = CHARGE_RATE_MEDIUM;
                        break;
                    case CHARGE_CODE_FAST:
                        chrg = CHARGE_RATE_FAST;
                        break;
                    default:
                        ConsoleUtil.show("Invalid CHRG Code");
                }

                pwr = pwrCode == "11111111" ? null : parseInt(pwrCode, 2);
                return new Message(id, cmd, spd, chrg, pwr);
            },

            interpret: function(msg) {
                var spd_type = null;
                var chrg_type = null;
                var info = { spd_type, chrg_type }
                switch (msg.spd) {
                    case SPACESHIP_SPEED_SLOW:
                        info.spd_type = SLOW;
                        break;
                    case SPACESHIP_SPEED_MEDIUM:
                        info.spd_type = MEDIUM;
                        break;
                    case SPACESHIP_SPEED_FAST:
                        info.spd_type = FAST;
                        break;
                    default:
                        ConsoleUtil.show("Invalid SPD MESSAGE");
                }
                switch (msg.chrg) {
                    case CHARGE_RATE_SLOW:
                        info.chrg_type = SLOW;
                        break;
                    case CHARGE_RATE_MEDIUM:
                        info.chrg_type = MEDIUM;
                        break;
                    case CHARGE_RATE_FAST:
                        info.chrg_type = FAST;
                        break;
                    default:
                        ConsoleUtil.show("Invalid CHRG MESSAGE");
                }
                return info;
            }
        };

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

        //Data Center数据中心
        var DataCenter = (function() {
                var $tbody = $("#monitor table>tbody");

                var addInfo = function(msg) {
                    var info =  MessageAdapter.interpret(msg);
                    $tr = $("<tr></tr>");
                    $tr.addClass("item-sp");
                    $tr.attr("id", "sp"+msg.id);
                    $tr.append("<td>" + msg.id + "</td>");
                    $tr.append("<td>" + info.spd_type + "</td>");
                    $tr.append("<td>" + info.chrg_type + "</td>");
                    $tr.append("<td>" + msg.cmd + "</td>");
                    $tr.append("<td>" + msg.pwr + "</td>");

                    $tbody.append($tr);
                };

                var removeInfo = function(msg) {
                    var id = msg.id;

                    var $tr = $("#sp"+id);
                    $tr.remove();
                };

                var updateInfo = function(msg) {
                    var $tds = $("#sp"+msg.id).children("td");
                    $tds.eq(3).text(msg.cmd);
                    $tds.eq(4).text(parseInt(msg.pwr));
                };

                var receive = function(code) {
                    var msg = MessageAdapter.decompile(code);
                    switch (msg.cmd) {
                        case "stop":
                            if ($("#sp"+msg.id).length == 0) {
                                addInfo(msg);
                                break;
                            }
                    case "fly":
                        updateInfo(msg);
                        break;
                    case "destroy":
                        removeInfo(msg);
                        break;
                    default:
                        ConsoleUtil.show("Invalid Data");
                }
            }

            return {
                receive: receive
            }
        })();



    /**
     * [动画工具 该动画采用双缓存刷新以及requestAnimationFrame致力消除动画闪屏现象]
     */
    var AnimUtil = (function() {
        var canvas = document.getElementById("screen");
        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        var ctx = canvas.getContext("2d"); //获取屏幕画布

        var cacheCanvas = document.createElement("canvas");
        cacheCanvas.width = SCREEN_WIDTH;
        cacheCanvas.height = SCREEN_HEIGHT;
        var cacheCtx = cacheCanvas.getContext("2d"); //生成缓存画布

        var timer = null; //定时器
        var mediator = null; //控制动画刷新的mediator

        /**
         * [drawPlanet 画行星]
         * @param  {[type]} _ctx [目标画布]
         * @return {[type]}      [description]
         */
        var drawPlanet = function(_ctx) {
            // ctx.fillStyle = "#1b93ef";
            var x = SCREEN_CENTER_X - PLANET_RADIUS;
            var y = SCREEN_CENTER_Y - PLANET_RADIUS;
            var planet = new Image();
            planet.src = "min-iconfont-planet.png";
            planet.onload = function() {
                _ctx.drawImage(planet, x, y, PLANET_RADIUS * 2, PLANET_RADIUS * 2);
            };
        };

        /**
         * [drawOrbit 画飞船轨道]
         * @param  {[type]} _ctx [目标画布]
         * @return {[type]}      [description]
         */
        var drawOrbit = function(_ctx) {
            for (var i = 0; i < ORBIT_COUNT; i++) {
                _ctx.strokeStyle = "#999";
                _ctx.beginPath();
                _ctx.arc(SCREEN_CENTER_X, SCREEN_CENTER_Y, 100 + 50 * i, 0, 2 * Math.PI);
                _ctx.closePath();
                _ctx.stroke();
            }
        };

        /**
         * [动画更新时背景不用刷新，因此仅仅在初始化时绘制一次在background画布上的背景，减少计算量。background画布位于screen画布下面，通过css中z-index属性进行叠加]
         * @return {[type]} [description]
         */
        (function() {
            var canvas = document.getElementById("background");
            canvas.width = SCREEN_WIDTH;
            canvas.height = SCREEN_HEIGHT;
            var _ctx = canvas.getContext("2d");
            _ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            drawPlanet(_ctx);
            drawOrbit(_ctx);
        })();

        /**
         * [drawSpaceship 画飞船]
         * @param  {[type]} _ctx      [目标画布,这里的画布是缓存画布]
         * @param  {[type]} spaceship [飞船]
         * @return {[type]}           [绘画成功返回true，失败返回false]
         */
        var drawSpaceship = function(_ctx, spaceship) {
            var spaceshipImg = new Image(); //创建飞船贴图
            spaceshipImg.src = "min-iconfont-rocket-active.png";
            spaceshipImg.onload = function() { //当飞船贴图加载后开始在画布上画(由于onload是异步进行的，所以执行顺序上会不是太清晰)
                try { //由于存在获取不了画布的情况产生错误，因此采用try..catch将错误丢弃
                    _ctx.save(); //保存画布原有状态
                    _ctx.translate(SCREEN_CENTER_X, SCREEN_CENTER_Y); //更改画布坐标系，将画布坐标原点移到画布中心
                    _ctx.rotate(-spaceship.deg * Math.PI / 180); //根据飞船飞行角度进行画布选择

                    //画电量条，根据电量状态改变颜色
                    _ctx.beginPath();
                    if (spaceship.power > 60) {
                        _ctx.strokeStyle = POWERBAR_COLOR_GOOD;
                    } else if (spaceship.power <= 60 && spaceship.power >= 20) {
                        _ctx.strokeStyle = POWERBAR_COLOR_MEDIUM;
                    } else {
                        _ctx.strokeStyle = POWERBAR_COLOR_BAD;
                    }
                    _ctx.lineWidth = POWERBAR_WIDTH;
                    _ctx.moveTo(spaceship.orbit, -POWERBAR_POS_OFFSET);
                    _ctx.lineTo(spaceship.orbit + SPACESHIP_SIZE * (spaceship.power / 100), -POWERBAR_POS_OFFSET);
                    _ctx.stroke();

                    _ctx.drawImage(spaceshipImg, spaceship.orbit, 0, SPACESHIP_SIZE, SPACESHIP_SIZE); //画飞船贴图
                    _ctx.restore(); //恢复画布到原有状态
                    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                    ctx.drawImage(cacheCanvas, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); //将缓存画布内容复制到屏幕画布上
                    return true;
                } catch (error) {
                    return false;
                }
            };
        };

        /**
         * [onDraw 绘制屏幕画布]
         * @param  {[type]} spaceships [飞船队列]
         * @return {[type]}            [description]
         */
        var onDraw = function(spaceships) {
            if (!(spaceships === undefined || spaceships.every(function(item, index, array) {
                    return item === undefined; //判断飞船队列是否存在，以及飞船队列是否为空；若不是则执行下面步骤
                }))) {
                cacheCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); //每次更新清空缓存画布
                for (var i = 0; i < spaceships.length; i++) { //迭代绘制飞船
                    if (spaceships[i] !== undefined) {
                        drawSpaceship(cacheCtx, spaceships[i]);
                    }
                }
            } else {
                ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            }
        };

        /**
         * [animLoop 动画循环]
         * @return {[type]} [description]
         */
        var animLoop = function() {
            requestAnimationFrame(animLoop);
            onDraw(mediator.getSpaceships());
        };

        /**
         * [setMediator  为AnimUtil设置Mediator，通过mediator保存的状态控制动画更新]
         * @param {[type]} _mediator [description]
         */
        var setMediator = function(_mediator) {
            mediator = _mediator;
        };

        return {
            setMediator: setMediator,
            animLoop: animLoop
        };
    })();

    /**
     * [控制台工具 负责显示运行信息]
     */
    var ConsoleUtil = (function() {
        var $consoleLog = $("#console ul");
        var show = function(msg) {
            var $msg = $("<li></li>");
            $msg.text(msg);
            $consoleLog.prepend($msg);
        };

        return {
            show: show
        };
    })();

    /**
     * [butttonHandler 按钮句柄]
     * @param  {[type]} commander [点击按钮后，指挥官commander进行相应操作]
     * @return {[type]}           [指令正确返回true，指令错误返回false]
     */
    var butttonHandler = function(commander) {
        var id = null;
        var cmd = null;
        $(".wrapper .btn").on("click", function() {
            var cmdName = $(this).attr("name");
            id = $(this).parent().index();
            cmd = cmdName;
            switch (cmdName) {
                case LAUNCH:
                    $(".panel-option").show();
                    $(".mask").show();
                    spaceshipSelection(id, cmd)
                    return true;
                case FLY:
                case STOP:
                case DESTROY:
                    var message = new Message(id, cmd);
                    commander.send(message);
                    break;
                default:
                    alert("INVALID COMMAND!");
                    return false;
            }
            return true;
        });

        var spaceshipSelection = function(id, cmd) {
            $("#confirm").on("click", function() {
                var spd = $("input[type='radio'][name='speed']:checked").val();
                var chrg = $("input[type='radio'][name='power']:checked").val();
                $(".panel-option").hide();
                $(".mask").hide();
                var message = new Message(id, cmd, spd, chrg);
                commander.send(message);
                $("#confirm").off();
                $("#cancel").off();
            });

            $("#cancel").on("click", function() {
                $(".panel-option").hide();
                $(".mask").hide();
                $("#confirm").off();
                $("#cancel").off();
            });
        };
    };

    //主线程
    window.onload = function() {
        var commander = new Commander();
        var mediator = new Mediator();
        mediator.register(commander);
        butttonHandler(commander);
        AnimUtil.setMediator(mediator);
        AnimUtil.animLoop();
    };

})();
