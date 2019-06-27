# image-downloader
A webextension to make opening/downloading original(higher quaitiy) images and images organization easier.

## Getting Started
You can download the Firefox addons [here](https://addons.mozilla.org/firefox/addon/image-download-helper/).

## Supported Hostnames
- `pbs.twimg.com` (twitter)
- `t1.daumcdn.net` (daum)
- `post-phinf.pstatic.net`, `mimgnews.pstatic.net`, `ssl.pstatic.net` (naver)

## Prefix feature
This feature allows users to costumize a "prefix list" in "Preference" page.
When downloading a picture, user can choose prefix from the "Change prefix" menu, adding prefix to the filename of the picture.

Note that, the extension can memorize the last prefix used, and will add that prefix to the following downloads.
(Which means, if you wish to download several pictures with the same prefix, you don't need to go to "Change prefix" everytime.)

## Original Project
This project is an original project called [**twitter-image-helper**](https://github.com/euank/twitter-image-helper) by [**Euan Kemp**](https://github.com/euank).

## TODO...
- [X] enable/disable Open Original(inplace) option
- [ ] Nested prefix list
- [X] enable/disable prefix option

## License
AGPL 3.0

