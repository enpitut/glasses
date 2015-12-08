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
$id = filter_input(INPUT_POST, 'id');
$cluster_id = filter_input(INPUT_POST, 'cluster_id');
$command = filter_input(INPUT_POST, 'command');

if ($command == 'create') {
    $dbh->beginTransaction();
    try {
        $sql = "insert into ClusterInfoTable(ClusterName, ClusterInfo) values('" . filter_input(INPUT_POST, 'new_cluster_name') . "',' " . filter_input(INPUT_POST, 'cluster_explanation') . "')";
        $stmt = $dbh->query($sql);
        $cluster_id = $dbh->lastInsertId();
        $dbh->commit();
    } catch (Exception $e) {
        $dbh->rollBack();
        exit('クラスタ作成失敗' . $e->getMessage());
    }
    $sql = "insert into ClusterTable(ClusterID, UserID, State) values('" . $cluster_id . "',' " . $id . "','0')";
} else if ($command == 'invite') {
    $invited_name = filter_input(INPUT_POST, 'invite_name');
    $sql = "select UserID from UserTable where UserName = '" . $invited_name . "'";
    $stmt = $dbh->query($sql);
    while ($row = $stmt->fetchObject()) {
        $invite_id = $row->UserID;
    }
    if (!isset($invite_id)) {
        echo 'そのユーザは存在しません';
        $dbh = null;
        return;
    }
    $sql = "insert into ClusterTable(ClusterID, UserID, State) values ('" . $cluster_id . "','" . $invite_id . "','1')";
} else if ($command == 'leave') {
    $sql = "delete from ClusterTable where ClusterID = '" . $cluster_id . "' and UserID = '" . $id . "' and State ='0'";
} else if ($command == 'join') {
    $sql = "update ClusterTable set State = 0 where ClusterId = '" . $cluster_id . "' and UserID = '" . $id . "' and State = '1'";
} else if ($command == 'refuse') {
    $sql = "delete from ClusterTable where ClusterID = '" . $cluster_id . "' and UserID = '" . $id . "' and State ='1'";
}

$stmt = $dbh->query($sql);
echo 'success';

$dbh = null;
?>