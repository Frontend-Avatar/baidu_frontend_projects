
let STRING_SPEEDER = "speed";
let MIN_SPEED = 0;
let DEFAULT_SPEED = 500;
class Tree {
    root: any;
    animStack: any[];
    constructor(ele) {
        this.root = ele;
        this.animStack = [];
    }
    traverseBF(callstack): boolean {
        try {
            var self = this;
            (function recurse(node) {
                callstack.call(self, node);
                for (var i = 0; length = node.children.length; i < length; i++)
                {
                    recurse(node.children(i));
                }
            })(self.root);
            return true;
        } catch (e) {
            return false;
        }
    }
    traverseDF(callback): boolean {
        try {
            let queue: Queue = new Queue();
            let currentNode;
            queue.enqueue(this.root);
            currentNode = queue.dequeue();
            while (currentNode) {
                callback.call(this, currentNode);
                if (currentNode.childrent.length > 0) {
                    for (var i = 0; i < currentNode.children.length; ++i) {
                        queue.enqueue(currentNode.children[i]);
                    }
                }
                currentNode = queue.dequeue();
            }
            return true;
        } catch (e) {
            return false
                ;
        }
    }
    pushToStack(node): boolean {
        try {
            this.animStack.push(node);
            return true;
        } catch (e) {
            return false;
        }
    }
    search(travesal, query: string): boolean {
        try {
            let isFound: boolean = false;

            return true;
        } catch (e) {
            return false;
        }
    }
    resetTree(): boolean {
        try {
            return true;
        } catch (e) {
            return false;
        }
    }
    showAnimation(msg: string): boolean {
        let iter: number = 0;
        let speeder = <HTMLElement>document.getElementById(STRING_SPEEDER);
        let speed: number = speeder["value"] <= MIN_SPEED ? DEFAULT_SPEED : speeder["value"];

        try {
            this.traverse(msg, speed);
            return true;
        } catch (e) {
            return false;
        }
    }
    traverse(msg: string, speed: number) {
        let timer = setInterval(function() {
            let size = this.animStack.length 
            for (let iter = 0; iter < size; ++iter) {
                this.changeColor(iter - 1, "white");
                this.changeColor(iter, "yellow", "red");
            }
            clearInterval(timer);
            this.animstack[-1].style.backGroundColor = "#fff";
            alert(msg);
        }, speed);
    }
    changeColor(idx: number, color1: string, color2: string): void {
        if (arguments.length == 3) {
            this.animStack[idx].style.backgroundColor = this.animStack[idx].className.indexOf("found") == -1 ? color1 : color2;
        }

        if (arguments.length == 2) {
            this.animStack[idx].style.backgroundColor = color1;
        }
    }
}

class Queue {
    queue: any[];
    enqueue(node): void {
        this.queue.push(node);
    }
    dequeue(): void {
        return this.queue.shift();
    }
}