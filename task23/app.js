/*
* @Author: dontry
* @Date:   2016-10-24 20:05:42
* @Last Modified by:   dontry
* @Last Modified time: 2016-10-24 22:02:42
*/

'use strict';


        //树对象
        function Tree(ele) {
            this.root = ele;
            this.animStack = [];
            this.msg = ""; 
        }

        //深度优先遍历
        Tree.prototype.traverseDF = function(callback) {
            var self = this;
            (function recurse(node) {
                callback.call(self, node);
                for (var i = 0, length = node.children.length; i < length; i++) {
                    recurse(node.children[i]);
                }
            })(self.root);
        };

        //广度优先遍历
        Tree.prototype.traverseBF = function(callback) {
            var queue, currentTree;
            queue = new Queue();
            queue.enqueue(this.root);
            currentTree = queue.dequeue();
            while (currentTree) {
                callback.call(this, currentTree);
                for (var i = 0; i < currentTree.children.length; i++) {
                    queue.enqueue(currentTree.children[i]);
                }
                currentTree = queue.dequeue();
            }
        };

        //
        Tree.prototype.pushtoStack = function(node) {
            this.animStack.push(node);
        }

        //定义一个队列用于广度优先遍历应用
        function Queue() {
            this.queue = [];
        }

        Queue.prototype.enqueue = function(node) {
            this.queue.push(node);
        }

        Queue.prototype.dequeue = function(node) {
            return this.queue.shift(node);
        }


        //将遍历的节点存入到播放组当中
        Tree.prototype.addToStack = function(node) {
            this.animStack.push(node);
        };

        //搜索
        Tree.prototype.search = function(traversal, query) {
            var self = this;
            var isFound = false;
            var callback = function(node) {
                if (node.innerText.indexOf(query) == 0) {  //由于innerText会把之后子元素的内容都包括，因此不能用单纯等号判断
                    node.className += " found";
                    isFound = true;
                }
                self.addToStack(node);
            };
            traversal.call(this, callback);
            return isFound;
        }

        //重置树
        Tree.prototype.resetTree = function() {
            for (var i = 0, length = this.animStack.length; i < length; i++) {
                this.animStack[i].style.backgroundColor = "#fff";
                this.animStack[i].className = "node";
            }
            this.animStack = [];
        }

        //遍历动画播放
        Tree.prototype.showAnimation = function(msg) {
            var iter = 0;
            var self = this;
            var speeder = document.getElementById("speed");
            var speed = speeder.value == 50 ? 500 : speeder.value;
            self.animStack[iter].style.backgroundColor = self.animStack[iter].className.indexOf("found") == -1 ?  "red" : "yellow";
            var timer = setInterval(function() {
                if (iter >= self.animStack.length - 1) {
                    clearInterval(timer)
                    self.animStack[iter].style.backgroundColor = "#fff";
                    alert(self.msg);
                } else {
                    ++iter;
                    if (self.animStack[iter - 1].className.indexOf("found") == -1)
                        self.animStack[iter - 1].style.backgroundColor = "#fff";
                    if (self.animStack[iter].className.indexOf("found") != -1)
                        self.animStack[iter].style.backgroundColor = "yellow";
                    else
                        self.animStack[iter].style.backgroundColor = "red";
                }
            }, speed);

        };

        //不同遍历方法的按钮
        function addButtonHandlers() {
            var self = this;
            var buttons = document.getElementsByTagName("button");
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener("click", function(evt) {
                    var target = evt.target || window.target;
                    self.resetTree();
                    switch (target.id) {
                        case "traversalBF":
                            self.traverseBF(self.pushtoStack);
                            self.msg = "Breath First Travesal is over";
                            break;
                        case "traversalDF":
                            self.traverseDF(self.pushtoStack);
                            self.msg = "Depth Frist Travesal is over";
                            break;
                        case "search":
                            var queryWord = document.getElementById("inputWord").value;
                            var isFound = self.search(self.traverseBF, queryWord);
                            self.msg = isFound ? (queryWord + " has found.") : (queryWord + " not found");
                            break;
                    };
                    self.showAnimation(self.msg);
                }, false);
            }
        }

        window.onload = function() {
            var tree = new Tree(document.getElementById("root"));
            addButtonHandlers.call(tree);
        }
