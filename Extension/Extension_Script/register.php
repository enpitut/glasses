<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    header("Access-Control-Allow-Origin:*");

    $fp = fopen("register.txt", "w");
    fwrite($fp, filter_input(INPUT_POST, "regId") . PHP_EOL);
    fwrite($fp, filter_input(INPUT_POST, "userId") . PHP_EOL);
    fclose($fp);
   
    echo "{\"result\":\"success\"}";
?>