<?php
    $target_element = "";
    $target_file = "";
    $text = "";
    $result = array('error' => NULL);
    $flag = true;
    if(filter_input(INPUT_POST, "new_account_name") !== NULL) {
        $target_element = "#account_name";
        $target_file = "account.txt";
        $text = filter_input(INPUT_POST, "new_account_name");
    } else if(filter_input(INPUT_POST, "new_mail_addr") !== NULL) {
        $target_element = "#mail_addr";
        $target_file = "mail.txt";
        $text = filter_input(INPUT_POST, "new_mail_addr");
    } else if(filter_input(INPUT_POST, "new_pass") !== NULL) {
        $target_element = "#password";
        $target_file = "pass.txt";
        $text = filter_input(INPUT_POST, "new_pass");
        $old_pass = filter_input(INPUT_POST, "pass");
        $confirm_pass = filter_input(INPUT_POST, "confirm");
        if($text !== $confirm_pass) {
            $flag = false;
            $result['error'] = '確認とパスワードが違います';
            error_log($text + "," + $confirm_pass);
        } else if($old_pass !== file_get_contents($target_file)) {
            $flag = false;
            $result['error'] = 'パスワードが違います';
        }
    }
    
    if($flag) {
        $fopen = fopen($target_file, "w");
        flock($fopen, LOCK_EX);
        fputs($fopen, $text);
        flock($fopen, LOCK_UN);
        fclose($fopen);
        
        $result += array('target' => $target_element, 'file' => $target_file);
    }
    
    echo json_encode($result);
    error_log(json_encode($result));
?>