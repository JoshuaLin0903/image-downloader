.PHONY: release

VERSION=$(shell jq -r '.version' manifest.json)

release:
	mv ./manifest.json ./manifest-chrome.json
	mv ./manifest-firefox.json ./manifest.json
	zip -r firefox_extension_files/image-helper-v$(VERSION).zip ./LICENSE ./background.js ./content_scripts ./manifest.json ./settings -x "*.DS_Store"
	mv ./manifest.json ./manifest-firefox.json
	mv ./manifest-chrome.json ./manifest.json