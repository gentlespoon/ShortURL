<?php
/**
 * Author : GentleSpoon <me.github@gentlespoon.com>
 *
 * File   : checkip.php [ShortURL]
 * Date   : 2018-02-21
 * Time   : 19:35
 */

$options  = array('http' => array('user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'));
$context  = stream_context_create($options);
$string = 'http://ip138.com/ips138.asp?ip='.$_GET['ip'].'&action=2';
$string = file_get_contents("$string", false, $context);

$string = iconv('GB2312', 'UTF-8', $string);

$string = explode('<li>', $string);
unset($string[0]);
foreach ($string as $k => $v) {
  $v = explode('</li>', $v);
  $string[$k] = $v[0];
}

$string = implode("\n", $string);
echo $string;

