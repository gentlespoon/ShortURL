<?php
/**
 * Copyright (c) 2019
 * All rights reserved.
 * GentleSpoon
 * github@gentlespoon.com
 * 2019-07-02T23:31:24.000-0700
 */

if (!defined('ROOT'))
  exit("Access Denied.");
$_config = [
  "db" => [
    "host"      => "",                     // db server
    "port"      => 3306,                   // db port
    "username"  => "",                     // db username
    "password"  => "",                     // db password
    "dbname"    => "",                     // db name
    "charset"   => "utf8",                 // db character set
  ],
];

DB::$host = $_config['db']['host'];
DB::$port = $_config['db']['port'];
DB::$user = $_config['db']['username'];
DB::$password = $_config['db']['password'];
DB::$dbName = $_config['db']['dbname'];
DB::$encoding = $_config['db']['charset'];
