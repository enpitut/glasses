<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

try {

$dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8','meganeshibu','DBmaster777',
array(PDO::ATTR_EMULATE_PREPARES => false));
} catch (PDOException $e) {
 exit('データベース接続失敗。'.$e->getMessage());
}

$account = filter_input(INPUT_POST, "account");
$email = filter_input(INPUT_POST, "email");
$pass = filter_input(INPUT_POST, "pass");
$success=false;
$flag = true;

$sql = 'select * from UserTable where UserName="'.$account.'"';
$stmt = $dbh->query($sql);

while ($row = $stmt->fetchObject())
    { 
	if($row->UserPass == $pass){
		 $flag=false;
	}
    }
 
if($account!=NULL && $pass!=NULL && $flag){
$sql = 'insert into UserTable(UserName, Mail,UserPass, NotificationPass) values("'.$account.'","'.$email.'","'.$pass.'","'.$pass.'")';
$stmt = $dbh->query($sql);
$success = true;
}

if ($success==true) {
    echo true;
} else {
    echo false;
}
?>
