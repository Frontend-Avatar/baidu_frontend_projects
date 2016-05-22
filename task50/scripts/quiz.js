/*
 * @Author: dontry
 * @Date:   2016-05-02 13:14:20
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-05-21 10:22:23
 */

'use strict';

;
$(document).ready(function() {
    var $question = null;
    var question_type = -1;

    $('.btn.publish').on('click', function() {
        $('#dialog-publish').modal();
    });
    $('.btn-add').on('click', function() {
        $('#dialog-editor').modal();
    });
    $('.question .remove').on('click', function() {
        $question = $(this).parents('.question');
        $('#dialog-delete').modal();
    });
    $('#dialog-delete').on('show.bs.modal', function() {
        $('#dialog-delete .btn.confirm').on('click', function() {
            $question.remove();
            $('#dialog-delete').modal('hide');
        });
    });
    $('#dialog-editor').on('hide.bs.modal', function(){
        $('#dialog-editor .modal-body ul').html('');
    });

    $('#dialog-editor  .add-option').on('click', function() {
        if (question_type === Constants.MULTI) {
            $('#dialog-editor .option-list').append(
                '<li><input type="checkbox"><span class="editable">请输入选项内容</span><button class="cancel btn btn-xs remove-option">-</button></li>');
        }else if(question_type === Constants.SINGLE) {
            $('#dialog-editor .option-list').append(
                '<li><input type="radio"><span class="editable">请输入选项内容</span><button class="cancel btn btn-xs remove-option">-</button></li>');
        }
        $('#dialog-editor .editable').on('click', function() {
            edit(this);
        });
        $('#dialog-editor .remove-option').on('click', function() {
            $(this).parent().remove();
        });
    });

    $('#dialog-editor .remove-option').on('click', function() {
        $(this).parent().remove();
    });

    $('#dialog-editor .btn.confirm').on('click', function() {
        var fields = getQuestionJSON($('#dialog-editor'));
        console.log(fields);
        $('#dialog-editor').modal('hide');
        // debugger;
        var questionView = new app.QuestionView(fields);
        // debugger
        $('#question-list').append(questionView.$el);
        $('.question .remove').on('click', function() {
            $question = $(this).parents('.question');
            $('#dialog-delete').modal();
        });
    });


    $('.editable').on('click', function() {
        edit(this);
    });

    $('.question-add .btn-group-question .btn').on('click', function() {
        $(this).addClass('cur').siblings().removeClass('cur');
        $('.question-add .btn-add').removeAttr('disabled');
        if ($(this).hasClass('single')) {
            question_type = Constants.SINGLE;
        } else if ($(this).hasClass('multi')) {
            question_type = Constants.MULTI;
        }
    });

    function edit(self) {
        var td = $(self);
        var txt = td.text();
        var input = $('<input type="text" value = "' + txt + '" />');
        console.log('editing');
        td.html(input);
        input.click(function() {
            return false;
        });
        input.trigger('focus');
        input.blur(function() {
            var newTxt = $(this).val();
            td.html(newTxt);
        });
        input.keypress(function(evt) {
            if (evt.keyCode === 13 || evt.keyCode === 9) {
                input.trigger('blur');
            }
        });
    }

    function getQuestionJSON($target) {
        var question = {};
        question.title = $target.find('.title').text();
        question.index = $('.question').length + 1;
        question.options = [];
        question.type = question_type;
        var $options = $target.find('.option-list li');
        for (var i = 0; i < $options.length; i++) {
            var opt = {
                name: $($options[i]).find('input').attr('name'),
                value: $($options[i]).find('input').val(),
                content: $($options[i]).find('.editable').text()
            };
            question.options.push(opt);
        }
        question.option_count = question.options.length;
        // debugger;
        return question;
    }
});
