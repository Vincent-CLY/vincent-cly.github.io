<?php

if ($_SERVER["REQUEST_METHOD"] == "POST"]) {
    $to = "vincentchung413@gmail.com"

    $subject = $_POST["subject"];

    $message = $_POST["message"];

    mail($to, $subject, $message);

}
