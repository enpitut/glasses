/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {
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
    $(document).ready(function() {
        $.getJSON("cluster.json", function(data) {
            $.each(data.joined, function(key, value) {
                $(cluster_bar.replace('クラスタ名', value.name).replace('説明', value.text).replace('クラスタID', key)).appendTo('#cluster_joined .cluster');
                var details = $('#cluster_joined .cluster li:last .cluster_details .cluster_member');
                $(value.member).each(function() {
                    $('<li>'+this+'</li>').appendTo(details);
                });
            });
            $.each(data.invited, function(key, value) {
                $(cluster_bar.replace('クラスタ名', value.name).replace('説明', value.text).replace('クラスタID', key)).appendTo('#cluster_invited .cluster');
                var details = $('#cluster_invited .cluster li:last .cluster_details .cluster_member');
                $(value.member).each(function() {
                    $('<li>'+this+'</li>').appendTo(details);
                });
            });
        });
    });
    
    // クラスタのバーがクリックされた際の処理
    $(document).on('click', '.cluster_bar:not(button)', function(e){
        var target = e.target;
        if(target.tagName !== 'BUTTON') {
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

    var button_account = {
        buttons: [
            {
                text: '登録',
                class: 'btn_positive',
                click: function() {
                }
            },
            {
                text: 'キャンセル',
                class: 'btn_delete',
                click: function() {
                    $(this).dialog('close');
                }
            }
        ]
    };

    var button_cluster = {
        buttons: [
            {
                text: 'はい',
                class: 'btn_positive',
                click: function() {
                }
            },
            {
                text: 'キャンセル',
                class: 'btn_delete',
                click: function() {
                    $(this).dialog('close');
                }
            }
        ]
    };

    // アカウント情報変更用ダイアログを定義
    $.extend(dialog_option, button_account);
    $('#dialog_account').dialog(dialog_option);
    $('#dialog_account').dialog('option', {title: 'アカウント名変更'});

    $('#dialog_pass').dialog(dialog_option);
    $('#dialog_pass').dialog('option', {title: 'パスワード変更'});

    $('#dialog_mail').dialog(dialog_option);
    $('#dialog_mail').dialog('option', {title: 'メールアドレス変更'});

    // クラスタ情報変更用ダイアログを定義
    $('#dialog_create_cluster').dialog(dialog_option);
    $('#dialog_create_cluster').dialog('option', {title: '新規クラスタ作成'});
    
    $.extend(dialog_option, button_cluster);
    $('#dialog_cluster_invite').dialog(dialog_option);
    $('#dialog_cluster_invite').dialog('option', {title: 'ユーザ招待'});
    
    $('#dialog_cluster_leave').dialog(dialog_option);
    $('#dialog_cluster_leave').dialog('option', {title: 'クラスタ脱退'});
    
    $('#dialog_cluster_join').dialog(dialog_option);
    $('#dialog_cluster_join').dialog('option', {title: 'クラスタ招待'});
    
    $('#dialog_cluster_refuse').dialog(dialog_option);
    $('#dialog_cluster_refuse').dialog('option', {title: 'クラスタ招待'});

    // ダイアログ表示ボタンが押された際の処理
    $('button[name="account"]').click(function() {
        $('#dialog_account').dialog('open');
    });
    $('button[name="pass"]').click(function() {
        $('#dialog_pass').dialog('open');
    });
    $('button[name="mail"]').click(function() {
        $('#dialog_mail').dialog('open');
    });

    // クラスタ関連ボタンが押された際の処理
    $(document).on('click', '#new_cluster', function() {
        $('#dialog_create_cluster').dialog('open');
    });
    $(document).on('click', '#cluster_joined .plus_button', function() {
        $('#dialog_cluster_invite').dialog('open');
    });
    $(document).on('click', '#cluster_joined .minus_button', function() {
        $('#dialog_cluster_leave').dialog('open');
    });
    $(document).on('click', '#cluster_invited .plus_button', function() {
        $('#dialog_cluster_join').dialog('open');
    });
    $(document).on('click', '#cluster_invited .minus_button', function() {
        $('#dialog_cluster_refuse').dialog('open');
    });

    // ユーザ情報変更フォームがサブミットされた際の処理
    $('#form_account').submit(function() {
    });

    // クラスタ情報変更フォームがサブミットされた際の処理
    $('#form_cluster').submit(function() {
    });
});
