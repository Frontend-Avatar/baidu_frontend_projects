/**
 * 文件名：Task-19
 * 作者： zjruan
 * data: 2016/3/21
 */
(function () {
    
    // 元素对象缓存
    var listEle = document.querySelector(".data-list");
    var btns = document.querySelector(".btns");
    var inputBox = document.querySelector('#inputBox');
    var msgBox = document.querySelector('#msgBox');
    
    // 数字验证
    var numReg = /^[0-9]+$/;
    
    var config = {
        fullNum: 60
    }
    var dataArr = [];
    window.dataArr = dataArr;
    
    /**
     * dom 帮助工具
     */
    var domUtil = {  
        // 添加第一个元素
        appendFirst: function (parent,childNode,value) {
            dataArr.unshift(value);
            listEle.insertBefore(childNode, listEle.firstChild);
        },
        // 添加最后一个元素
        appendLast: function (parent,childNode,value) {
            dataArr.push(value);
            listEle.insertBefore(childNode,null);
        },      
        // 移除子节点
        removeChild: function (parent,childNode) {
            dataArr.splice(domUtil.getElenentIndex(childNode), 1);
            parent.removeChild(childNode);   
        },
        // 创建li元素
        createLiElement: function (innerText) {
            var ele = document.createElement('li');
            ele.style.height = innerText+"%";
            return ele;
        },
        // 获取元素在父级元素的索引
        getElenentIndex: function (element) {
            var i=0;
            while(element = element.previousElementSibling){
                i++;
            }
            return i;
        },
        // 显示错误信息
        showMsg: function (msg) {
            // alert(msg);  
            msgBox.innerText = msg;
        },
        // 更新ui
        updateUIByArr: function () {
            var children = listEle.children;
            for(var i=0,len = dataArr.length; i < len; i++){
                children[i].style.height = dataArr[i] + "%";
            }
        }        
    }
    
    // 操作验证
    var velidate = {
        inputNotNull: function () {
            return numReg.test(inputBox.value);
        },
        hasChild: function (parentNode) {
            return parentNode.children.length > 0;
        },
        isFull: function (parentNode) {
            return parentNode.children.length >= config.fullNum;
        }
        
    }
    
     /**
     * 快速排序算法
     * @param [Array] arr 目标数组
     * @param [start] int 开始位置
     * @param [end] int 结束位置
     */
    function quickSort(arr, start, end) {
        if(end-start >= 1){
            var 
                i = start,
                j = end,
                k = arr[i],
                temp;
            
            while(i != j){
                for (; j > i; j--) {
                    if(arr[j] < k){
                        temp = arr[j];
                        arr[j] = arr[i];
                        arr[i] = temp;
                        break;
                    }
                }
                
                for (; j > i; i++) {
                    if(arr[i] > k){
                        temp = arr[j];
                        arr[j] = arr[i];
                        arr[i] = temp;
                        break;
                    }
                }
            }
            
            arr = quickSort(arr,start,i-1);
            arr = quickSort(arr,i+1,end);
        }
        return arr;
    }
    
    /**
     * btn 元素点击事件处理函数
     * @param [event] evt 点击事件 
     */
    function btnClickHanlder(evt) {
        var target = evt.target || window.target;
        
        // 如果点击的是按钮
        if(Object.prototype.toString.call(target) === '[object HTMLAnchorElement]') {
            var className = target.className.replace(/btn|\s/g,"");
            
            var velidate_result, msg, handler, child, value;
            switch(className){
                // 按钮：左侧进 
                case 'leftIn':
                    velidate_result = velidate.inputNotNull() && !velidate.isFull(listEle); // 操作验证，判断操作是否成功
                    msg = velidate.inputNotNull() ? "队列已满" : "输入数字无效";
                    value = inputBox.value;
                    child = velidate_result ? domUtil.createLiElement(value) : ""; // 创建子节点
                    handler = domUtil.appendFirst; // 获取处理函数
                    break;
                    
                // 按钮：右侧进     
                case 'rightIn':
                    velidate_result = velidate.inputNotNull() && !velidate.isFull(listEle);
                    msg = velidate.inputNotNull() ? "队列已满" : "输入数字无效";
                    value = inputBox.value;
                    child = velidate_result ? domUtil.createLiElement(value) : ""; // 创建子节点
                    handler = domUtil.appendLast; // 获取处理函数
                    break;
                    
                // 按钮：左侧出     
                case 'leftOut': 
                    velidate_result = velidate.hasChild(listEle);
                    msg = "没有可弹出元素了";
                    child = velidate_result ? listEle.children[0] : "";  // 获取第一个子元素
                    handler = domUtil.removeChild; // 获取处理函数
                    break;
                    
                // 按钮：右侧出   
                case 'rightOut':
                    velidate_result = velidate.hasChild(listEle);
                    msg = "没有可弹出元素了";
                    child = velidate_result ? listEle.children[listEle.children.length-1] : ""; // 获取最后一个子元素
                    handler = domUtil.removeChild; // 获取处理函数
                    break;
                default: console.log('你点了个空气');  break;
            }
            
            if(velidate_result) {
                handler(listEle, child, value);
            }else{
                domUtil.showMsg(msg)
            }
        }
    }
    
    /**
     * li 元素点击事件处理函数
     * @param [event] evt 点击事件 
     */
    function liClickHandler(evt) {
        var target = evt.target || window.target;
        
        // 点击事件过滤： 如果点击的是数字元素
        if(Object.prototype.toString.call(target) === '[object HTMLLIElement]') {
            domUtil.removeChild(listEle,target);
        }
    }
    
    /**
     * 随机数处理函数
     */
    function addRandomHandler(evt) {
        for(var i=0;i<20;i++){
            if( velidate.isFull(listEle)) return;
            var num = parseInt(Math.random() * 100);
            var temp = domUtil.createLiElement(num);
            domUtil.appendLast(listEle,temp,num);
        }
    }
    
    /**
     * 排序事件处理函数
     */
    function orderEleHandler(evt) {
        // 对数组进行排序
        dataArr = quickSort(dataArr,0,dataArr.length-1);
        
        // 更新ui
        domUtil.updateUIByArr();        
    }
    
    /**
     * 事件绑定
     */
    //按钮事件绑定
    btns.addEventListener('click', btnClickHanlder);  
    
    // li元素点击事件绑定  
    listEle.addEventListener('click', liClickHandler);
    // li元素点击事件绑定  
    document.querySelector('.randomIn').addEventListener('click', addRandomHandler);
    // li元素点击事件绑定  
    document.querySelector('.order').addEventListener('click', orderEleHandler);
})()