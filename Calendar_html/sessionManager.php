<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

session_start();
session_regenerate_id();

$command = filter_input(INPUT_POST, "command");

if ($command == 'checkLogin') {
    if (isset($_SESSION["user_id"])) {
        echo $_SESSION["user_id"];
    } else {
        echo false;
    }
} else if($command == 'getUserId') {
    if (isset($_SESSION["user_id"])) {
        echo $_SESSION["user_id"];
    } else {
        echo false;
    }
} else {
    echo false;
}
