<!--
<?php
  define('ROOT', $_SERVER['DOCUMENT_ROOT'].'/');
  // Check MySQL Library
  if (!file_exists('meekrodb.class.php')) {
    die('ShortURL requires <a href="https://meekro.com/" target="_blank">MeekroDB (MySQL class)</a>. Please upload the latest meekrodb.class.php file to server root.');
  }
  require_once('meekrodb.class.php');
  // Check MySQL Configuration
  if (!file_exists('config.php')) {
    die('ShortURL has not been configured to use any database. A MySQL database is required. Please make a copy of config.sample.php and make changes base on your environment.');
  }
  require_once('config.php');
?>
-->
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Gs-ShortURL</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
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
