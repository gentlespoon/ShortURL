<?php
/**
 * Copyright (c) 2018.
 * All rights reserved.
 * GentleSpoon
 * me.github@gentlespoon.com
 * Start: 2018-02-02 20:31:23
 * End:   2018-02-02 20:35:44
 */


if (!defined('ROOT'))
  exit("Access Denied.");

$_config = [
  "title" => "Short URL System",           // page title
  "length" => 6,                           // How many chars in shortURL do you want?
  "db" => [
    "host"      => "",                     // db server
    "port"      => 3306,                   // db port
    "username"  => "",                     // db username
    "password"  => "",                     // db password
    "dbname"    => "",                     // db name
    "charset"   => "utf8",                 // db character set
  ],
  "dt" => [
    "timezone"  => "America/Los_Angeles",  // time zone where the visit history will be recorded in
    "format"    => DateTime::ISO8601,
  ],
  "pw" => "",                     // a password used for authenticate when using _functions
];
