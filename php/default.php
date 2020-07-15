<?php
  require_once('my-class.php');

  $input = file_get_contents('php://input');
  $input = json_decode($input);
  $filtered_a = filter_var($input->a, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  $filtered_b = filter_var($input->b, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  $filtered_c = filter_var($input->c, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  $filtered_d = filter_var($input->d, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

  $obj = new myClass();
  $results = $obj->getMethod($filtered_a, $filtered_b, $filtered_c, $filtered_d);

  echo json_encode($results);
 
?>