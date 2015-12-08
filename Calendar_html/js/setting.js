/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    // ユーザデータ表示更新
    function rewriteData(element, text) {
        if ($(element).attr('id') === 'password') {
            var word_count = "";
            for (i = 0; i < text.length; i++) {
                word_count += '*';
            }
            $(element).text(word_count);
        } else {
            $(element).text(text);
        }
    }
    ;

    // ユーザ情報更新
    function updateUserData(dialog) {
        var $form = $(dialog).find('form');
        var $button = $(dialog).next('.ui-dialog-buttonpane').find('button');

        $(document).getUserId().done(function (id) {
            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method'),
                data: $form.serialize() + '&id=' + id,
                dataType: 'json',
                beforSend: function (xhr, settings) {
                    $button.attr('disabled', true);
                },
                complete: function (xhr, textStatus) {
                    $button.attr('disabled', false);
                },
                success: function (result) {
                    if (result !== 'success') {
                        alert(result["error"]);
                    } else {
                        rewriteData(result["target"], result["text"]);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('読み込み失敗');
                }
            });
        }).fail(function (id) {
            alert('error');
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

    // クラスタ取得
    function getCluster(id) {
        $.ajax({
            type: "POST",
            url: "getCluster.php",
            dataType: "json",
            data: {id: id},
            success: function (data, dataType) {
                if (data === null)
                    alert('クラスタ情報が見つかりませんでした');
                // クラスタ情報入力
                $.each(data, function (key, value) {
                    if (value.ClusterState === 0) {
                        $(cluster_bar.replace('クラスタ名', value.ClusterName).replace('説明', value.ClusterInfo).replace('クラスタID', value.ClusterID)).appendTo('#cluster_joined .cluster');
                        var details = $('#cluster_joined .cluster li:last .cluster_details .cluster_member');
                        $(value.ClusterMember).each(function () {
                            $('<li>' + this + '</li>').appendTo(details);
                        });
                    } else if (value.ClusterState === 1) {
                        $(cluster_bar.replace('クラスタ名', value.ClusterName).replace('説明', value.ClusterInfo).replace('クラスタID', value.ClusterID)).appendTo('#cluster_invited .cluster');
                        var details = $('#cluster_invited .cluster li:last .cluster_details .cluster_member');
                        $(value.ClusterMember).each(function () {
                            $('<li>' + this + '</li>').appendTo(details);
                        });
                    }
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Error : ' + XMLHttpRequest + textStatus + errorThrown);
            }
        });
    }

    // クラスタ管理
    function manageCluster(dialog) {
        var $form = $(dialog).find('form');
        var $button = $(dialog).next('.ui-dialog-buttonpane').find('button');
        var cluster_id = $form.find('input[name="cluster_id"]').val();

        $(document).getUserId().done(function (id) {
            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method'),
                data: $form.serialize() + '&id=' + id + '&cluster_id=' + cluster_id,
                beforSend: function (xhr, settings) {
                    $button.attr('disabled', true);
                },
                complete: function (xhr, textStatus) {
                    $button.attr('disabled', false);
                },
                success: function (result) {
                    if (result === 'success') {
                        alert('処理が完了しました');
                        $('.cluster li').remove();
                        getCluster(id);
                    } else {
                        alert(result);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('読み込み失敗');
                }
            });
        }).fail(function (id) {
            alert('error');
        });
    }
    ;

    $(document).ready(function () {
    // アカウント・クラスタ情報読み込み
        $(document).getUserId().done(function (result) {
            if (result) {
                // アカウント情報取得
                $.ajax({
                    type: "POST",
                    url: "getUserData.php",
                    dataType: "json",
                    data: {query: "select * from UserTable where UserID = '" + result + "'"},
                    success: function (data, dataType) {
                        if (data === null)
                            alert('ユーザデータが見つかりませんでした');
                        // アカウント名取得
                        rewriteData($('#account_name'), data[0].UserName);
                        rewriteData($('#password'), data[0].UserPass);
                        rewriteData($('#mail_addr'), data[0].UserMail);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert('Error : ' + XMLHttpRequest + textStatus + errorThrown);
                    }
                });

                // クラスタ情報取得
                getCluster(result);
            }
        }).fail(function (result) {
            alert('error');
        });
        
        $('#invite_user').autocomplete({
            source: function(request, response) {
                $.ajax({
                    type: "POST",
                    url: "getUserAutocomplete.php",
                    cache: false,
                    dataType: "json",
                    data: {input: request.term},
                    success: function (data) {
                        response(data);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        response(['']);
                    }
                });
            }
        });
    });

    // クラスタのバーがクリックされた際の処理
    $(document).on('click', '.cluster_bar:not(button)', function (e) {
        var target = e.target;
        if (target.tagName !== 'BUTTON') {
            $(this).next('.cluster_details').slideToggle();
        }
    });

    // ダイアログのバリデーション
    $('form').validationEngine();


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
                        updateUserData($(this));
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
                        updateUserData($(this));
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
                        updateUserData($(this));
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
                    manageCluster($(this));
                    $(this).dialog('close');
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
    $.extend(dialog_option, cluster_button);
    $('#dialog_create_cluster').dialog(dialog_option);
    $('#dialog_create_cluster').dialog('option', {title: '新規クラスタ作成'});

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
        var cluster_id = $(this).parents('.cluster_bar').attr('name');
        $('#dialog_cluster_invite').find('input[name="cluster_id"]').val(cluster_id);
    });
    $(document).on('click', '#cluster_joined .minus_button', function () {
        $('#dialog_cluster_leave').dialog('open');
        var cluster_id = $(this).parents('.cluster_bar').attr('name');
        $('#dialog_cluster_leave').find('input[name="cluster_id"]').val(cluster_id);
    });
    $(document).on('click', '#cluster_invited .plus_button', function () {
        $('#dialog_cluster_join').dialog('open');
        var cluster_id = $(this).parents('.cluster_bar').attr('name');
        $('#dialog_cluster_join').find('input[name="cluster_id"]').val(cluster_id);
    });
    $(document).on('click', '#cluster_invited .minus_button', function () {
        $('#dialog_cluster_refuse').dialog('open');
        var cluster_id = $(this).parents('.cluster_bar').attr('name');
        $('#dialog_cluster_refuse').find('input[name="cluster_id"]').val(cluster_id);
    });

    // ダイアログのフォームがサブミットされた際の処理
    $('.dialog_form').submit(function (evt) {
        evt.preventDefault();
        $(this).parents('.ui-dialog').find('.btn_positive').click();
    });
});
