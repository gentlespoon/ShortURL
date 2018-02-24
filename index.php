<?php
/**
 * Copyright (c) 2018.
 * All rights reserved.
 * GentleSpoon
 * me.github@gentlespoon.com
 * Start: 2018-02-02 20:28:43
 * End:   2018-02-02 20:55:21
 */


define('ROOT', $_SERVER['DOCUMENT_ROOT'].'/');

require_once('meekrodb.2.3.class.php');
require_once('config.php');

date_default_timezone_set($_config['dt']['timezone']);
$dtFormat = $_config['dt']['format'];
$nowString = date($dtFormat, time());

DB::$host = $_config['db']['host'];
DB::$port = $_config['db']['port'];
DB::$user = $_config['db']['username'];
DB::$password = $_config['db']['password'];
DB::$dbName = $_config['db']['dbname'];
DB::$encoding = $_config['db']['charset'];


$alerts = [];


if (array_key_exists('path', $_REQUEST)) {
  $path = $_REQUEST['path'];
} else {
  $path = '';
}

switch ($path) {

  case 'favicon.ico':
    exit();

  case '':
    goto renderTemplate;


  case '_install':
    DB::query("CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `request_url` varchar(255) NOT NULL DEFAULT '',
  `short_url` varchar(127) NOT NULL DEFAULT '',
  `long_url` varchar(255) NOT NULL DEFAULT '',
  `date_time` varchar(63) NOT NULL DEFAULT '',
  `remote_ip` varchar(63) NOT NULL DEFAULT '',
  `user_agent` varchar(1023) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

    DB::query("CREATE TABLE `url_pairs` (
  `id` int(11) NOT NULL,
  `short_url` varchar(63) DEFAULT '',
  `long_url` varchar(511) DEFAULT '',
  `insert_date` varchar(63) DEFAULT '',
  `count` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

    DB::query("ALTER TABLE `history` ADD PRIMARY KEY (`id`);");

    DB::query("ALTER TABLE `url_pairs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `short_url` (`short_url`),
  ADD UNIQUE KEY `long_url` (`long_url`);");

    DB::query("ALTER TABLE `history` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;");

    DB::query("ALTER TABLE `url_pairs` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;");

    array_push($alerts, ['primary', 'Installed']);
    goto renderTemplate;








  case '_allpairs':
    if ($_GET['auth'] != $_config['pw'])
      exit('Access Denied.');
    goto getAllPairs;

  case '_allhistory':
    if ($_GET['auth'] != $_config['pw'])
      exit('Access Denied.');
    goto getAllHistory;








  case '_newurl':
    if (!array_key_exists('long_url', $_POST))
      goto renderTemplate;

    $long_url = trim($_POST['long_url']);
    if ($long_url == '')
      goto renderTemplate;

    $existed_short_url = DB::query("SELECT short_url FROM url_pairs WHERE long_url=%s", $long_url);
    if (!empty($existed_short_url)) {
      $full_short_url = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['SERVER_NAME'].'/'.$existed_short_url[0]['short_url'];
      array_push($alerts, ['primary', '<a href="'.$full_short_url.'" target="_blank">'.$full_short_url.'</a>']);
      goto renderTemplate;
    }

    $short_url = '';
    if (array_key_exists('short_url', $_POST))
      $short_url = trim($_POST['short_url']);

    if ($short_url == '') {  
      generate:
      $vocab = '0123456789abcdefghijklmnopqrstuvwxyz';
      $max = strlen($vocab) - 1;
      $short_url = '';
      for ($i = 0; $i < $_config['length']; ++$i)
        $short_url .= $vocab[random_int(0, $max)];
    }
    if (!empty(DB::query('SELECT id FROM url_pairs WHERE short_url=%s', $short_url)))
      goto generate;

    DB::query("INSERT INTO url_pairs (short_url, long_url, insert_date) VALUES (%s, %s, %s)", $short_url, $long_url, $nowString );
    $full_short_url = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['SERVER_NAME'].'/'.$short_url;
    array_push($alerts, ['primary', '<a href="'.$full_short_url.'" target="_blank">'.$full_short_url.'</a>']);
    goto renderTemplate;


}

DB::query("INSERT INTO history (short_url, remote_ip, date_time, request_url, user_agent) VALUES (%s, %s, %s, %s, %s)", $path, $_SERVER['REMOTE_ADDR'], $nowString, $_SERVER['REQUEST_URI'], $_SERVER['HTTP_USER_AGENT']);
$historyId = DB::query("SELECT id FROM history WHERE short_url=%s AND remote_ip=%s and date_time=%s", $path, $_SERVER['REMOTE_ADDR'], $nowString)[0]['id'];

$urlPair = DB::query("SELECT * FROM url_pairs WHERE short_url=%s", $path);
if (empty($urlPair)) {
  array_push($alerts, ['danger', 'Short URL is not recognized.']);
  goto renderTemplate;
}

DB::query("UPDATE history SET long_url=%s WHERE id=%i", $urlPair[0]['long_url'], $historyId);
DB::query("UPDATE url_pairs SET count=count+1 WHERE id=%i", $urlPair[0]['id']);

header('Location: '.$urlPair[0]['long_url']);
exit();








getAllPairs:
$all_records = DB::query('SELECT * FROM url_pairs');
foreach($all_records as $key => $row) {
  $all_records[$key]['insert_date'] = date('Y-m-d H:i:s T', strtotime($row['insert_date']));
}
goto renderTemplate;


getAllHistory:
$all_records = DB::query('SELECT * FROM history');
foreach($all_records as $key => $row) {
  $all_records[$key]['date_time'] = date('Y-m-d H:i:s T', strtotime($row['date_time']));
}
goto renderTemplate;


// render HTML template
renderTemplate:
include_once('template.html');
exit();
