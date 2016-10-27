var STRING_SPEEDER = "speed";
var MIN_SPEED = 0;
var DEFAULT_SPEED = 500;
var Tree = (function () {
    function Tree() {
    }
    Tree.prototype.traverseBF = function () {
        try {
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Tree.prototype.traverseDF = function () {
        try {
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Tree.prototype.pushToStack = function () {
        try {
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Tree.prototype.search = function () {
        try {
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Tree.prototype.resetTree = function () {
        try {
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Tree.prototype.showAnimation = function (msg) {
        var iter = 0;
        var speeder = document.getElementById(STRING_SPEEDER);
        var number = speeder["value"] <= MIN_SPEED ? DEFAULT_SPEED : speeder["value"];
        try {
            return true;
        }
        catch (e) {
            return false;
        }
    };
    Tree.prototype.changeColor = function (idx, color1, color2) {
        if (arguments.length == 3) {
            this.animStack[idx].style.backgroundColor = this.animStack[idx].className.indexOf("found") == -1 ? color1 : color2;
        }
        if (arguments.length == 2) {
            this.animStack[idx].style.backgroundColor = color1;
        }
    };
    Tree.prototype.traverse = function (msg, speed) {
        var timer = setInterval(function () {
            for (var iter = 0; iter < this.animStack.length; ++iter) {
                changeColor(iter - 1, "white");
                changeColor(iter - 1, "yellow", "red");
            }
            clearInterval(timer);
            this.animstack[iter].style.backGroundColor = "#fff";
            alert(msg);
        }, speed);
    };
    return Tree;
}());
var Queue = (function () {
    function Queue() {
    }
    Queue.prototype.enqueue = function () {
    };
    Queue.prototype.dequeue = function () {
    };
    return Queue;
}());
