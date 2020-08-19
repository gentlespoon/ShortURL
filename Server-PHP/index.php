<?php

class StringHelper {
  public static function startsWith(string $needle, string $haystack): bool {
    return (substr($haystack, 0, strlen($needle)) === $needle);
  }
  
  public static function contains(string $needle, string $haystack): bool {
    return (strpos($haystack, $needle) !== false);
  }
  
  public static function randomString(int $length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    $randomString = ''; 
    for ($i = 0; $i < $length; $i++) { 
        $index = rand(0, strlen($characters) - 1); 
        $randomString .= $characters[$index]; 
    }
    return $randomString;
  }
}

class RouteHandlers {

  public static function GetUrlInfo(): void {
    global $runtimeConfig;
    $runtimeConfig->authGuard();
    if (!array_key_exists('shortUrl', $_GET)) {
      http_response_code(400);
      die('query string [shortUrl] required');
    }
    $su = new ShortURL();
    $urlInfo = $su->getUrlInfo($_GET['shortUrl']);
    if (count($urlInfo) > 0) {
      echo(json_encode($urlInfo));
      exit();
    }
    http_response_code(404);
    die('shortURL "' . $_GET['shortUrl'] . '" not found.');
  }

  public static function GetUrlList(): void {
    global $runtimeConfig;
    $runtimeConfig->authGuard();
    $owner = '';
    if (!array_key_exists('owner', $_GET)) {
      $owner = $_GET['owner'];
    }
    $su = new ShortURL();
    $urlInfo = $su->getUrlsByOwner($_GET['owner']);
    echo(json_encode($urlInfo));
    exit();
  }

  public static function PostAdd(): void {
    global $runtimeConfig;
    $runtimeConfig->authGuard();
    if (!array_key_exists('longUrl', $_POST) || $_POST['longUrl'] === '') {
      http_response_code(400);
      die('query string [longUrl] required.');
    }
    $su = new ShortURL();
    $shortUrl = '';
    if (array_key_exists('shortUrl', $_POST)) {
      $shortUrl = $_POST['shortUrl'];
    }
    if ($shortUrl === '') {
      do {
        $shortUrl = StringHelper::randomString(4);
      } while ($su->hasExistingShortUrl($shortUrl));
    }
    $owner = '';
    if (array_key_exists('owner', $_POST)) {
      $owner = $_POST['owner'];
    }
    $shortUrl = $su->addUrlPair($shortUrl, $_POST['longUrl'], $owner);
    echo(json_encode(["shortUrl" => $shortUrl]));
    exit();
  }


  public static function ShortUrlHandler(): void {
    $su = new ShortURL();
    if ($su->hasExistingShortUrl($_GET['path'])) {
      Router::redirect($su->getLongUrl($_GET['path']));
    } else {
      http_response_code(404);
      $rdr = new Renderer();
      $rdr->render();
      exit();
    }
  }

}

class Router {

  public function route(): void {

    $routes = [
      'GET' => [

        'api/urlInfo' => function() { RouteHandlers::GetUrlInfo(); },
        'api/urlList' => function() { RouteHandlers::GetUrlList(); },

      ],
      'POST' => [
        'api/add' => function() { RouteHandlers::PostAdd(); },
      ],
    ];

    switch($_SERVER['REQUEST_METHOD']) {
      case 'GET':
      case 'POST':
        $routes_method = $routes[$_SERVER['REQUEST_METHOD']];
        if (array_key_exists($_GET['path'], $routes_method)) {
          $routes_method[$_GET['path']]();
        } else {
          RouteHandlers::ShortUrlHandler();
        }
      break;
      case 'OPTION': // CORS
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: *GET,OPTIONS,POST");
        http_response_code(200);
        exit();
      break;
      default:
        http_response_code(405);
    }
  }

  public static function redirect(string $url) {
    header('Location: ' . $url);
    http_response_code(302);
    exit();
  }
}


class RuntimeConfiguration {
  private $_apiKey = '';

  function __construct() {
    // Get runtime config from .env file
    $envFile = './.env';
    if (file_exists($envFile)) {
      $envFileContent = file_get_contents($envFile);
      $envFileLines = explode('\n', $envFileContent);
      foreach($envFileLines as $line) {
        $exploded = explode('=', $line);
        switch(trim($exploded[0])) {
          case 'API_KEY':
            $this->_apiKey = trim($exploded[1]);
          break;
          default:
        }
      }
    }
  }

