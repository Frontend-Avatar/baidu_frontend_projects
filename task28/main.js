/*
* @Author: dontry
* @Date:   2016-04-14 22:37:56
* @Last Modified by:   dontry
* @Last Modified time: 2016-04-16 00:39:38
*/
 DEFAULT_SPACESHIP_SPEED = 2; //飞船飞行速度
 SPACESHIP_SIZE = 40; //飞船大小
 SPACESHIP_COUNT = 4; //飞船数量
 DEFAULT_CHARGE_RATE = 0.3; //飞船充电速度
 DEFAULT_DISCHARGE_RATE = 0.2; //飞船放电速度

 LAUNCH = "launch";
 FLY = "fly";
 STOP = "stop";
 DESTROY = "destroy";
 SLOW = "slow";
 MEDIUM = "medium";
 FAST = "fast";

 SPACESHIP_SPEED_SLOW = 0.5; //慢速飞行
 SPACESHIP_SPEED_MEDIUM = 2; //中速飞行
 SPACESHIP_SPEED_FAST = 8; //快速飞行

 CHARGE_RATE_SLOW = 0.05; //慢速充电
 CHARGE_RATE_MEDIUM = 0.3; //中速充电
 CHARGE_RATE_FAST = 1; //快速充电

 SPEED_CODE_NULL = "00";
 SPEED_CODE_SLOW = "01";
 SPEED_CODE_MEDIUM = "10";
 SPEED_CODE_FAST = "11";

 CHARGE_CODE_NULL = "00";
 CHARGE_CODE_SLOW = "01";
 CHARGE_CODE_MEDIUM = "10";
 CHARGE_CODE_FAST = "11";


 POWERBAR_POS_OFFSET = 5; //电量条位置位移
 POWERBAR_COLOR_GOOD = "#70ed3f"; //电量良好状态颜色
 POWERBAR_COLOR_MEDIUM = "#fccd1f"; //电量一般状态颜色
 POWERBAR_COLOR_BAD = "#fb0000"; //电量差状态颜色
 POWERBAR_WIDTH = 5; //电量条宽度

 SCREEN_WIDTH = 800; //屏幕宽度
 SCREEN_HEIGHT = 800; //屏幕高度
 SCREEN_CENTER_X = SCREEN_WIDTH / 2; //屏幕X轴中心坐标
 SCREEN_CENTER_Y = SCREEN_HEIGHT / 2; //屏幕Y轴中心坐标

 PLANET_RADIUS = 50; //行星半径
 ORBIT_COUNT = 4; //轨道数量
 FAILURE_RATE = 0.3; //消息发送失败率
 BUS_FAILURE_RATE = 0.1; //BUS消息发送失败率
 BUS_TRANSMIT_SPEED = 300; //BUS消息发送速度

 LAUNCH_CODE = "00";
 FLY_CODE = "01";
 STOP_CODE = "10";
 DESTROY_CODE = "11";

 SPACESHIP_IMG_URL = "../imgs/min-iconfont-rocket-active.png";
 PLANET_IMG_URL = "../imgs/min-iconfont-planet.png";

//根据浏览器类型设置相应的requestAnimationFrame
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;




$ = require("jquery");  
Commander = require("./js/commander");
Spaceship =require("./js/spaceship");
Mediator = require("./js/mediator");
Message = require("./js/message");
MessageAdapter = require("./js/message_adapter");
DataCenter = require("./js/data_center")
BUS = require("./js/bus");
AnimUtil = require("./js/utils").AnimUtil;
ConsoleUtil = require("./js/utils").ConsoleUtil;
buttonHandler = require("./js/Handler").buttonHandler;
require('./css/style.css');



(function(){
	'use strict';
	//主线程
	window.onload = function() {
	    var commander = new Commander();
	    var mediator = new Mediator();
	    mediator.register(commander);
	    buttonHandler(commander);
	    AnimUtil.setMediator(mediator);
	    AnimUtil.animLoop();
	};
})();
