<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

session_start();
session_regenerate_id();

$command = filter_input(INPUT_POST, "command");

if ($command == 'checkLogin') {
    if (isset($_SESSION["user_id"])) {
        echo $_SESSION["user_id"];
    } else {
        echo false;
    }
} else if ($command == 'getUserId') {
    if (isset($_SESSION["user_id"])) {
        echo $_SESSION["user_id"];
    } else {
        echo false;
    }
} else if ($command == 'checkIntro') {
    try {
        $dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8', 'meganeshibu', 'DBmaster777', array(PDO::ATTR_EMULATE_PREPARES => false));
    } catch (PDOException $e) {
        exit('データベース接続失敗。' . $e->getMessage());
    }
    $flag = '';
    $sql = "select Intro from UserTable where UserID = '" . $_SESSION['user_id'] . "'";
    $stmt = $dbh->query($sql);
    while($row = $stmt->fetchObject()) {
        $flag =  $row->Intro;
    }
    if($flag == 0) {
        $sql = "update UserTable set Intro = 1 where UserID = '" . $_SESSION['user_id'] . "'";
        $stmt = $dbh->query($sql);
    }
    
    echo $flag;
} else {
    echo false;
}
