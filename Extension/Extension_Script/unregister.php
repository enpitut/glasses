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

$userId = filter_input(INPUT_POST, "userId");

$sql = "update UserTable set NotificationID = '' where UserId = '" . $userId . "'";
if ($stmt = $dbh->query($sql)) {
    echo "success";
} else {
    echo "error";
}

$dbh = null;
?>