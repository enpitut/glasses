/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    // ダイアログ操作後の表示更新
    function rewriteText(element, file) {
        $.get(file, function (data) {
            if ($(element).attr('id') === 'password') {
                var word_count = "";
                for (i = 0; i < data.length; i++) {
                    word_count += '*';
                }
                $(element).text(word_count);
            } else {
                $(element).text(data);
            }
        });
    }

    // ファイル書き換え
    function writeFile(dialog) {
        var $form = $(dialog).find('form');
        var $button = $(dialog).next('.ui-dialog-buttonpane').find('button');

        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: $form.serialize(),
            dataType: 'json',
            beforSend: function (xhr, settings) {
                $button.attr('disabled', true);
            },
            complete: function (xhr, textStatus) {
                $button.attr('disabled', false);
            },
            success: function (result) {
                if (result["error"] !== null) {
                    alert(result["error"]);
                } else {
                    rewriteText(result["target"], result["file"]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('読み込み失敗');
            }
        });
    }
    ;

    // タブを設定
    $('#tab').tabs();

    // クラスタ部分のHTML
    var cluster_bar = '\
        <li>\
            <div class="cluster_bar" name="クラスタID">\
                <span class="cluster_name">クラスタ名</span>\
                <div class="cluster_buttons">\
                    <button class="plus_button">+</button>\
                    <button class="minus_button">-</button>\
                </div>\
            </div>\
            <div class="cluster_details">\
                <span>説明</span>\
                <h4>メンバー</h4>\
                <ul class="cluster_member">\
                </ul>\
            </div>\
        </li>\
    ';

    // クラスタ読み込み
    $(document).ready(function () {
        // アカウント名取得
        rewriteText($('#account_name'), 'account.txt');
        rewriteText($('#password'), 'pass.txt');
        rewriteText($('#mail_addr'), 'mail.txt');

        $.getJSON("cluster.json", function (data) {
            $.each(data.joined, function (key, value) {
                $(cluster_bar.replace('クラスタ名', value.name).replace('説明', value.text).replace('クラスタID', key)).appendTo('#cluster_joined .cluster');
                var details = $('#cluster_joined .cluster li:last .cluster_details .cluster_member');
                $(value.member).each(function () {
                    $('<li>' + this + '</li>').appendTo(details);
                });
            });
            $.each(data.invited, function (key, value) {
                $(cluster_bar.replace('クラスタ名', value.name).replace('説明', value.text).replace('クラスタID', key)).appendTo('#cluster_invited .cluster');
                var details = $('#cluster_invited .cluster li:last .cluster_details .cluster_member');
                $(value.member).each(function () {
                    $('<li>' + this + '</li>').appendTo(details);
                });
            });
        });
    });

    // クラスタのバーがクリックされた際の処理
    $(document).on('click', '.cluster_bar:not(button)', function (e) {
        var target = e.target;
        if (target.tagName !== 'BUTTON') {
            $(this).next('.cluster_details').slideToggle();
        }
    });

    // ダイアログの共通設定
    var dialog_option = {
        autoOpen: false,
        modal: true,
        show: 'blind',
        hide: 'blind'
    };

    // ダイアログのボタン設定
    var account_button = {
        buttons: [
            {
                text: '登録',
                class: 'btn_positive',
                click: function () {
                    if ($('#new_account_name').val() !== "") {
                        writeFile($(this));
                        $(this).dialog('close');
                    } else {
                        alert('アカウント名を入力してください！');
                    }
                }
            },
            {
                text: 'キャンセル',
                class: 'btn_delete',
                click: function () {
                    $(this).dialog('close');
                }
            }
        ]
    };

    var pass_button = {
        buttons: [
            {
                text: '登録',
                class: 'btn_positive',
                click: function () {
                    if (($('#pass_text').val() === "") || ($('#new_pass_text').val() === "") || ($('#confirm_pass_text').val() === "")) {
                        alert('全項目を入力してください！');
                    } else {
                        writeFile($(this));
                        $(this).dialog('close');
                    }
                }
            },
            {
                text: 'キャンセル',
                class: 'btn_delete',
                click: function () {
                    $(this).dialog('close');
                }
            }
        ]
    };

    var mail_button = {
        buttons: [
            {
                text: '登録',
                class: 'btn_positive',
                click: function () {
                    if ($('#new_mail_addr').val() !== "") {
                        writeFile($(this));
                        $(this).dialog('close');
                    } else {
                        alert('メールアドレスを入力してください');
                    }
                }
            },
            {
                text: 'キャンセル',
                class: 'btn_delete',
                click: function () {
                    $(this).dialog('close');
                }
            }
        ]
    };

    var cluster_button = {
        buttons: [
            {
                text: 'はい',
                class: 'btn_positive',
                click: function () {
                }
            },
            {
                text: 'キャンセル',
                class: 'btn_delete',
                click: function () {
                    $(this).dialog('close');
                }
            }
        ]
    };

    // アカウント情報変更用ダイアログを定義
    $.extend(dialog_option, account_button);
    $('#dialog_account').dialog(dialog_option);
    $('#dialog_account').dialog('option', {title: 'アカウント名変更'});

    $.extend(dialog_option, pass_button);
    $('#dialog_pass').dialog(dialog_option);
    $('#dialog_pass').dialog('option', {title: 'パスワード変更'});

    $.extend(dialog_option, mail_button);
    $('#dialog_mail').dialog(dialog_option);
    $('#dialog_mail').dialog('option', {title: 'メールアドレス変更'});

    // クラスタ情報変更用ダイアログを定義
    $('#dialog_create_cluster').dialog(dialog_option);
    $('#dialog_create_cluster').dialog('option', {title: '新規クラスタ作成'});

    $.extend(dialog_option, cluster_button);
    $('#dialog_cluster_invite').dialog(dialog_option);
    $('#dialog_cluster_invite').dialog('option', {title: 'ユーザ招待'});

    $('#dialog_cluster_leave').dialog(dialog_option);
    $('#dialog_cluster_leave').dialog('option', {title: 'クラスタ脱退'});

    $('#dialog_cluster_join').dialog(dialog_option);
    $('#dialog_cluster_join').dialog('option', {title: 'クラスタ招待'});

    $('#dialog_cluster_refuse').dialog(dialog_option);
    $('#dialog_cluster_refuse').dialog('option', {title: 'クラスタ招待'});

    // ダイアログ表示ボタンが押された際の処理
    $('button[name="account"]').click(function () {
        $('#dialog_account').dialog('open');
        $('#new_account_name').val($('#account_name').text());
    });
    $('button[name="pass"]').click(function () {
        $('#dialog_pass').dialog('open');
    });
    $('button[name="mail"]').click(function () {
        $('#dialog_mail').dialog('open');
        $('#new_mail_addr').val($('#mail_addr').text());
    });

    // クラスタ関連ボタンが押された際の処理
    $(document).on('click', '#new_cluster', function () {
        $('#dialog_create_cluster').dialog('open');
    });
    $(document).on('click', '#cluster_joined .plus_button', function () {
        $('#dialog_cluster_invite').dialog('open');
    });
    $(document).on('click', '#cluster_joined .minus_button', function () {
        $('#dialog_cluster_leave').dialog('open');
    });
    $(document).on('click', '#cluster_invited .plus_button', function () {
        $('#dialog_cluster_join').dialog('open');
    });
    $(document).on('click', '#cluster_invited .minus_button', function () {
        $('#dialog_cluster_refuse').dialog('open');
    });

    // ユーザ情報変更フォームがサブミットされた際の処理
    $('#form_account').submit(function () {
    });

    // クラスタ情報変更フォームがサブミットされた際の処理
    $('#form_cluster').submit(function () {
    });
});
