/*
 * @Author: dontry
 * @Date:   2016-04-12 11:43:45
 * @Last Modified by:   dontry
 * [该小方块能够同时识别键盘方向键以及输入框的命令]
 * @return {[type]} [description]
 * @Last Modified time: 2016-05-22 23:06:02
 */
(function() {
    'use strict';

    //根据将键盘方向键与方向对应起来
    var LEFT = 37;
    var UP = 38;
    var RIGHT = 39;
    var DOWN = 40;
    var BOUNDARY = 9;  //边界位置

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

    /**
     * [play 根据输入命令的方向及动作播放动画]
     * @param  {[type]} dir [方向]
     * @param  {[type]} cmd [命令]
     * @return {[type]}     [description]
     */
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

        //渲染方块的方向
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

        //渲染方块的位置，由于采用了将方块放到不同格子中改变位置，因此缺少移动动画。
        function renderBoxPos(x, y) {
            var $td = $tbody.rows[y].cells[x];
            $td.appendChild($box);
            console.log("box moves to x:" + x + ", y:" + y);
        };
    };

    var $board = $("#board");
    var $box = $("#box");
    var $body = document.getElementsByTagName("body")[0];
    var $cmd = $("#cmd");
    var $btnExec = $("#execute");
    var $tbody = $board.tBodies[0];
    var box = new Box(0, 0);
    var turn = 1;  //通过一个turn变量持续记录方块旋转90度的次数，正数为顺时针，负数为逆时针

<<<<<<< HEAD

    //响应键盘事件
=======
    //按键控制
>>>>>>> don
    var keyHandler = function() {
        $body.addEventListener("keydown", function(evt) {
            var dir = evt.keyCode;
            box.move(dir);
            // console.log("keydown");
        }, false);
    };

<<<<<<< HEAD
    //当输入框输入命令后，按“执行”按钮执行相应命令
=======
    //按钮控制
>>>>>>> don
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
            turn = turn%4 >= 0 ? turn%4 : 4+(turn%4);  //通过取模运算判断旋转后的方向
            var dir = LEFT + turn; //由于为方便计算LEFT为最小值，而方块初始方向是向上，因此turn设为1，校正方块初始值
            box.move(dir);
        });
    };



    window.onload = function() {
        keyHandler();
        butttonHandler();
    };

})();
