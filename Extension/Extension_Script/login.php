<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

header("Access-Control-Allow-Origin:*");


try {
    $dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8', 'meganeshibu', 'DBmaster777', array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
    exit('データベース接続失敗。' . $e->getMessage());
}

$account = filter_input(INPUT_POST, "account");
$pass = filter_input(INPUT_POST, "password");
$result = array(
    'name' => null,
    'mail' => null,
    'id' => null
);

$sql = 'select UserID, UserPass, Mail from UserTable where UserName="' . $account . '"';
$stmt = $dbh->query($sql);

while ($row = $stmt->fetchObject()) {
    if ($row->UserPass == $pass) {
        $result['id'] = $row->UserID;
        $result['mail'] = $row->Mail;
        $result['name'] = $account;
    }
}

echo json_encode($result);
?>
