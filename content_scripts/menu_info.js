window.browser = (() => {
  if (typeof browser !== "undefined") {
    return browser;
  } else if (typeof chrome !== "undefined") {
    return chrome;
  } else {
    throw new Error("no webextension support in browser");
  }
})();

// origUrl attempts to convert a twitter image url into its ":orig" form.
function origUrl(url) {
  if(url === null || url === "") {
    throw new Error("must pass a url");
  }
  const u = new URL(url, window.location.href);

  // twitter case
  if (u.hostname == "pbs.twimg.com") {
    if (u.searchParams.get("format") && u.searchParams.get("name")) {
      // mobile twitter uses urls like:
      // https://pbs.twimg.com/media/{id}?format=jpg&name=small
      // Replacing 'name=small' with 'name=orig' seems to be all that's needed
      u.searchParams.set("name", "orig");
      return u.href;
    }
    let ndx = u.pathname.lastIndexOf(":");
    if(ndx >= 0) {
      u.pathname = u.pathname.slice(0, ndx) + ":orig";
    } else {
      u.pathname += ":orig";
    }
  }
  // daum case
  else if (u.hostname == "t1.daumcdn.net") {
    if(u.search == ""){ u.search = "?original"; }
    else{ u.search += "&original"; }
  }
  // naver post case
  else if (u.hostname == "post-phinf.pstatic.net") {
    u.search = "";
  }
  // naver picture case
  else if(u.hostname == "mimgnews.pstatic.net" || u.hostname == "ssl.pstatic.net"){
    u.search = "";
  }

  return u.href;
}

function getFileName(url) {
  if(url === null || url === "") {
    throw new Error("must pass a url");
  }
  const u = new URL(url, window.location.href);
  let filename = u.pathname;
  let ndx = filename.lastIndexOf("/");
  if (ndx >= 0) {
    filename = filename.slice(ndx + 1);
  }

  if (filename === ""){
    filename = "img.jpg";
  }
  // twitter case
  else if (u.hostname == "pbs.twimg.com") {
    ndx = filename.lastIndexOf(":");
    if(ndx >= 0) {
      filename = filename.slice(0, ndx);
    }
    if (u.searchParams.get("format")) {
      // mobile twitter uses urls like:
      // https://pbs.twimg.com/media/{id}?format=jpg&name=small
      filename += "." + u.searchParams.get("format");
    }
  }
  // daum case
  else if (u.hostname == "t1.daumcdn.net") {
    ndx = filename.lastIndexOf("?");
    if(ndx >= 0) {
      filename = filename.slice(0, ndx);
    }
    filename += ".jpg";
  }
  return filename;
}

function getHost(str){
  var begin = str.search("://") + 3;
  var end = str.indexOf("/", begin);
  str = str.slice(begin, end);
  return str
}

document.addEventListener('contextmenu', function(ev) {
  // naver picture case
  if(document.location.hostname === "m.entertain.naver.com" && document.location.pathname === "/entertain"){
    var x = document.querySelector("div[style='left: 0px;']").querySelector("img").src;
    if(x === "") {
      return;
    }
    let fileName = getFileName(x);
    browser.runtime.sendMessage({OrigUrl: origUrl(x), fileName: fileName});
    return;
  }

  let el = ev.target;
  if(el.tagName == "IMG") {
    //console.log("IMG");
    if(el.src === "") {
      return;
    }
    // TODO: maybe we should validate it's really a twitter url
   
    let fileName = getFileName(el.src);
    //console.log(fileName);
    browser.runtime.sendMessage({OrigUrl: origUrl(el.src), fileName: fileName});
    return;
  }
  if(el.parentElement && el.parentElement.classList.contains("Gallery-content")) {
    //console.log("gallery");
    let media = el.parentElement.querySelector(".Gallery-media > .media-image");
    if(media === null) {
      return;
    }
    let fileName = getFileName(media.src);
    browser.runtime.sendMessage({OrigUrl: origUrl(media.src), fileName: fileName});
    return;
  }

  // Allow right clicks on tweet-body for videos; you can't right click on
  // videos in current twitter.
  let tweetParent = el.closest('.permalink-tweet-container');
  if(tweetParent) {
    let vid = findTwitterVideo(tweetParent);
    if(vid) {
      browser.runtime.sendMessage({OrigUrl: vid, fileName: vid});
      return;
    }
  }

  // Otherwise it wasn't a twitter url, clear the "open" url
  browser.runtime.sendMessage({OrigUrl: "", fileName: ""});
});


function findTwitterVideo(el) {
  let vidSource = el.querySelectorAll('.PlayableMedia video source');
  for (let i = 0; i < vidSource.length; i++) {
    if(vidSource[i] && /mp4$/.test(vidSource[i].src)) {
      return vidSource[i].src;
    }
  }
  // twitter used to have <video src= instead of <video><source> ...; try this
  // too in case it still shows up somewhere.
  let vid = el.querySelector('.PlayableMedia video');
  if(vid && /mp4$/.test(vid.src)) {
    return vid.src;
  }
  return null;
}
