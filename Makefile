.PHONY: release

VERSION=$(shell jq -r '.version' manifest.json)

release:
	zip -r image-helper-v$(VERSION).zip ./LICENSE ./background.js ./content_scripts ./manifest.json
