<?php
  // if url specified
  if (array_key_exists('path', $_GET) && $_GET['path'] != '') {
    // if not reserved urls
    if (!in_array($_GET['path'], [
      'dashboard'
    ]) && substr($_SERVER['REQUEST_URI'], 0, strlen('/info/')) !== '/info/') {

      // Use UTC time
      date_default_timezone_set('UTC');

      define('ROOT', $_SERVER['DOCUMENT_ROOT'].'/');

      // Check MySQL Library
      if (!file_exists('meekrodb.class.php')) {
        die('ShortURL requires <a href="https://meekro.com/" target="_blank">MeekroDB (MySQL class)</a>. Please upload the latest meekrodb.class.php file to server root.');
      }
      require_once('meekrodb.class.php');

      // Check MySQL Configuration
      if (!file_exists('config.php')) {
        die('ShortURL has not been configured to use any database. A MySQL database is required. Please make a copy of config.sample.php, rename to "config.php" and make changes base on your environment.');
      }
      require_once('config.php');

      // functions
      function getRealIpAddr() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) $ip=$_SERVER['HTTP_CLIENT_IP'];
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        else $ip=$_SERVER['REMOTE_ADDR'];
        return $ip;
      }
      function jsISOtime($time = null) {
        if (!$time) $time = time();
        return date('Y-m-d\TH:i:s.000\Z', $time);
      }

      $shortUrl = $_GET['path'];

      // log
      $RS_LONGURL = DB::queryFirstField('SELECT long_url FROM url_pairs WHERE short_url=%s', $shortUrl);
      DB::insert('history', [
        'request_url' => $_SERVER['REQUEST_URI'],
        'short_url' => $RS_LONGURL == '' ? '' : $shortUrl,
        'long_url' => $RS_LONGURL == '' ? null : $RS_LONGURL,
        'request_time' => jsISOtime(),
        'ip' => getRealIpAddr(),
        'user_agent' => $_SERVER['HTTP_USER_AGENT'],
        'location' => ''
      ]);

      if ($RS_LONGURL) {
        DB::query('UPDATE url_pairs SET clicks=clicks+1 WHERE short_url=%s', $shortUrl);
        header('location: '. $RS_LONGURL);
      }
    }

  }


?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Gs-ShortURL</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Noto+Sans|Noto+Sans+SC|Noto+Sans+TC&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap-grid.min.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">

  <script src="https://www.google.com/recaptcha/api.js?render=6LcHM5QUAAAAACHSgtF-XvOoTh1K6T0osdigTiZo"></script>

  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>

  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-134721040-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-134721040-1');
  </script>
</body>
</html>
