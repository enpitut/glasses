<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require_once "HTTP/Request.php";
date_default_timezone_set('Asia/Tokyo');

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
    UserTable.NotificationID
from
    ScheduleTable,
    UserTable
where
    UserTable.UserID = ScheduleTable.UserID
    and not (UserTable.NotificationID = '')
    and (ScheduleTable.ScheduleStart between '$dateStart' and '$dateEnd')
)
union
(select
    'タスク' as Type,
    TaskTable.TaskID as ID,
    TaskTable.TaskName as Name,
    TaskTable.TaskInfo as Info,
    UserTable.NotificationID
from
    TaskTable,
    UserTable
where
    UserTable.UserID = TaskTable.UserID
    and not (UserTable.NotificationID = '')
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
            'notificationID' => $row->NotificationID
        );
    }

    return $notificationList;
}

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

if ((filter_input(INPUT_POST, "date") != NULL) && (filter_input(INPUT_POST, "extension") != NULL)) {
    $date = filter_input(INPUT_POST, 'date');
    $extension = filter_input(INPUT_POST, 'extension');
    $notificationList = checkNotification($date, $extension);
    if ($extension == '+1 minute') {
        $extension = '1分前';
    } else if ($extension == '+1 hour') {
        $extension = '1時間前';
    }

    $apikey = "AIzaSyDh3_C0r5OxdGGHN516XleJ1G_-aAMxEC4";

    foreach ($notificationList as $notification) {
        $regid = $notification['notificationID'];
        if ($notification['type'] == 'スケジュール') {
            $ref = '開始';
        } else if ($notification['type'] == 'タスク') {
            $ref = '終了';
        }
        $message = $notification['type'] . '「' . $notification['name'] . '」の' . $ref . $extension . 'です';
        sendNotification($message, $regid);
    }
}
?>
<html>
    <body>
        <form action="sender.php" method="POST">
            <input type="datetime-local" name="date" step="1"/><br>
            <input type="radio" name="extension" value="+1 minute">1分前
            <input type="radio" name="extension" value="+1 hour">1時間前
            <button type="submit">送信</button>
        </form>
        <div>
<?php
if (isset($notificationList)) {
    foreach ($notificationList as $notification) {
        echo '<p>';
        print_r($notification);
        echo'</p>';
    }
}
?>
        </div>
    </body>
</html>