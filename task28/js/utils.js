/*
 * @Author: dontry
 * @Date:   2016-04-14 22:38:56
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-15 23:19:21
 */

/**
 * [动画工具 该动画采用双缓存刷新以及requestAnimationFrame致力消除动画闪屏现象]
 */
require("./variable");

var AnimUtil = (function() {
    var canvas = document.getElementById("screen");
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    var ctx = canvas.getContext("2d"); //获取屏幕画布

    var cacheCanvas = document.createElement("canvas");
    cacheCanvas.width = SCREEN_WIDTH;
    cacheCanvas.height = SCREEN_HEIGHT;
    var cacheCtx = cacheCanvas.getContext("2d"); //生成缓存画布

    var timer = null; //定时器
    var mediator = null; //控制动画刷新的mediator

    /**
     * [drawPlanet 画行星]
     * @param  {[type]} _ctx [目标画布]
     * @return {[type]}      [description]
     */
    var drawPlanet = function(_ctx) {
        // ctx.fillStyle = "#1b93ef";
        var x = SCREEN_CENTER_X - PLANET_RADIUS;
        var y = SCREEN_CENTER_Y - PLANET_RADIUS;
        var planet = new Image();
        planet.src = PLANET_IMG_URL;
        planet.onload = function() {
            _ctx.drawImage(planet, x, y, PLANET_RADIUS * 2, PLANET_RADIUS * 2);
        };
    };

    /**
     * [drawOrbit 画飞船轨道]
     * @param  {[type]} _ctx [目标画布]
     * @return {[type]}      [description]
     */
    var drawOrbit = function(_ctx) {
        for (var i = 0; i < ORBIT_COUNT; i++) {
            _ctx.strokeStyle = "#999";
            _ctx.beginPath();
            _ctx.arc(SCREEN_CENTER_X, SCREEN_CENTER_Y, 100 + 50 * i, 0, 2 * Math.PI);
            _ctx.closePath();
            _ctx.stroke();
        }
    };

    /**
     * [动画更新时背景不用刷新，因此仅仅在初始化时绘制一次在background画布上的背景，减少计算量。background画布位于screen画布下面，通过css中z-index属性进行叠加]
     * @return {[type]} [description]
     */
    (function() {
        var canvas = document.getElementById("background");
        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;
        var _ctx = canvas.getContext("2d");
        _ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        drawPlanet(_ctx);
        drawOrbit(_ctx);
    })();

    /**
     * [drawSpaceship 画飞船]
     * @param  {[type]} _ctx      [目标画布,这里的画布是缓存画布]
     * @param  {[type]} spaceship [飞船]
     * @return {[type]}           [绘画成功返回true，失败返回false]
     */
    var drawSpaceship = function(_ctx, spaceship) {
        var spaceshipImg = new Image(); //创建飞船贴图
        spaceshipImg.src = SPACESHIP_IMG_URL;
        spaceshipImg.onload = function() { //当飞船贴图加载后开始在画布上画(由于onload是异步进行的，所以执行顺序上会不是太清晰)
            try { //由于存在获取不了画布的情况产生错误，因此采用try..catch将错误丢弃
                _ctx.save(); //保存画布原有状态
                _ctx.translate(SCREEN_CENTER_X, SCREEN_CENTER_Y); //更改画布坐标系，将画布坐标原点移到画布中心
                _ctx.rotate(-spaceship.deg * Math.PI / 180); //根据飞船飞行角度进行画布选择

                //画电量条，根据电量状态改变颜色
                _ctx.beginPath();
                if (spaceship.power > 60) {
                    _ctx.strokeStyle = POWERBAR_COLOR_GOOD;
                } else if (spaceship.power <= 60 && spaceship.power >= 20) {
                    _ctx.strokeStyle = POWERBAR_COLOR_MEDIUM;
                } else {
                    _ctx.strokeStyle = POWERBAR_COLOR_BAD;
                }
                _ctx.lineWidth = POWERBAR_WIDTH;
                _ctx.moveTo(spaceship.orbit, -POWERBAR_POS_OFFSET);
                _ctx.lineTo(spaceship.orbit + SPACESHIP_SIZE * (spaceship.power / 100), -POWERBAR_POS_OFFSET);
                _ctx.stroke();

                _ctx.drawImage(spaceshipImg, spaceship.orbit, 0, SPACESHIP_SIZE, SPACESHIP_SIZE); //画飞船贴图
                _ctx.restore(); //恢复画布到原有状态
                ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                ctx.drawImage(cacheCanvas, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); //将缓存画布内容复制到屏幕画布上
                return true;
            } catch (error) {
                return false;
            }
        };
    };

    /**
     * [onDraw 绘制屏幕画布]
     * @param  {[type]} spaceships [飞船队列]
     * @return {[type]}            [description]
     */
    var onDraw = function(spaceships) {
        if (!(spaceships === undefined || spaceships.every(function(item, index, array) {
                return item === undefined; //判断飞船队列是否存在，以及飞船队列是否为空；若不是则执行下面步骤
            }))) {
            cacheCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); //每次更新清空缓存画布
            for (var i = 0; i < spaceships.length; i++) { //迭代绘制飞船
                if (spaceships[i] !== undefined) {
                    drawSpaceship(cacheCtx, spaceships[i]);
                }
            }
        } else {
            ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        }
    };

    /**
     * [animLoop 动画循环]
     * @return {[type]} [description]
     */
    var animLoop = function() {
        requestAnimationFrame(animLoop);
        onDraw(mediator.getSpaceships());
    };

    /**
     * [setMediator  为AnimUtil设置Mediator，通过mediator保存的状态控制动画更新]
     * @param {[type]} _mediator [description]
     */
    var setMediator = function(_mediator) {
        mediator = _mediator;
    };

    return {
        setMediator: setMediator,
        animLoop: animLoop
    };
})();

/**
 * [控制台工具 负责显示运行信息]
 */
var ConsoleUtil = (function() {
    var $consoleLog = $("#console ul");
    var show = function(msg) {
        var $msg = $("<li></li>");
        $msg.text(msg);
        $consoleLog.prepend($msg);
    };

    return {
        show: show
    };
})();

module.exports.AnimUtil = AnimUtil;
module.exports.ConsoleUtil = ConsoleUtil;
