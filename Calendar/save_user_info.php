<?php
//設定画面で設定したユーザ情報を保存する
//現時点ではそれぞれ用意したtxtファイルに保存
    $target_element = "";
    $target_file = "";
    $text = "";
    $result = array('error' => NULL);
    $flag = true;
    if(filter_input(INPUT_POST, "new_account_name") !== NULL) {
        $target_element = "#account_name";
        $target_file = "res/account.txt";
        $text = filter_input(INPUT_POST, "new_account_name");
    } else if(filter_input(INPUT_POST, "new_mail_addr") !== NULL) {
        $target_element = "#mail_addr";
        $target_file = "res/mail.txt";
        $text = filter_input(INPUT_POST, "new_mail_addr");
    } else if(filter_input(INPUT_POST, "new_pass") !== NULL) {
        $target_element = "#password";
        $target_file = "res/pass.txt";
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