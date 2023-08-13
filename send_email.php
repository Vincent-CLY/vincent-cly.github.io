<?php

if ($_SERVER["REQUEST_METHOD"] == "POST"]) {
    $to = "vincentchung413@gmail.com"

    $subject = $_POST["subject"];

    $message = $_POST["message"];

    $name = $_POST["name"];

    mail($to, $subject, $message);

}
