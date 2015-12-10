<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
session_start();
date_default_timezone_set('Asia/Tokyo');

function setNotification($message, $user_id) {
    try {
        $dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8', 'meganeshibu', 'DBmaster777', array(PDO::ATTR_EMULATE_PREPARES => false));
    } catch (PDOException $e) {
        exit('データベース接続失敗。' . $e->getMessage());
    }
    $registTime = new DateTime();
    $sql = "insert into NotificationTable(UserID, NotificationInfo, RegistTime) values('" . $user_id . "',' " . $message . "',' " . $registTime->format('Y-m-d H:i:s') ."')";
    $stmt = $dbh->query($sql);
    
    $dbh = null;
}

if (filter_input(INPUT_POST, "message") != NULL) {
    $message = filter_input(INPUT_POST, "message");
    $id = $_SESSION["user_id"];
    
    setNotification($message, $id);
}

?>