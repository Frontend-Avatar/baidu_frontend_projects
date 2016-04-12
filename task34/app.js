/*
 * @Author: dontry
 * @Date:   2016-04-12 11:43:45
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-12 16:24:18
 */
(function() {
    'use strict';

    var LEFT = 37;
    var UP = 38;
    var RIGHT = 39;
    var DOWN = 40;
    var BOUNDARY = 9;
    var TILE_SIZE = 41;

    var $board = $("#board");
    var $box = $("#box");
    var $body = document.getElementsByTagName("body")[0];
    var $cmd = $("#cmd");
    var $btnExec = $("#execute");
    var box = new Box(0, 0);
    var turn = 1;


    function $(element) {
        if (typeof element != "string") return;

        if (element.indexOf("#") == 0) {
            return document.getElementById(element.substring(1));
        }

        if (element.indexOf(".") == 0) {
            return document.getElementsByClassName(element.substring(1));
        }

        return document.getElementsByTagName(element);

    }

    function Box(x, y, dir) {
        this.dir = dir || UP;
        this.x = x || 0;
        this.y = y || 0;
    };

    Box.prototype.play = function(dir, cmd) {
        var self = this;
        switch (cmd) {
            case "GO":
                go(dir);
                break;
            case "TUN":
                turn(dir);
                break;
            case "TRA":
                traverse(dir);
                break;
            case "MOV":
                move(dir);
                break;

                function go(dir) {
                    updatePos.call(self, 1);
                }

                function turn(dir) {
                    renderBoxDir(dir);
                }

                function traverse(dir) {
                    updatePos.call(self, 1);
                }

                function move(dir) {
                    renderBoxDir(dir);
                    updatePos.call(self, 1);
                }

                function updatePos(step) {
                    switch (dir) {
                        case LEFT:
                            if (this.x - step < 0) {
                                this.x = 0;
                                break;
                            }
                            this.x -= step;
                            break;
                        case UP:
                            if (this.y - step < 0) {
                                this.y = 0;
                                break;
                            }
                            this.y -= step;
                            break;
                        case RIGHT:
                            if (this.x + step > BOUNDARY) {
                                this.x = BOUNDARY
                                break;
                            }
                            this.x += step;
                            break;
                        case DOWN:
                            if (this.y + step > BOUNDARY) {
                                this.y += BOUNDARY;
                                break;
                            }
                            this.y += step;
                            break;
                        default:
                            console.log("INVALID KEY");
                            return false;
                    }
                    renderBoxPos(this.x, this.y);
                }
        };


        function renderBoxDir(dir) {
            var deg = 0;
            switch (dir) {
                case LEFT:
                    deg = 270;
                    break;
                case UP:
                    deg = 0;
                    break;
                case RIGHT:
                    deg = 90;
                    break;
                case DOWN:
                    deg = 180;
                    break;
                default:
                    console.log("INVALID KEY");
                    return false;
            }
            box.dir = dir;
            $box.style.transform = "rotate(" + deg + "deg)";
            console.log("change direction:" + dir);
        }

        function renderBoxPos(x, y) {
            $box.style.left = x * TILE_SIZE + "px";
            $box.style.top = y * TILE_SIZE + "px";
        }
    }







    var keyHandler = function() {
        $body.addEventListener("keydown", function(evt) {
            var dir = evt.keyCode;
            box.play(dir);
            // console.log("keydown");
        }, false);
    };

    var butttonHandler = function() {
        $btnExec.addEventListener("click", function() {
            var val = $cmd.value.toUpperCase();
            var dir = LEFT;
            var cmd = cmd === "GO" ? "GO" : val.substr(0, 3);
            switch (val) {
                case "GO":
                    break;
                case "TUN LEF":
                    turn--;
                    break;
                case "TUN RIG":
                    turn++;
                    break;
                case "TUN BAC":
                    turn += 2;
                    break;
                case "TRA LEF":
                case "MOV LEF":
                    dir = LEFT;
                    break;
                case "TRA TOP":
                case "MOV TOP":
                    dir = TOP;
                    break;
                case "TRA RIG":
                case "MOV RIG":
                    dir = RIGHT;
                    break;
                case "TRA BOT":
                case "MOV BOT":
                    dir = DOWN;
                    break;

                default:
                    console.log("INVALID CMD");
            }
            turn = turn % 4 >= 0 ? turn % 4 : 4 + (turn % 4);
            dir = cmd == "TUN" ? LEFT + turn : dir;
            box.play(dir, cmd);
        });
    };



    window.onload = function() {
        keyHandler();
        butttonHandler();
    };

})();
