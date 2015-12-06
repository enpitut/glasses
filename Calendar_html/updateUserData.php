<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//設定画面で設定したユーザ情報を保存する
//現時点ではそれぞれ用意したtxtファイルに保存
try {
    $dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8', 'meganeshibu', 'DBmaster777', array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
    exit('データベース接続失敗。' . $e->getMessage());
}

$target_element = "";
$target = "";
$text = "";
$id = filter_input(INPUT_POST, "id");
$result = array('error' => NULL);
$flag = true;
if (filter_input(INPUT_POST, "new_account_name") !== NULL) {
    $target_element = "#account_name";
    $target = "UserName";
    $text = filter_input(INPUT_POST, "new_account_name");
} else if (filter_input(INPUT_POST, "new_mail_addr") !== NULL) {
    $target_element = "#mail_addr";
    $target = "Mail";
    $text = filter_input(INPUT_POST, "new_mail_addr");
} else if (filter_input(INPUT_POST, "new_pass") !== NULL) {
    $target_element = "#password";
    $target = "UserPass";
    $text = filter_input(INPUT_POST, "new_pass");
    $old_pass = filter_input(INPUT_POST, "pass");

    $sql = 'select UserID, UserPass from UserTable where UserName="' . $account . '"';
    $stmt = $dbh->query($sql);
    if ($row = $stmt->fetchObject()) {
        if ($row->UserPass != $old_pass) {
            $flag = false;
            $result['error'] = 'パスワードが違います';
        }
    }
}

if ($flag) {
    $sql = 'update UserTable set ' . $target . ' = "' . $text . '" where UserId = "' . $id . '"';
    $stmt = $dbh->query($sql);
    
    $result += array('target' => $target_element, 'text' => $text);
}

echo json_encode($result);
$dbh = null;
?>