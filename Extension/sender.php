<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require_once "HTTP/Request.php";

if (filter_input(INPUT_POST, "message") != NULL) {
    $regid = file_get_contents('register.txt');
    $apikey = "AIzaSyDh3_C0r5OxdGGHN516XleJ1G_-aAMxEC4";
    $message = filter_input(INPUT_POST, "message");

    $rq = new HTTP_Request("https://android.googleapis.com/gcm/send");
    $rq->setMethod(HTTP_REQUEST_METHOD_POST);
    $rq->addHeader("Authorization", "key=" . $apikey);
    $rq->addPostData("registration_id", $regid);
    $rq->addPostData("collapse_key", "1");
    $rq->addPostData("data.message", $message);

    if (!PEAR::isError($rq->sendRequest())) {
        print "\n" . $rq->getResponseBody();
    } else {
        print "\nError has occurred";
    }
}
?>
<html>
    <body>
        <form action="sender.php" method="POST">
            <input type="textarea" name="message" />
            <button type="submit">送信</button>
        </form>
    </body>
</html>