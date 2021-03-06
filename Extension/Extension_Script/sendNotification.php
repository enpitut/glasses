<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


require_once "HTTP/Request.php";
date_default_timezone_set('Asia/Tokyo');

// $dateで与えられた日付から$extension後の時間にあるユーザが拡張でログイン済みの
// スケジュールとタスクを取得して配列で返す
function checkNotification($date, $extension) {
    try {
        $dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8', 'meganeshibu', 'DBmaster777', array(PDO::ATTR_EMULATE_PREPARES => false));
    } catch (PDOException $e) {
        exit('データベース接続失敗。' . $e->getMessage());
    }

    $notificationList = array();

    $datetime = new DateTime($date);
    $datetime->add(DateInterval::createFromDateString($extension));
    $interval = DateInterval::createFromDateString('+59 second');
    $dateStart = $datetime->format('Y-m-d H:i:s');
    $dateEnd = $datetime->add($interval)->format('Y-m-d H:i:s');
    $sql = <<<"EOT"
(select
    'スケジュール' as Type,
    ScheduleTable.ScheduleID as ID,
    ScheduleTable.ScheduleName as Name,
    ScheduleTable.ScheduleInfo as Info,
    UserTable.UserID,
    UserTable.NotificationID
from
    ScheduleTable,
    UserTable
where
    UserTable.UserID = ScheduleTable.UserID
    and (ScheduleTable.ScheduleStart between '$dateStart' and '$dateEnd')
)
union
(select
    'タスク' as Type,
    TaskTable.TaskID as ID,
    TaskTable.TaskName as Name,
    TaskTable.TaskInfo as Info,
    UserTable.UserID,
    UserTable.NotificationID
from
    TaskTable,
    UserTable
where
    UserTable.UserID = TaskTable.UserID
    and (TaskTable.TaskEnd between '$dateStart' and '$dateEnd')
)
EOT;
    $stmt = $dbh->query($sql);
    while ($row = $stmt->fetchObject()) {
        $notificationList[] = array(
            'type' => $row->Type,
            'id' => $row->ID,
            'name' => $row->Name,
            'info' => $row->Info,
            'user_id' => $row->UserID,
            'notificationID' => $row->NotificationID
        );
    }

    $dbh = null;
    return $notificationList;
}

// $regIdのユーザあてに本文$messageの通知を送信
function sendNotification($message, $regId) {
    $apikey = "AIzaSyDh3_C0r5OxdGGHN516XleJ1G_-aAMxEC4";

    $rq = new HTTP_Request("https://android.googleapis.com/gcm/send");
    $rq->setMethod(HTTP_REQUEST_METHOD_POST);
    $rq->addHeader("Authorization", "key=" . $apikey);
    $rq->addPostData("registration_id", $regId);
    $rq->addPostData("collapse_key", "1");
    $rq->addPostData("data.message", $message);

    if (!PEAR::isError($rq->sendRequest())) {
        print "\n" . $rq->getResponseBody();
    } else {
        print "\nError has occurred";
    }
}

function setNotification($message, $user_id) {
    try {
        $dbh = new PDO('mysql:host=mysql488.db.sakura.ne.jp;dbname=meganeshibu_db;charset=utf8', 'meganeshibu', 'DBmaster777', array(PDO::ATTR_EMULATE_PREPARES => false));
    } catch (PDOException $e) {
        exit('データベース接続失敗。' . $e->getMessage());
    }
    $registTime = new DateTime();
    $sql = "insert into NotificationTable(UserID, NotificationInfo, RegistTime) values('" . $user_id . "',' " . $message . "',' " . $registTime->format('Y-m-d H:i:s') . "')";
    $stmt = $dbh->query($sql);

    $dbh = null;
}

$notificationList = checkNotification('', '+1 hour');

foreach ($notificationList as $notification) {
    $regId = $notification['notificationID'];
    if ($notification['type'] == 'スケジュール') {
        $ref = '開始';
    } else if ($notification['type'] == 'タスク') {
        $ref = '終了';
    }
    $message = $notification['type'] . '「' . $notification['name'] . '」の' . $ref . '1時間前です';

    if ($regId) {
        sendNotification($message, $regId);
    }
    setNotification($message, $notification['user_id']);
}
?>