/*
 * @Author: dontry
 * @Date:   2016-04-21 13:15:36
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-21 18:19:54
 */

"use strict";

;
(function() {
    var PHOTO_ADRESS_PREFIX = "http://placehold.it/";

    function PhotoFrame(containerSelector) {
        if (!containerSelector) {
            alert("selector null!");
            return false;
        }
        this.container = document.querySelector(containerSelector);
        if (window.getComputedStyle) {

            this.width = parseInt(window.getComputedStyle(this.container).width);
            this.height = parseInt(window.getComputedStyle(this.container).height);
        } else if (this.container.currentStyle) {
            this.width = parseInt(this.container.currentStyle.width);
            this.height = parseInt(this.container, currentStyle.height);
        }
        this.init();
    }

    PhotoFrame.prototype.init = function() {
        var photoBoxes = this.container.querySelectorAll(".box-photo");
        for (var i = 0, length = photoBoxes.length; i < length; i++) {
            if (window.getComputedStyle) {
                var widthStr = window.getComputedStyle(photoBoxes[i]).width;
                var heightStr = window.getComputedStyle(photoBoxes[i]).height;
                if (widthStr.indexOf("%") == -1) {
                    var width = parseInt(widthStr);
                    var height = parseInt(heightStr);
                } else {
                    var width = parseInt(parseFloat(widthStr) / 100 * this.width);
                    var height = parseInt(parseFloat(heightStr) / 100 * this.height);
                }
            }
            if (photoBoxes[i].currentStyle) {
                var width = parseFloat(photoBoxes[i].currentStyle.width) / 100 * this.width;;
                var height = parseFloat(photoBoxes[i].currentStyle.height) / 100 * this.height;;
            }
            var bgColor = randomColor();
            var size = width + "x" + height;
            var photoAddress = PHOTO_ADRESS_PREFIX + size + "/" + bgColor + "/fff";
            photoBoxes[i].style.backgroundImage = "url(" + photoAddress + ")";
        }
    };
    

    function randomColor() {
        var rand = Math.floor(Math.random() * 0x1000000).toString(16);
        if (rand.length == 6) {
            return rand;
        } else {
            return randomColor();
        }
    };

    function btnHandler() {
        var btns = document.querySelectorAll("button");
        var index = 0;

        for (var i = 0, length = btns.length; i < length; i++) {
            btns[i].addEventListener("click", function(evt) {
                if (evt.target.className === "btn-nxt" && index < 5) {
                    index++;
                } else if (evt.target.className === "btn-prv" && index > 0) {
                    index--;
                } else {
                    console.log("photoframe out of range");
                    return false;
                }
                var number = index + 1;
                var frame = ".container-photo" + number;
                var curFrame = document.querySelector(frame);
                var siblings = curFrame.parentNode.children;
                for (var i = 0, length = siblings.length; i < length; i++) {
                    if (siblings[i] != curFrame) {
                        siblings[i].style.display = "none";
                    }
                }
                curFrame.style.display = "block";
            });
        }
    }

    window.onload = function() {
        var photoFrame1 = new PhotoFrame(".container-photo1");
        var photoFrame2 = new PhotoFrame(".container-photo2");
        var photoFrame3 = new PhotoFrame(".container-photo3");
        var photoFrame4 = new PhotoFrame(".container-photo4");
        var photoFrame5 = new PhotoFrame(".container-photo5");
        var photoFrame6 = new PhotoFrame(".container-photo6");
        btnHandler();
    };
})();
