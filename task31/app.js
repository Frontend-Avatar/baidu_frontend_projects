/*
 * @Author: dontry
 * @Date:   2016-04-12 10:29:56
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-12 11:07:20
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

    var $radioBoxes = $(".radio");
    var $selectCity = $("#city");
    var $selectSchool = $("#school");
    var $formgroupNonstudent = $("#formgroupNonstudent");
    var $formgroupStudent = $("#formgroupStudent");
    var $optionCity = $selectCity.getElementsByTagName("option");
    var $optionSchool = $selectSchool.getElementsByClassName("option");

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


    var selectHandler = function() {
        $selectCity.innerHTML = "";
        var arr = [];
        for (var i = 0; i < list.length; i++) {
            var option = document.createElement("option");
            option.innerHTML = list[i].text;
            option.value = list[i].text;
            $selectCity.appendChild(option);
        }

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
        })
    };

    window.onload = function() {
        radioHandler();
        selectHandler();
    }


})();
