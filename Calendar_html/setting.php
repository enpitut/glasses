<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/setting.css">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
        <script src="js/setting.js"></script>
    </head>
    <body>
        <header>
            <a href=""><img src="taskru_rogo_kakkokari.png"></a>
        </header>
        <article>
            <h1>設定画面</h1>
            <div id="tab">
                <ul>
                    <li><a href="#setting_account"><span class="tab_name">アカウント</span></a></li>
                    <li><a href="#setting_cluster"><span class="tab_name">クラスタ</span></a></li>
                </ul>
                <article id="setting_account">
                    <h2>アカウント設定</h2>
                    <ul>
                        <li>
                            <p>アカウント名</p>
                            <span id="account_name"></span>
                            <button type="button" name="account" class="dialog_button">変更</button>
                        </li>
                        <li>
                            <p>パスワード</p>
                            <span id="password">*************</span>
                            <button type="button" name="pass" class="dialog_button">変更</button>
                        </li>
                        <li>
                            <p>メールアドレス</p>
                            <span id="mail_addr"></span>
                            <button type="button" name="mail" class="dialog_button">変更</button>
                        </li>
                    </ul>
                    <div id="dialog_account">
                        <form id="form_account" action="save_user_info.php" method="POST">
                            <ul>
                                <li>
                                    <label for="new_account_name" class="form_content">新しいアカウント名</label>
                                    <input type="text" name="new_account_name" id="new_account_name">
                                </li>
                            </ul>
                        </form>
                    </div>
                    <div id="dialog_pass">
                        <form id="form_pass" action="save_user_info.php" method="POST">
                            <ul>
                                <li>
                                    <label for="pass_text" class="form_content">現在のパスワード</label>
                                    <input type="password" name="pass" id="pass_text">
                                </li>
                                <li>
                                    <label for="new_pass_text" class="form_content">新しいパスワード</label>
                                    <input type="password" name="new_pass" id="new_pass_text">
                                </li>
                                <li>
                                    <label for="confirm_pass_text" class="form_content">新しいパスワードの確認</label>
                                    <input type="password" name="confirm" id="confirm_pass_text">
                                </li>
                            </ul>
                        </form>
                    </div>
                    <div id="dialog_mail">
                        <form id="form_mail" action="save_user_info.php" method="POST">
                            <ul>
                                <li>
                                    <label for="new_mail_addr" class="form_content">新しいメールアドレス</label>
                                    <input type="text" name="new_mail_addr" id="new_mail_addr">
                                </li>
                            </ul>
                        </form>
                    </div>
                </article>

                <article id="setting_cluster">
                    <h2>クラスタ設定</h2>
                    <section id="cluster_joined">
                        <h3>所属クラスタ</h3>
                        <ul class="cluster">
                        </ul>
                        <button type="button" id="new_cluster">新規作成</button>
                        <div id="dialog_create_cluster">
                            <form id="form_create_cluster">
                                <p>クラスタを新規作成します</p>
                                <ul>
                                    <li>
                                        <label for="new_cluster_name" class="form_content">クラスタ名</label>
                                        <input type="text" name="new_cluster_name" id="new_cluster_name">
                                    </li>
                                    <li>
                                        <label for="cluster_explanation" class="form_content">クラスタ説明</label>
                                        <textarea name="cluster_explanation" id="cluster_explanation"></textarea>
                                    </li>
                                </ul>
                            </form>
                        </div>
                    </section>
                    <section id="cluster_invited">
                        <h3>招待されているクラスタ</h3>
                        <ul class="cluster">
                        </ul>
                    </section>
                    <div id="dialog_cluster_invite">
                        <form id="form_cluster_invite">
                            <label for="invite_user">このクラスタに招待するユーザを入力してください</label>
                            <input type="text" name="invite_name" id="invite_user">
                        </form>
                    </div>
                    <div id="dialog_cluster_leave">
                        <form id="form_cluster_leave">
                            このクラスタから脱退します<br>
                            よろしいですか？
                        </form>
                    </div>
                    <div id="dialog_cluster_join">
                        <form id="form_cluster_join">
                            このクラスタに参加します<br>
                            よろしいですか？
                        </form>
                    </div>
                    <div id="dialog_cluster_refuse">
                        <form id="form_cluster_refuse">
                            このクラスタに参加しません<br>
                            よろしいですか？
                        </form>
                    </div>
                </article>
            </div>
        </article>
    </body>
</html>
