/*
 * @Author: dontry
 * @Date:   2016-04-14 22:38:46
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-04-15 23:01:41
 */
require("./variable");

function buttonHandler(commander) {
    $(".wrapper .btn").on("click", function() {
        var cmdName = $(this).attr("name");
        var id = $(this).parent().index();
        var cmd = cmdName;
        switch (cmd) {
            case LAUNCH:
                $(".panel-option").show();
                $(".mask").show();
                spaceshipSelection(id, cmd)
                return true;
            case FLY:
            case STOP:
            case DESTROY:
                var message = new Message(id, cmd);
                commander.send(message);
                break;
            default:
                alert("INVALID COMMAND!");
                return false;
        }
        return true;
    });


    var spaceshipSelection = function(id, cmd) {
        $("#confirm").on("click", function() {
            var spd = $("input[type='radio'][name='speed']:checked").val();
            var chrg = $("input[type='radio'][name='power']:checked").val();
            $(".panel-option").hide();
            $(".mask").hide();
            var message = new Message(id, cmd, spd, chrg);
            commander.send(message);
            $("#confirm").off();
            $("#cancel").off();
        });

        $("#cancel").on("click", function() {
            $(".panel-option").hide();
            $(".mask").hide();
            $("#confirm").off();
            $("#cancel").off();
        });
    };
};

module.exports.buttonHandler = buttonHandler;
