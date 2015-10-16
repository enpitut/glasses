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
$dbh = null;

?>