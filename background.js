/******************************/
/*       Browser Setting      */
/******************************/
const targetBrowser = (() => {
  if (typeof chrome !== "undefined" && typeof browser !== "undefined") {
    return 'firefox';
  } else if (typeof chrome !== "undefined") {
    return 'chrome';
  } else {
    return 'unknown';
  }
})()

window.browser = (() => {
  if (typeof browser !== "undefined") {
    return browser;
  } else if (typeof chrome !== "undefined") {
    return chrome;
  } else {
    throw new Error("no webextension support in browser");
  }
})();

/******************************/
/*          Functions         */
/******************************/
function firstRun(details){
  if (details.reason === 'install' || details.reason === 'update') {
    chrome.storage.local.get("prefixList", function(result){
      if (!result.prefixList || (result.prefixList.length == 0)){
        chrome.storage.local.set({prefixList: []});
      }
    })
  }
}

function getHost(str){
  var begin = str.search("://") + 3;
  var end = str.indexOf("/", begin);
  str = str.slice(begin, end);
  return str
}

function onCreated(n) {
  if (browser.runtime.lastError) {
    console.log('image-downloader: error:', browser.runtime.lastError);
  }
}

function onError(err) {
  console.log('image-downloader: error:', err);
}

function download_text(){
  var download_text = "Download";
  if(filePrefix != ""){
    download_text += " (prefix: " + filePrefix + ")";
  }
  return download_text;
}

function makePrifixMenu(){
  browser.contextMenus.create({
    id: "img-download-prefix",
    title: "Change prefix",
    parentId: "img",
    contexts: ["all"],
  }, onCreated);

  browser.contextMenus.create({
    type: "radio",
    id: "prefix-reset",
    title: "Clear prefix",
    parentId: "img-download-prefix",
    contexts: ["all"],
  }, onCreated);

  chrome.storage.local.get("prefixList", function(result){
    for (var i = 0; i < result.prefixList.length; i++){
      if(result.prefixList[i] === filePrefix){
        browser.contextMenus.create({
          type: "radio",
          checked: true,
          id: result.prefixList[i],
          title: result.prefixList[i],
          parentId: "img-download-prefix",
          contexts: ["all"],
        }, onCreated);
      }
      else{
        browser.contextMenus.create({
          type: "radio",
          id: result.prefixList[i],
          title: result.prefixList[i],
          parentId: "img-download-prefix",
          contexts: ["all"],
        }, onCreated);
      }
    }
  })
}

function makeMenu(){
  chrome.storage.local.get(["inplaceOpen", "showPrefix"], function(result){
    browser.contextMenus.create({
      id: "img",
      title: "Image Downloader",
      contexts: ["all"],
    }, onCreated);
  
    browser.contextMenus.create({
      id: "img-open",
      title: "Open Original (tab)",
      parentId: "img",
      contexts: ["all"],
    }, onCreated);
  
    if(result.inplaceOpen){
      browser.contextMenus.create({
        id: "img-open-inplace",
        title: "Open Original",
        parentId: "img",
        contexts: ["all"],
      }, onCreated);
    }
    else{
      browser.contextMenus.remove("img-open-inplace");
    }
  
    browser.contextMenus.create({
      id: "img-download",
      title: download_text(),
      parentId: "img",
      contexts: ["all"],
    }, onCreated);
  
    if(result.showPrefix){
      makePrifixMenu();
    }
    else{
      browser.contextMenus.remove("img-download-prefix");
    }
  })
}

function refershMenuItems(){
  filePrefix = "";
  browser.contextMenus.update("img-download",{
    title: download_text()
  });
  browser.contextMenus.removeAll();
  makeMenu();
}

// startDownload encodes the difference between the chrome and firefox download
// apis; it does the minimal amount of work to start a download since that's
// the only bit that differs between the two apis.
// Note: the mozilla/webextension-polyfill module could also be used, but it's rather heavy.
function startDownload(url) {
  if(filePrefix != ""){
    fileName = "_" + fileName;
  }
  const cleanedFilename = (filePrefix + fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
  const downloadObj = {
    url: lastOrigUrl,
    filename: cleanedFilename,
  };
  switch (targetBrowser) {
    case "chrome":
      return new Promise(function(resolve, reject) {
        chrome.downloads.download(downloadObj, function(id) {
          if (id) {
            resolve(id);
          } else {
            reject(browser.runtime.lastError);
          }
        });
      });
    default:
      const downloading = browser.downloads.download(downloadObj);
      return downloading;
  }
}

/******************************/
/*          Main Code         */
/******************************/
// Make Context Menu
browser.runtime.onInstalled.addListener(firstRun);
makeMenu();

// Global Variables
var lastOrigUrl = null;
var fileName = null;
var filePrefix = "";

// Script Listener
browser.runtime.onMessage.addListener(function(message){
  if(message){
    switch (message.type){
      case "rebuildMenu":	
        console.log("rebuildMenu");
        refershMenuItems();
        break;
      case "img_info":
        lastOrigUrl = message.OrigUrl;
        fileName = message.fileName;
      break;
  }
}
});

// Menu onClicked Listener
browser.contextMenus.onClicked.addListener(function(info, tab) {
  // handle prefix change
  if(info.menuItemId != "img-open" && info.menuItemId != "img-open-inplace" && info.menuItemId != "img-download"){
    if(info.menuItemId === "prefix-reset"){
      filePrefix = "";
    }
    else{
      filePrefix = info.menuItemId;
    }
    
    browser.contextMenus.update("img-download",{
      title: download_text()
    });
  }

  console.log("OrigUrl: " + lastOrigUrl);
  console.log("fileName: " + fileName);

  if(lastOrigUrl === "" || fileName === "") {
    // Indicates the right click menu has been 'cleared' by clicking on a non-recognized thing
    return;
  }
  if(lastOrigUrl === null || fileName === null) {
    console.log(`image-downloader: unexpected context menu event with null url: ${info}`);
    return;
  }

  switch (info.menuItemId) {
    case "img-open":
      browser.tabs.create({
        url: lastOrigUrl,
        active: false,
        openerTabId: tab.id,
      });
      break;
    case "img-open-inplace":
      browser.tabs.executeScript({
        code: `document.location = "${lastOrigUrl}";`,
      });
      break;
    default:
      var downloading = startDownload({
        url: lastOrigUrl,
        filename: fileName,
      });
      downloading.then(() => {}, onError);
  }
});