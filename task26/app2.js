/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app2.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caidong <caidong@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2016/04/07 22:07:33 by caidong           #+#    #+#             */
/*   Updated: 2016/04/08 01:05:34 by caidong          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

(function() {
    var DEFAULT_CHARGE_RATE = 0.3;
    var DEFAULT_DISCHARGE_RATE = 0.2;
    var SCREEN_WIDTH = 800;
    var SCREEN_HEIGHT = 800;
    var SCREEN_CENTER_X = SCREEN_WIDTH / 2;
    var SCREEN_CENTER_Y = SCREEN_HEIGHT / 2;
    var PLANET_RADIUS = 50;
    var SPACESHIP_SIZE = 40;
    var SPACESHIP_COUNT = 4;
    var ORBIT_COUNT = 4;
    var FAILURE_RATE = 0.3;
    var POWERBAR_POS_OFFSET = 5;
    var POWERBAR_COLOR_GOOD = "#70ed3f";
    var POWERBAR_COLOR_MEDIUM = "#fccd1f";
    var POWERBAR_COLOR_BAD = "#fb0000";
    var POWERBAR_WIDTH = 5;
    var SPACESHIP_SPEED = 2;

    var $consoleLog = $("#console ul");


    var Spaceship = function(id) {
        this.id = id;
        this.power = 100;
        this.currState = "stop";
        this.mediator = null;
        this.orbit = 100 + 50 * id - SPACESHIP_SIZE / 2;
        this.deg = 0;
        this.timer = null;
        // this.pos = {
        //     x: SCREEN_CENTER_X - SPACESHIP_SIZE / 2 - (100 + 50 * parseInt(id)),
        //     y: SCREEN_CENTER_Y - SPACESHIP_SIZE / 2
        // };
        // this.timer = null;
    };

    //动力系统
    Spaceship.prototype.dynamicManager = function() {
        var self = this;
        var fly = function() {
            self.timer = setInterval(function() {
                self.deg += SPACESHIP_SPEED;
                if (self.deg >= 360) self.deg = 0;
            }, 20);
            // AnimUtil.onDraw(self.mediator.getSpaceships());
            ConsoleUtil.show("Spaceship No." + self.id + " is flying.");
        };

        var stop = function() {
            clearInterval(self.timer);
            // AnimUtil.onDraw(self.mediator.getSpaceships());
            ConsoleUtil.show("Spaceship No." + self.id + " has stop.");
        };

        return {
            fly: fly,
            stop: stop
        };
    };

    //能源系统
    Spaceship.prototype.powerManager = function() {
        var self = this;
        /**
         * [charge: charge power when stop]
         * @return {[type]} [description]
         */
        var charge = function() {
            var chargeRate = DEFAULT_CHARGE_RATE;
            var timer = setInterval(function() {
                //if the spaceship is flying or has been destroyed, then stop charging.
                if (self.currState == "fly" || self.currState == "destroy") {
                    clearInterval(timer);
                    return false;
                }
                if (self.power >= 100) { //power is full, so stop charging.
                    clearInterval(timer);
                    self.power = 100;
                    return false;
                }
                self.power += chargeRate;
            }, 20);
            ConsoleUtil.show("Spaceship No." + self.id + " is charging.");
        };

        /**
         * [discharge: discharge power when flying]
         * @return {[type]} [description]
         */
        var discharge = function() {
            var dischargeRate = DEFAULT_DISCHARGE_RATE;
            var timer = setInterval(function() {
                //if the spaceship is stop or has been destroyed stop, then stop discharging.
                if (self.currState == "stop" || self.currState == "destroy") {
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
            }, 20);
            ConsoleUtil.show("Spaceship No." + self.id + " is discharging.");
        };

        return {
            charge: charge,
            discharge: discharge
        };
    };

    //状态系统
    //State manager apply the classic State Pattern Design;
    Spaceship.prototype.stateManager = function() {
        var self = this;
        //istantiate several states of the spaceship
        var states = {
            fly: function(state) {
                self.currState = "fly";
                self.dynamicManager().fly();
                self.powerManager().discharge();
            },
            stop: function(state) {
                self.currState = "stop";
                self.dynamicManager().stop();
                self.powerManager().charge();
            },
            destroy: function(state) {
                self.currState = "destroy";
                self.mediator.remove(self);
                // AnimUtil.onDraw(self.mediator.getSpaceships());
            }
        };

        /**
         * [changeState execute the command and change the state]
         * @param  {[type]} state [spaceship state: fly, stop, destroy]
         * @return {[type]}       [description]
         */
        var changeState = function(state) {
            //implement the state command accordingly
            states[state]();
            ConsoleUtil.show("Spaceship No." + self.id + " state is " + state);
        };

        return {
            changeState: changeState
        };
    };

    //信号系统
    //The signal manager is used to receives and send messeges
    Spaceship.prototype.signalManager = function() {
        var self = this;
        return {
            receive: function(msg, from) {
                if (self.currState != msg.cmd && self.id == msg.id) {
                    self.stateManager().changeState(msg.cmd);
                }
            }
        };
    };


    //指挥官
    var Commander = function() {
        this.id = "Don";
        this.msgs = [];
        this.mediator = null;
    };

    //send message through mediator
    Commander.prototype.send = function(msg) {
        this.mediator.send(msg);
        this.msgs.push(msg);
    };

    // Commander.prototype.redo = function() {
    //     this.mediator.send(msg[msg.length - 1]);
    // };


    //中转系统Mediator
    //It is a tool to help objects receive or send messages.
    var Mediator = function() {
        var spaceships = [];
        var commander = null;
        var  animUtil = null;
        return {
            /**
             * [register: Only if the object registers in mediator, otherwise they cannot exchange message]
             * @param  {[type]} obj [description]
             * @return {[type]}     [description]
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
                } else if (obj instanceof Object ) {
                    animUtil = obj;
                    obj.setMediator(this);
                }

                ConsoleUtil.show("mediator register failed");
                return false;
            },

            send: function(msg, from, to) {
                var self = this;
                setTimeout(function() {
                    var success = Math.random() > FAILURE_RATE ? true : false;
                    if (success) {
                        ConsoleUtil.show("send success");
                        if (to) { //unicast
                            to.receive(msg, from);
                        } else { //broadcast;
                            if (msg.cmd == "launch") {
                                self.create(msg);
                                return true;
                            }
                            for (var key in spaceships) {
                                if (spaceships[key] !== from) {
                                    spaceships[key].signalManager().receive(msg, from);
                                }
                            }
                        }
                    } else {
                        ConsoleUtil.show("send failed");
                    }
                }, 50);
            },

            remove: function(obj) {
                if (obj instanceof Spaceship) {
                    ConsoleUtil.show("destroy spaceship No." + obj.id);
                    spaceships[obj.id] = undefined;
                    delete obj;
                    return true;
                }
                ConsoleUtil.show("mediator remove failed");
                return false;
            },

            create: function(msg) {
                if (spaceships[msg.id] !== undefined) {
                    ConsoleUtil.show("Spaceship already exists");
                    return false;
                }
                var spaceship = new Spaceship(msg.id);
                this.register(spaceship);
                // AnimUtil.onDraw(spaceships);
            },

            getSpaceships: function() {
                return spaceships;
            }
        };
    };

    //信令
    var Message = function(target, command) {
        this.id = target;
        this.cmd = null;
        switch (command) {
            case "launch":
            case "stop":
            case "fly":
            case "destroy":
                this.cmd = command;
                break;
            default:
                alert("invalid command");
        }
    };

    //按钮句柄
    var butttonHandler = function(commander) {
        var id = null;
        var cmd = null;
        $(".btn").on("click", function() {
            var cmdName = $(this).attr("name");
            switch (cmdName) {
                case "launch":
                case "fly":
                case "stop":
                case "destroy":
                    id = $(this).parent().index();
                    cmd = cmdName;
                    break;
                default:
                    alert("invalid command!");
                    break;
            }
            var message = new Message(id, cmd);
            commander.send(message);
        });
    };

    //动画工具
    var AnimUtil = (function() {
        var c = document.getElementById("screen");
        c.width = SCREEN_WIDTH;
        c.height = SCREEN_HEIGHT;
        var ctx = c.getContext("2d");
        var timer = null;

        var cacheCanvas = document.createElement("canvas");
        cacheCanvas.width = SCREEN_WIDTH;
        cacheCanvas.height = SCREEN_HEIGHT;
        var cacheCtx = cacheCanvas.getContext("2d");

        var mediator = null;

        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


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

        var drawOrbit = function(_ctx) {
            for (var i = 0; i < ORBIT_COUNT; i++) {
                _ctx.strokeStyle = "#999";
                _ctx.beginPath();
                _ctx.arc(SCREEN_CENTER_X, SCREEN_CENTER_Y, 100 + 50 * i, 0, 2 * Math.PI);
                _ctx.closePath();
                _ctx.stroke();
            }
        };

       (function() {
            var canvas = document.getElementById("background");
            canvas.width = SCREEN_WIDTH;
            canvas.height = SCREEN_HEIGHT;
            var _ctx = canvas.getContext("2d");
            _ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            drawPlanet(_ctx);
            drawOrbit(_ctx);
        })();
        
        
        var drawSpaceship = function(_ctx, spaceship) {
            var spaceshipImg = new Image();
            spaceshipImg.src = "min-iconfont-rocket-active.png";
            spaceshipImg.onload = function() { //put _ctx into onload function, otherwise it will cause preload problem.
                try {
                    //change coordinator to center
                    _ctx.save();
                    _ctx.translate(SCREEN_CENTER_X, SCREEN_CENTER_Y);
                    _ctx.rotate(-spaceship.deg * Math.PI / 180);
                    //Update Power
                    _ctx.beginPath();
                    if (spaceship.power > 70) {
                        _ctx.strokeStyle = POWERBAR_COLOR_GOOD;
                    } else if (spaceship.power < 70 && spaceship.power > 30) {
                        _ctx.strokeStyle = POWERBAR_COLOR_MEDIUM;
                    } else {
                        _ctx.strokeStyle = POWERBAR_COLOR_BAD;
                    }
                    _ctx.lineWidth = POWERBAR_WIDTH;
                    _ctx.moveTo(spaceship.orbit, -POWERBAR_POS_OFFSET);
                    _ctx.lineTo(spaceship.orbit + SPACESHIP_SIZE * (spaceship.power / 100), -POWERBAR_POS_OFFSET);
                    _ctx.stroke();
                    _ctx.drawImage(spaceshipImg, spaceship.orbit, 0, SPACESHIP_SIZE, SPACESHIP_SIZE);
                    _ctx.restore();
                    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);  
                    ctx.drawImage(cacheCanvas, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                } catch (error) {

                };
            };
        };

        var animLoop = function() {
            requestAnimationFrame(animLoop);
            onDraw(mediator.getSpaceships());
        }


        var onDraw = function(spaceships) {

            if (!(spaceships == undefined || spaceships.every(function(item, index, array) {
                    return item == undefined;
                }))) {
                cacheCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                for (var i = 0; i < spaceships.length; i++) {
                    if (spaceships[i] !== undefined) {
                        drawSpaceship(cacheCtx, spaceships[i]);
                    }
                }
            } else {
                ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            }
        };

        var setMediator = function(_mediator) {
            mediator = _mediator
        };

        return {
            setMediator: setMediator,
            onDraw: onDraw,
            animLoop: animLoop
        };
    })();

    //控制台工具
    var ConsoleUtil = (function() {
        return {
            show: function(msg) {
                var $msg = $("<li></li>");
                $msg.text(msg);
                $consoleLog.prepend($msg);
            }
        };
    })();

    //主线程
    window.onload = function() {
        var commander = new Commander();
        var mediator = new Mediator();
        mediator.register(commander);
        mediator.register(AnimUtil);
        butttonHandler(commander);
        AnimUtil.animLoop();
        // AnimUtil.onDraw();
        // AnimUtil.drawOrbit();
        // AnimUtil.drawSpaceship(75, 0);
        // AnimUtil.drawPlanet();
    };

})();
