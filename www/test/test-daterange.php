<?php
include_once('../../lib/initialize.php');

$dr = new DateRange($_GET['fr'],$_GET['to'], false);

echo $dr->fr.'<br>';
echo $dr->to.'<br>';
echo 'fr: '.strtotime($dr->fr).'<br>';
echo 'to: '.strtotime($dr->to).'<br>';

echo strtotime($dr->fr) == '-28800' ? 'fr invalid<br>':'fr valid<br>';
echo strtotime($dr->to) == '-28800' ? 'to invalid<br>':'to valid<br>';


$datetime1 = new DateTime($dr->fr);
$datetime2 = new DateTime($dr->to);
echo 'fr: '.$datetime1->format('Y-m-d').'<br>';
echo 'to: '.$datetime2->format('Y-m-d').'<br>';
$interval = $datetime1->diff($datetime2);
echo $interval->format('%a');

?>