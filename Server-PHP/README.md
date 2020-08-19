# ShortURL - Minimal PHP Server

This is a minimal ShortURL server written in PHP.

It can operate in standalone mode with a minimal UI, or act as an API backend for a remote client.

The .htaccess file is the rule for Apache web server.

---

## Use it as a standalone service:

1. Copy `.htaccess` and `index.php` to your web hosting document root.
1. Open your browser, navigate to your domain and enjoy.

---

## Use it as an API backend:

1. Copy `.htaccess` and `index.php` to your web hosting document root.
1. Create a `.env` file in document root and specify an API key.
   <pre>API_KEY=01973209ghbzodbf0-98h301p3ifbha098ty32ouv</pre>
   This API key can be anything you like. Just send it in header `Authorization` with your requests.

- ### Supported APIs include:

  - GET `/api/urlInfo`
    | Query param | Required? | Description | Example |
    | --- | :---: | --- | --- |
    | shortUrl | `REQUIRED` | Get info for this short URL. | `/api/urlInfo?shortUrl=myLink` |

  - GET `/api/urlList`
    | Query param | Required? | Description | Example |
    | --- | :---: | --- | --- |
    | owner | `-` | Get URL list for which owner.<br>Get all URLs if not specified. | `/api/urlList?owner=username` |

  - POST `/api/add`
  - | Form data | Required?  | Description                                                                   | Example                                                     |
    | --------- | :--------: | ----------------------------------------------------------------------------- | ----------------------------------------------------------- |
    | longUrl   | `REQUIRED` | The long URL to be shortened.                                                 | `https://an.extra.long.url/that.does?not=need.&to=be-valid` |
    | shortUrl  |    `-`     | Your preferred short URL.<br>A random URL will be generated if not specified. | `myLink`                                                    |
    | owner     |    `-`     | Who created the URL.<br>Default is anonymous (empty)                          | `Bob`                                                       |
