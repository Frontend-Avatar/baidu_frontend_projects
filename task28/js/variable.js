/*
* @Author: dontry
* @Date:   2016-04-14 23:14:33
* @Last Modified by:   dontry
* @Last Modified time: 2016-04-15 23:19:47
*/

'use strict';
var DEFAULT_SPACESHIP_SPEED = 2; //飞船飞行速度
var SPACESHIP_SIZE = 40; //飞船大小
var SPACESHIP_COUNT = 4; //飞船数量
var DEFAULT_CHARGE_RATE = 0.3; //飞船充电速度
var DEFAULT_DISCHARGE_RATE = 0.2; //飞船放电速度

var LAUNCH = "launch";
var FLY = "fly";
var STOP = "stop";
var DESTROY = "destroy";
var SLOW = "slow";
var MEDIUM = "medium";
var FAST = "fast";

var SPACESHIP_SPEED_SLOW = 0.5; //慢速飞行
var SPACESHIP_SPEED_MEDIUM = 2; //中速飞行
var SPACESHIP_SPEED_FAST = 8; //快速飞行

var CHARGE_RATE_SLOW = 0.05; //慢速充电
var CHARGE_RATE_MEDIUM = 0.3; //中速充电
var CHARGE_RATE_FAST = 1; //快速充电

var SPEED_CODE_NULL = "00";
var SPEED_CODE_SLOW = "01";
var SPEED_CODE_MEDIUM = "10";
var SPEED_CODE_FAST = "11";

var CHARGE_CODE_NULL = "00";
var CHARGE_CODE_SLOW = "01";
var CHARGE_CODE_MEDIUM = "10";
var CHARGE_CODE_FAST = "11";


var POWERBAR_POS_OFFSET = 5; //电量条位置位移
var POWERBAR_COLOR_GOOD = "#70ed3f"; //电量良好状态颜色
var POWERBAR_COLOR_MEDIUM = "#fccd1f"; //电量一般状态颜色
var POWERBAR_COLOR_BAD = "#fb0000"; //电量差状态颜色
var POWERBAR_WIDTH = 5; //电量条宽度

var SCREEN_WIDTH = 800; //屏幕宽度
var SCREEN_HEIGHT = 800; //屏幕高度
var SCREEN_CENTER_X = SCREEN_WIDTH / 2; //屏幕X轴中心坐标
var SCREEN_CENTER_Y = SCREEN_HEIGHT / 2; //屏幕Y轴中心坐标

var PLANET_RADIUS = 50; //行星半径
var ORBIT_COUNT = 4; //轨道数量
var FAILURE_RATE = 0.3; //消息发送失败率
var BUS_FAILURE_RATE = 0.1; //BUS消息发送失败率
var BUS_TRANSMIT_SPEED = 300; //BUS消息发送速度

var LAUNCH_CODE = "00";
var FLY_CODE = "01";
var STOP_CODE = "10";
var DESTROY_CODE = "11";

var SPACESHIP_IMG_URL = "../imgs/min-iconfont-rocket-active.png";
var PLANET_IMG_URL = "../imgs/min-iconfont-planet.png";

//根据浏览器类型设置相应的requestAnimationFrame
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

