<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

session_start();
$id = $_SESSION["user_id"];
$result = null;

try {
    $dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8', 'meganeshibu', 'DBmaster777', array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
    exit('データベース接続失敗。' . $e->getMessage());
}

$sql = "select NotificationInfo from NotificationTable where UserID = '". $id . "' order by RegistTime";
$stmt = $dbh->query($sql);
while($row = $stmt->fetchObject()) {
    $result[] = $row->NotificationInfo;
}

echo json_encode($result);
?>