  public function authGuard(): bool {
    if ($this->_apiKey === '') {
      // if .env API_Key is empty, disable authentication
      return true;
    } elseif (array_key_exists('authorization', $_SERVER['HEADERS']) && $_SERVER['HEADERS'] !== '') {
      if ($this->_apiKey === $_SERVER['HEADERS']['authorization']) {
        return true;
      }
    }
    http_response_code(403);
    die('authGuard: invalid API Key in header [Authorization]');
    // return false;
  }
}

class Renderer {
  private $externalTemplate = './template.html';

  private $defaultTemplate = '
<html>
<head>
  <title>ShortURL</title>
  <meta author="GentleSpoon">
</head>
<body>
<form method="POST" action="/api/add">
<div id="message"></div>
<input type="hidden" id="baseUrl" name="baseUrl" value="">
  <label for="longUrl">Long URL</label>
  <input type="text" id="longUrl" name="longUrl" required>
  <br>
  <label for="shortUrl">Preferred Short URL</label>
  <input type="text" id="shortUrl" name="shortUrl">
  <small>Leave empty for random.</small>
  <br>
  <button>Submit</button>
</form>
<script>
  document.getElementById("baseUrl").value = window.location.origin;
</script>
</body>
</html>';

  public function render() {
    $doc = new DOMDocument();
    if (file_exists($this->externalTemplate)) {
      $doc->loadHTMLFile($this->externalTemplate);
      echo($doc->saveHTML());
    } else {
      $doc->loadHTML($this->defaultTemplate);
      echo($doc->saveHTML());
    }
  }
}

class ShortURL {

  private $mappingFile = './config.json';
  private $redirectWithHttpCode = 302;
  
  private $map;
  
  function __construct() {
    $this->loadUrlMap();
  }

  public function hasExistingShortUrl(string $shortUrl): bool {
    if (array_key_exists($shortUrl, $this->map)) {
      return true;
    }
    return false;
  }

  public function getLongUrl(string $shortUrl): string {
    $urlInfo = $this->getUrlInfo($shortUrl);
    if (array_key_exists('url', $urlInfo)) {
      return $urlInfo['url'];
    }
    return '';
  }

  public function getUrlInfo(string $shortUrl): array {
    if ($this->hasExistingShortUrl($shortUrl)) {
      return $this->map[$shortUrl];
    }
    return [];
  }

  public function getUrlsByOwner(string $owner = ""): array {
    $filtered = [];
    foreach ($this->map as $short => $info) {
      if ($info['owner'] === $owner) {
        $filtered[$short] = $info;
      }
    }
    return $filtered;
  }

  public function addUrlPair(string $shortUrl, string $longUrl, string $owner = ""): string {
    if ($shortUrl === $longUrl) {
      http_response_code(400);
      die('shortUrl == longUrl');
    }
    if ($this->hasExistingShortUrl($shortUrl)) {
      http_response_code(409);
      die($shortUrl . ' already exists.');
    }
    $this->map[$shortUrl] = [
      "url" => $longUrl,
      "count" => 0,
      "owner" => $owner,
    ];
    $this->saveUrlMap();
    return $shortUrl;
  }

  private function loadUrlMap(): void {
    $this->map = [];
    if (!file_exists($this->mappingFile)) {
      $this->saveUrlMap();
    } else {
      $mapJSON = file_get_contents($this->mappingFile);
      if ($mapJSON == "") {
        $this->saveUrlMap();
      }
      $tmp = json_decode($mapJSON, true);
      if (json_last_error()) {
        $this->saveUrlMap();
      } else {
        $this->map = $tmp;
      }
    }
  }

  private function saveUrlMap(): void {
    if (!file_put_contents($this->mappingFile, json_encode($this->map, JSON_PRETTY_PRINT)."\n")) {
      http_response_code(500);
      die("Cannot write URL mapping file. Check permission: " . $_SERVER['DOCUMENT_ROOT']);
    }
  }

}


// Start handling request
$_SERVER['HEADERS'] = array_change_key_case(getallheaders(), CASE_LOWER);
if (!array_key_exists('path', $_GET)) {
  $_GET['path'] = '';
}
$runtimeConfig = new RuntimeConfiguration();
$router = new Router();
$router->route();