<?php

try {
$dbh = new PDO('mysql:host=210.140.68.27;dbname=test;charset=utf8','DBmaster','enpitGlasses',
array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 exit('データベース接続失敗。'.$e->getMessage());
}

$result =null;

$sql = 'select * from user';
$stmt = $dbh->query($sql);

while ($row = $stmt->fetchObject())
    {
        $result[] = array(
            'id'=> $row->id
            ,'name' => $row->name
	    ,'age' => $row->age
            );
    }
$dbh = null;

    header('Content-Type: application/json; charset=utf8');
    echo json_encode( $result );

?>
