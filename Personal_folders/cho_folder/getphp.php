<?php
try {

$dbh = new PDO('mysql:host=localhost;dbname=sample;charset=utf8','root','',
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
            'id'=> $row->id
            ,'name' => $row->name
	    ,'mail' => $row->mail
	    ,'office' => $row->office
	    ,'memo' => $row->memo
            );
    }
$dbh = null;

    header('Content-Type: application/json; charset=utf8');
    echo json_encode( $result );

?>