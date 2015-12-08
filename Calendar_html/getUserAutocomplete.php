<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

try {
    $dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8', 'meganeshibu', 'DBmaster777', array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
    exit('データベース接続失敗。' . $e->getMessage());
}

$result = null;

if(filter_input(INPUT_POST, 'input')) {
    $input = filter_input(INPUT_POST, 'input');
    $sql = "select UserName from UserTable where UserName like '" . $input . "%'";
    $stmt = $dbh->query($sql);
    while($row = $stmt->fetchObject()) {
        $result[] = $row->UserName;
    }
}

$dbh = null;

echo json_encode($result);
?>