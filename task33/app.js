/*
 * @Author: dontry
 * @Date:   2016-04-12 11:43:45
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-12 14:39:22
 */
(function() {
    'use strict';

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

    var Box = function(x, y, dir) {
        this.prevDirection = dir || UP;
        this.x = x || 0;
        this.y = y || 0;
    };

    Box.prototype.move = function(dir) {
        if (this.prevDirection != dir) {
            this.prevDirection = dir;
            renderBoxDir(dir);
            return;
        } else {
            switch (dir) {
                case LEFT:
                    if (this.x === 0) break;
                    this.x--;
                    break;
                case UP:
                    if (this.y === 0) break;
                    this.y--;
                    break;
                case RIGHT:
                    if (this.x === BOUNDARY) break;
                    this.x++;
                    break;
                case DOWN:
                    if (this.y === BOUNDARY) break;
                    this.y++;
                    break;
                default:
                    console.log("INVALID KEY");
                    return false;
            }
            renderBoxPos(this.x, this.y);
        }

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
            $box.style.transform = "rotate(" + deg + "deg)";
            console.log("change direction:" + dir);
        };

        function renderBoxPos(x, y) {
            $box.remove();
            var $td = $("tr")[y].getElementsByTagName("td")[x];
            $td.appendChild($box);
            console.log("box moves to x:" + x + ", y:" + y);
        };
    };

    var LEFT = 37;
    var UP = 38;
    var RIGHT = 39;
    var DOWN = 40;
    var BOUNDARY = 9;

    var $board = $("#board");
    var $box = $("#box");
    var $body = document.getElementsByTagName("body")[0];
    var $cmd = $("#cmd");
    var $btnExec = $("#execute");
    var box = new Box(0, 0);
    var turn = 1;



    var keyHandler = function() {
        $body.addEventListener("keydown", function(evt) {
            var dir = evt.keyCode;
            box.move(dir);
            // console.log("keydown");
        }, false);
    };

    var butttonHandler = function() {
        $btnExec.addEventListener("click", function() {
            var val = $cmd.value.toUpperCase();
            switch(val) {
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
                default: 
                    console.log("INVALID CMD");
            }
            turn = turn%4 >= 0 ? turn%4 : 4+(turn%4);
            var dir = LEFT + turn;
            box.move(dir);
        });
    };



    window.onload = function() {
        keyHandler();
        butttonHandler();
    };

})();
