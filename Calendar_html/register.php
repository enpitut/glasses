<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$account = filter_input(INPUT_POST, "account");
$email = filter_input(INPUT_POST, "email");
$pass = filter_input(INPUT_POST, "pass");
$success = true;

if ($success) {
    echo "{\"result\":\"success\"}";
} else {
    echo "{\"result\":\"error\"}";
}
?>
