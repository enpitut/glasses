<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

  $fp = fopen("unregister.txt", "a");
  fwrite($fp, $_REQUEST['regId'] . PHP_EOL);
  fclose($fp);
?>