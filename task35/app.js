/*
 * @Author: dontry
 * @Date:   2016-04-12 11:43:45
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-19 11:10:11
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
    var cmdReg = /[\w\d]+/g; //匹配命令
    var numReg = /\d+/; //匹配距离数字

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

    /**
     * [play 根据输入命令的方向及动作播放动画]
     * @param  {[type]} dir [方向]
     * @param  {[type]} cmd [命令]
     * @return {[type]}     [description]
     */
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

        //将命令分解为改变方向和移动距离
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


        //更新位置
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


        //更新方向
        function updateBoxDir(dir) {
            this.dir = dir;
            renderBoxDir(this.dir)
        }

        //根据坐标渲染方块位置
        function renderBoxPos(x, y) {
            $box.style.left = x * TILE_SIZE + "px";
            $box.style.top = y * TILE_SIZE + "px";
        }

        //根据方向渲染方块朝向
        function renderBoxDir(dir) {
            $box.style.transform = "rotate(" + dir + "deg)";
            console.log("change direction:" + dir);
        }
    };

    /**
     * [getLines 获得每行命令]
     * @param  {[type]} str [命令行输入的字符串]
     * @return {[type]}     [description]
     */
    function getLines(str) {
        str = str.trim();
        return str.split("\n");
    }

    /**
     * [executeCmd 执行命令]
     * @param  {[type]} line [命令行]
     * @return {[boolean]}      [合法指令返回true，非法指令返回false]
     */
    function executeCmd(line) {
        // line = line.trim();
        var linePart = line.match(cmdReg); //将命令行里的单词转化为数组
        var lineAct = null; //命令行里代表的动作指令(包括方向)，例如：GO, TUN LEF, TRA BOT
        var cmd = null; //不包括方向的单纯动作指令
        try {
            cmd = linePart[0]; 
        } catch(error) {
            return false;
        }
        var dir = UP;
        var step = null;
        var turn = 0;

        //判断指令第二个单词是否为数字，例如像GO 2这样的指令;
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
        dir = (cmd == "TUN" || cmd == "GO") ? box.dir + turn * 90 : dir; //判断方块方向
        box.play(dir, cmd, step);
        return true;
    }

    //按下“执行”按钮后开始执行指令
    var butttonHandler = function() {
        $btnRun.addEventListener("click", function() {
            var str = $cmd.value.toUpperCase();
            var lines = getLines(str);  //获得每行指令并存到数组中
            var $li = $lineNum.getElementsByTagName("li");

            var iter = 0;
            //以每秒一行的速度执行指令
            var timer = setInterval(function() {
                if (iter >= lines.length || (lines.length == 1 && lines[0] == "")) {
                    clearInterval(timer);
                    return false;
                }
                if (!executeCmd(lines[iter])) $li[iter].className = "error"; //若非法指令则将其标红
                $li[iter].appendChild($pointer); //改变执行指针位置
                iter++;
            }, 1000);
        });

        //重置按钮，清除命令输入框，方块回到初始状态。
        $btnReset.addEventListener("click", function() {
            $lineNum.innerHTML = ""
            $cmd.value = "";
            $box.style.top = 0;
            $box.style.left = 0;
            $box.style.transform = "rotate(0deg)";
            box = new Box(0, 0);
        });
    };



    //输入框事件控制器
    var textareaHandler = function() {
        $cmd.addEventListener("keydown", function(evt) {
            updateLineNum();
            syncScroll();
        });

        $cmd.addEventListener("keyup", function(evt) {
            updateLineNum();
        });

        $cmd.addEventListener("scroll", function() {
            syncScroll();
        });
    }

    //更新行数序号
    function updateLineNum() {
        var lines = getLines($cmd.value);
        $lineNum.innerHTML = "";
        for (var i = 0; i < lines.length; i++) {
            var li = document.createElement("li");
            li.innerText = nodeLength($lineNum) + 1;
            $lineNum.appendChild(li)
        }
    }

    //当输入框滚动时，行数序号刷新对齐
    function syncScroll() {
        var $li = $lineNum.getElementsByTagName("li");
        $li[0].style.marginTop = -$cmd.scrollTop + "px";
    }

    //子节点个数
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
