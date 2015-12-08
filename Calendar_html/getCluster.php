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
$sql = "select ClusterTable.ClusterID,ClusterTable.State,ClusterInfoTable.ClusterName,ClusterInfoTable.ClusterInfo from ClusterTable,ClusterInfoTable where ClusterTable.ClusterID = ClusterInfoTable.ClusterID and ClusterTable.UserID = '" . $id . "'";

$stmt = $dbh->query($sql);

while ($row = $stmt->fetchObject()) {
    $temp_arr = array(
        'ClusterID' => $row->ClusterID,
        'ClusterState' => $row->State,
        'ClusterName' => $row->ClusterName,
        'ClusterInfo' => $row->ClusterInfo,
        'ClusterMember' => array()
    );
    $sql = "select UserTable.UserName from UserTable,ClusterTable where UserTable.UserID = ClusterTable.UserID and ClusterTable.State = '0' and ClusterTable.ClusterID = '" . $row->ClusterID . "'";
    $sub_stmt = $dbh->query($sql);

    while ($sub_row = $sub_stmt->fetchObject()) {
        $temp_arr['ClusterMember'][] = $sub_row->UserName;
    }
    
    $result[] = $temp_arr;
}
$dbh = null;

header('Content-Type: application/json; charset=utf8');
echo json_encode($result);
?>