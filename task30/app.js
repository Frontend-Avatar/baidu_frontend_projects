(function() {
    var lenReg = /^.{4,16}$/;
    var chnReg = /[^\x00-\xff]/g;
    var pwdReg = /^[\d|\w]{8,16}$/;
    var mobileReg = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
    var mailReg = /^([a-zA-Z0_9_-])+@([a-zA-Z0_9_-])+(.[a-zA-Z0_9_-])+/;


    /**
     * [msgs 验证信息提示内容]
     * @param  {[type]} fieldname [字段名]
     * @return {[type]}      [description]
     */
    var msgs = function(fieldname) {
        return {
            error_required: {
                "msg": (function(n) {
                    return n + "不能为空";
                })(fieldname),
                "className": "error"
            },
            error_length: {
                "msg": "长度为4~16个字符",
                "className": "error"
            },
            error_invalidPassword: {
                "msg": "密码格式不正确",
                "className": "error"
            },
            error_inconsistentPassword: {
                "msg": "两次输入密码不一致",
                "className": "error"
            },
            error_invalidMail: {
                "msg": "邮箱格式不正确",
                "className": "error"
            },
            error_invalidMobile: {
                "msg": "手机格式输入不正确",
                "className": "error"
            },
            correct: {
                "msg": "填写格式正确",
                "className": "correct"
            }
        };

    };

    var validateResults = {};


    function $(element) {
        if (typeof element != "string") return;

        if (element.indexOf("#") == 0) {
            return document.getElementById(element.substring(1));
        }

        if (element.indexOf(".") == 0) {
            return document.getElementsByClassName(element.substring(1));
        }

    }

    /**
     * [inputHandler description]
     * @return {[type]} [description]
     */
    var inputHandler = function() {
        var $inputBox = $(".input-content");
        for (var i = 0; i < $inputBox.length; i++) {
            $inputBox[i].addEventListener("focus", function() {
                this.nextElementSibling.style.visibility = "visible";
            });
            $inputBox[i].addEventListener("blur",
                function() {
                    isValidate.apply(this);
                });

        }

        var $form = $("#myForm");
        $form.addEventListener("submit", function(event) {
            var submitSuccess = true;
            for (p in validateResults) {
                if (validateResults[p] !== msgs().correct.msg) {
                    submitSuccess = false;
                    break;
                }
            }
            if (submitSuccess) {
                alert("提交成功");
            } else {
                alert("提交失败");
            }

        });

        /**
         * [isValidate 验证格式是否正确]
         * @return {Boolean} [验证正确则返回ture，否则返回false]
         */
        var isValidate = function() {
            var fieldname = this.name;
            var srcVal = this.value;
            var testVal = srcVal.trim();
            var testStr = testVal.replace(chnReg, "--"); //由于中文字占2个字节，因此判断到是中文后，用两个字符代替
            var tip = msgs(fieldname);   
            var validate = null;
            if (testStr.length === 0) {
                validate = tip.error_required;
            } else {
                switch (fieldname) {  //根据字段名返回相应的验证提示内容
                    case "名称":
                        if (!lenReg.test(testStr)) {
                            validate = tip.error_length;
                        } else {
                            validate = tip.correct;
                        }
                        break;
                    case "密码":
                        if (!pwdReg.test(testStr)) {
                            validate = tip.error_invalidPassword;
                        } else {
                            validate = tip.correct;
                        }
                        break;
                    case "密码确认":
                        var pwdVal = $("#password").value;
                        if (pwdVal != testVal) {
                            validate = tip.error_inconsistentPassword;
                        } else {
                            validate = tip.correct;
                        }
                        break;
                    case "邮箱":
                        if (!mailReg.test(testStr)) {
                            validate = tip.error_invalidMail;
                        } else {
                            validate = tip.correct;
                        }
                        break;
                    case "手机":
                        if (!mobileReg.test(testStr)) {
                            validate = tip.error_invalidMobile;
                        } else {
                            validate = tip.correct;
                        }
                        break;
                    default:
                        alert("非法字符");
                }
            }
            validateResults[fieldname] = validate.msg;
            renderInput(this, validate);
        };
    };

    /**
     * [renderInput description]
     * @param  {[type]} ele      [description]
     * @param  {[type]} validate [description]
     * @return {[type]}          [description]
     */
    var renderInput = function(ele, validate) {
        ele.className = "input-content " + validate.className;
        ele.nextElementSibling.className = "tip " + validate.className;
        ele.nextElementSibling.innerText = validate.msg;
    };

    inputHandler();
})();
