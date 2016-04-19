//Data Center数据中心
var DataCenter = (function() {
    var $tbody = $("#monitor table>tbody");

    var addInfo = function(msg) {
        var info = MessageAdapter.interpret(msg);
        $tr = $("<tr></tr>");
        $tr.addClass("item-sp");
        $tr.attr("id", "sp" + msg.id);
        $tr.append("<td>" + msg.id + "</td>");
        $tr.append("<td>" + info.spd_type + "</td>");
        $tr.append("<td>" + info.chrg_type + "</td>");
        $tr.append("<td>" + msg.cmd + "</td>");
        $tr.append("<td>" + msg.pwr + "</td>");

        $tbody.append($tr);
    };

    var removeInfo = function(msg) {
        var id = msg.id;

        var $tr = $("#sp" + id);
        $tr.remove();
    };

    var updateInfo = function(msg) {
        var $tds = $("#sp" + msg.id).children("td");
        $tds.eq(3).text(msg.cmd);
        $tds.eq(4).text(parseInt(msg.pwr));
    };

    var receive = function(code) {
        var msg = MessageAdapter.decompile(code);
        switch (msg.cmd) {
            case "stop":
                if ($("#sp" + msg.id).length == 0) {
                    addInfo(msg);
                    break;
                }
            case "fly":
                updateInfo(msg);
                break;
            case "destroy":
                removeInfo(msg);
                break;
            default:
                ConsoleUtil.show("Invalid Data");
        }
    }

    return {
        receive: receive
    }
})();
