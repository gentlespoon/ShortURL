# ShortURL

A ShortURL system.

* Use PHP and MySQL.
* ~~0% JavaScript.~~ jQuery (AJAX) is used for getting IP location info from 3rd party service.
* 0% Ads.
* Ugly, unstructured
* Lightweight and works well.
* Free to do whatever you want with it.


### Installation

0. Download MeekroDB (MySQL class) [here](https://meekro.com/).

1. Put the MeekroDB file (and all files in this project) in the DOCUMENT_ROOT.

2. Make a copy of `config.sample.php` and rename `config.php`.

3. Edit the configuration file according to your environment. 

4. Be sure you SET A PASSWORD for log viewing!

5. Open `http://hostname/_install` in browser.

6. Enjoy.


### View logs

0. Open `http://hostname/_allpairs?auth=[YOUR PASSWORD in config.php]` in browser.

0. Open `http://hostname/_allhistory?auth=[YOUR PASSWORD in config.php]` in browser.
