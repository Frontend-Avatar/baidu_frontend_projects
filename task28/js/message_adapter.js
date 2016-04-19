/*
 * @Author: dontry
 * @Date:   2016-04-14 23:03:18
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-16 00:37:10
 */
/**
 * [MessageAdapter 消息适配器]
 * @type {Object}
 */
require("./variable");

var MessageAdapter = {
    compile: function(msg) {
        var idCode = msg.id.toString(2).length < 2 ? "0" + msg.id.toString(2) : msg.id.toString(2);
        var cmdCode = null;
        var spdCode = null;
        var chrgCode = null;
        var pwrCode = null;
        var code = null;
        switch (msg.cmd) {
            case LAUNCH:
                cmdCode = LAUNCH_CODE;
                break;
            case FLY:
                cmdCode = FLY_CODE;
                break;
            case STOP:
                cmdCode = STOP_CODE;
                break;
            case DESTROY:
                cmdCode = DESTROY_CODE;
                break;
            default:
                ConsoleUtil.show("Invalid CMD Message");
        }

        switch (msg.spd) {
            case undefined:
            case null:
                spdCode = SPEED_CODE_NULL;
                break;
            case SLOW:
            case SPACESHIP_SPEED_SLOW:
                spdCode = SPEED_CODE_SLOW;
                break;
            case MEDIUM:
            case SPACESHIP_SPEED_MEDIUM:
                spdCode = SPEED_CODE_MEDIUM;
                break;
            case FAST:
            case SPACESHIP_SPEED_FAST:
                spdCode = SPEED_CODE_FAST;
                break;
            default:
                ConsoleUtil.show("Invalid SPD Message");
        }

        switch (msg.chrg) {
            case undefined:
            case null:
                chrgCode = CHARGE_CODE_NULL;
                break;
            case SLOW:
            case CHARGE_RATE_SLOW:
                chrgCode = CHARGE_CODE_SLOW;
                break;
            case MEDIUM:
            case CHARGE_RATE_MEDIUM:
                chrgCode = CHARGE_CODE_MEDIUM;
                break;
            case FAST:
            case CHARGE_RATE_FAST:
                chrgCode = CHARGE_CODE_FAST;
                break;
            default:
                ConsoleUtil.show("Invalid CHRG Message");
        }


        pwrCode = msg.pwr ? msg.pwr.toString(2) : "11111111"
        code = idCode + cmdCode + spdCode + chrgCode + pwrCode;
        // ConsoleUtil.show("SENDING CODE:" + code);
        return code;
    },

    decompile: function(code) {
        var idCode = code.substring(0, 2);
        var cmdCode = code.substring(2, 4);
        var spdCode = code.substring(4, 6);
        var chrgCode = code.substring(6, 8);
        var pwrCode = code.substring(8, 16);
        var id = parseInt(idCode, 2);
        var cmd = null;
        var spd = null;
        var chrg = null;
        var pwr = null;
        switch (cmdCode) {
            case LAUNCH_CODE:
                cmd = LAUNCH;
                break;
            case FLY_CODE:
                cmd = FLY;
                break;
            case STOP_CODE:
                cmd = STOP;
                break;
            case DESTROY_CODE:
                cmd = DESTROY;
                break;
            default:
                ConsoleUtil.show("Invalid CMD Code");
        }


        switch (spdCode) {
            case SPEED_CODE_NULL:
                spd = null;
                break;
            case SPEED_CODE_SLOW:
                spd = SPACESHIP_SPEED_SLOW;
                break;
            case SPEED_CODE_MEDIUM:
                spd = SPACESHIP_SPEED_MEDIUM;
                break;
            case SPEED_CODE_FAST:
                spd = SPACESHIP_SPEED_FAST;
                break;
            default:
                ConsoleUtil.show("Invalid SPD Code");
        }

        switch (chrgCode) {
            case CHARGE_CODE_NULL:
                chrg = null;
                break;
            case CHARGE_CODE_SLOW:
                chrg = CHARGE_RATE_SLOW;
                break;
            case CHARGE_CODE_MEDIUM:
                chrg = CHARGE_RATE_MEDIUM;
                break;
            case CHARGE_CODE_FAST:
                chrg = CHARGE_RATE_FAST;
                break;
            default:
                ConsoleUtil.show("Invalid CHRG Code");
        }

        pwr = pwrCode == "11111111" ? null : parseInt(pwrCode, 2);
        return new Message(id, cmd, spd, chrg, pwr);
    },

    interpret: function(msg) {
        var info = { spd_type:null, chrg_type:null };
        switch (msg.spd) {
            case SPACESHIP_SPEED_SLOW:
                info.spd_type = SLOW;
                break;
            case SPACESHIP_SPEED_MEDIUM:
                info.spd_type = MEDIUM;
                break;
            case SPACESHIP_SPEED_FAST:
                info.spd_type = FAST;
                break;
            default:
                ConsoleUtil.show("Invalid SPD MESSAGE");
        }
        switch (msg.chrg) {
            case CHARGE_RATE_SLOW:
                info.chrg_type = SLOW;
                break;
            case CHARGE_RATE_MEDIUM:
                info.chrg_type = MEDIUM;
                break;
            case CHARGE_RATE_FAST:
                info.chrg_type = FAST;
                break;
            default:
                ConsoleUtil.show("Invalid CHRG MESSAGE");
        }
        return info;
    }
};

module.exports = MessageAdapter;
