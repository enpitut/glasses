<?php
try {

$dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8','meganeshibu','DBmaster777',
array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 exit('データベース接続失敗。'.$e->getMessage());
}

$result =null;

$sql = $_POST['query'];

$stmt = $dbh->query($sql);

while ($row = $stmt->fetchObject())
    {
        $result[] = array(
            'ScheduleID' => $row->ScheduleID,
            'UserID'=> $row->UserID,
            'ScheduleName' => $row->ScheduleName,
	    'ScheduleInfo' => $row->ScheduleInfo,
	    'ScheduleStart' => $row->ScheduleStart,
	    'ScheduleEnd' => $row->ScheduleEnd,
	    'ClusterID' => $row->ClusterID,
            );
    }
$dbh = null;

    header('Content-Type: application/json; charset=utf8');
    echo json_encode( $result );

?>