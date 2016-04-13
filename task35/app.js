/*
 * @Author: dontry
 * @Date:   2016-04-12 11:43:45
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-13 18:07:50
 */
(function() {
    'use strict';
    var UP = 0;
    var RIGHT = 90;
    var DOWN = 180;
    var LEFT = 270;
    var BOUNDARY = 9;
    var TILE_SIZE = 41;

    var $board = $("#board");
    var $box = $("#box");
    var $body = document.getElementsByTagName("body")[0];
    var $cmd = $("#cmds");
    var $btnRun = $("#run");
    var $btnReset = $("#reset");
    var $lineNum = $("#lineNum");
    var $pointer = $("#pointer");
    var box = new Box(0, 0);
    var cmdReg = /[\w\d]+/g;
    var numReg = /\d+/;

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
        this.dir = dir || 0;
        this.x = x || 0;
        this.y = y || 0;
    };

    Box.prototype.play = function(dir, cmd, step) {
        var self = this;
        switch (cmd) {
            case "GO":
                go(step);
                break;
            case "TUN":
                turn(dir);
                break;
            case "TRA":
                traverse(dir, step);
                break;
            case "MOV":
                move(dir, step);
                break;
        }

        function go(step) {
            updatePos.call(self, step);
        }

        function turn(dir) {
            updateBoxDir.call(self, dir);
        }

        function traverse(dir, step) {
            updatePos.call(self, step);
        }

        function move(dir, step) {
            updateBoxDir.call(self, dir);
            setTimeout(function(){
                updatePos.call(self, step);
            },500);
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



        function updateBoxDir(dir) {
            this.dir = dir;
            renderBoxDir(this.dir)
        }

        function renderBoxPos(x, y) {
            $box.style.left = x * TILE_SIZE + "px";
            $box.style.top = y * TILE_SIZE + "px";
        }

        function renderBoxDir(dir) {
            $box.style.transform = "rotate(" + dir + "deg)";
            console.log("change direction:" + dir);
        }
    };


    function getLines(str) {
        str = str.trim();
        return str.split("\n");
    }

    function executeCmd(line) {
        // line = line.trim();
        var linePart = line.match(cmdReg);
        var lineAct = null;
        var cmd = null;
        try {
            cmd = linePart[0];
        } catch(error) {
            return false;
        }
        var dir = UP;
        var step = null;
        var turn = 0;

        if (numReg.test(linePart[1])) {
            step = parseInt(linePart[1]);
            lineAct = cmd;
        } else {
            step = parseInt(linePart[2]);
            lineAct = cmd + " " + linePart[1];
        }
        switch (lineAct) {
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
                dir = UP;
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
                return false;
        }
        dir = (cmd == "TUN" || cmd == "GO") ? box.dir + turn * 90 : dir;
        box.play(dir, cmd, step);
        return true;
    }

    var butttonHandler = function() {
        $btnRun.addEventListener("click", function() {
            var str = $cmd.value.toUpperCase();
            var dir = LEFT;
            var lines = getLines(str);
            var $li = $lineNum.getElementsByTagName("li");
            // lines.forEach(function(item, index) {
            //     // setTimeout(executeCmd(item), 1000);
            //     // executeCmd(item);
            // });
            var iter = 0;
            var timer = setInterval(function() {
                if (iter >= lines.length || (lines.length == 1 && lines[0] == "")) {
                    clearInterval(timer);
                    return false;
                }
                if (!executeCmd(lines[iter])) $li[iter].className = "error";
                $li[iter].appendChild($pointer);
                iter++;
            }, 1000);
        });

        $btnReset.addEventListener("click", function() {
            $lineNum.innerHTML = ""
            $cmd.value = "";
            $box.style.top = 0;
            $box.style.left = 0;
            $box.style.transform = "rotate(0deg)";
            box = new Box(0, 0);
        })
    };




    var textareaHandler = function() {
        $cmd.addEventListener("keydown", function(evt) {
            updateLineNum();
            syncScroll();
        });

        $cmd.addEventListener("keyup", function(evt) {
            updateLineNum();
        })

        $cmd.addEventListener("scroll", function() {
            syncScroll();
        })
    }

    function updateLineNum() {
        var lines = getLines($cmd.value);
        $lineNum.innerHTML = "";
        for (var i = 0; i < lines.length; i++) {
            var li = document.createElement("li");
            li.innerText = nodeLength($lineNum) + 1;
            $lineNum.appendChild(li)
        }
    }

    function syncScroll() {
        var $li = $lineNum.getElementsByTagName("li");
        $li[0].style.marginTop = -$cmd.scrollTop + "px";
    }

    function nodeLength(ele) {
        var length = 0;
        for (var i = 0; i < ele.childNodes.length; i++) {
            if (ele.childNodes[i].nodeType === 1) length++;
        }
        return length;
    }



    window.onload = function() {
        butttonHandler();
        textareaHandler();
    };

})();
