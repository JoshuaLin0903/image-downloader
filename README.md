# image-downloader
A webextension to make opening/downloading original(higher quaitiy) images and images organization easier.

## Getting Started
You can download the Firefox addons [here](https://addons.mozilla.org/firefox/addon/image-download-helper/) and Chrome extension [here](https://chrome.google.com/webstore/detail/image-downloader/dfddfklkbahiihjnfmpflfblacfjojjl).

## Supported Websites (Hostnames)
- Daum: `t1.daumcdn.net`
- Instagram: `scontent-tpe1-1.cdninstagram.com`
- Naver: `post-phinf.pstatic.net`, `mimgnews.pstatic.net`, `ssl.pstatic.net`
- Twitter: `pbs.twimg.com`

## Features
### Prefix feature
This feature allows users to costumize a "prefix list" in "Preference" page.
When downloading a picture, user can choose prefix from the "Change prefix" menu, adding prefix to the filename of the picture.

Note that, the extension can memorize the last prefix used, and will add that prefix to the following downloads.
(Which means, if you wish to download several pictures with the same prefix, you don't need to go to "Change prefix" everytime.)

### Image source feature
This feature can automatically add the username of the Twitter post to the filename when downloading an image.

This feature is currently available on Twitter only. I might work on other websites' cases in the future :)

### Filename format
[(prefix)\_][(source)-]\(original\_filename\)

Example: Band_RADWIMPS-EGUyr2PUYAAu3pd.jpg

## Original Project
This project is an original project called [**twitter-image-helper**](https://github.com/euank/twitter-image-helper) by [**Euan Kemp**](https://github.com/euank).

## TODO...
- [ ] Image source feature for other cases
- [ ] Nested prefix list

## Contributions
Feel free to open issues or pull requests!

## License
AGPL 3.0

