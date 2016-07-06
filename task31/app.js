/*
 * @Author: dontry
 * @Date:   2016-04-12 10:29:56
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-19 10:31:19
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

    }

    var list = [ //数组容器，存放城市，以及学校
        {
            text: '北京',
            val: [
                '北京大学',
                '清华大学',
                '北京理工大学',
                '北京邮电大学',
                '中央财经大学'
            ]
        }, {
            text: '天津',
            val: [
                '天津大学',
                '南开大学',
                '天津理工大学',
                '天津商业大学',
                '天津财经大学'
            ]
        }, {
            text: '上海',
            val: [
                '复旦大学',
                '上海大学',
                '上海理工大学',
                '上海海洋大学',
                '上海财经大学'
            ]
        }, {
            text: '成都',
            val: [
                '成都大学',
                '西南大学',
                '成都理工大学',
                '成都科技大学',
                '西南财经大学',
                '西华大学'
            ]
        }

    ];

    var $radioBoxes = $(".radio"); //单选框
    var $selectCity = $("#city"); //城市选择
    var $selectSchool = $("#school"); //学校选择
    var $formgroupNonstudent = $("#formgroupNonstudent"); //非在校生表单
    var $formgroupStudent = $("#formgroupStudent"); //在校生表单
    var $optionCity = $selectCity.getElementsByTagName("option"); //城市选择列表
    var $optionSchool = $selectSchool.getElementsByClassName("option"); //学校选择列表

    //单选框事件控制器
    var radioHandler = function() {
        for (var i = 0; i < $radioBoxes.length; i++) {
            $radioBoxes[i].addEventListener("click", function() {
                if (this.checked) {
                    if (this.value == "student") {
                        $formgroupStudent.style.display = "block";
                        $formgroupNonstudent.style.display = "none";
                    } else if (this.value == "non-student") {
                        $formgroupStudent.style.display = "none";
                        $formgroupNonstudent.style.display = "block";
                    }
                }
            });
        }
    };

    //设置选择列表的事件控制器
    var selectHandler = function() {
        $selectCity.innerHTML = "";
        var arr = [];

        //添加城市选项
        for (var i = 0; i < list.length; i++) {
            var option = document.createElement("option");
            option.innerHTML = list[i].text;
            option.value = list[i].text;
            $selectCity.appendChild(option);
        }

        //当点击城市后，添加相应呃学校选择列表
        $selectCity.addEventListener("click", function() {
            $selectSchool.innerHTML = "";
            for (var i = 0; i < list.length; i++) {
                if ($optionCity[i].selected) {
                    for (var j = 0; j < list[i].val.length; j++) {
                        var option = document.createElement("option");
                        option.innerText = list[i].val[j];
                        option.value = list[i].val[j];
                        $selectSchool.appendChild(option);
                    }
                }
            }
        });
    };

    //主线程
    window.onload = function() {
        radioHandler();
        selectHandler();
    };


})();
