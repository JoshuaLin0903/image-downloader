function initializeOptionsMenu() {
    //chrome.storage.local.set({urlList: []});
    loadOptionsList();
    document.getElementById("add").addEventListener("click", addOption);
}

function addOption() {
    chrome.storage.local.get(["urlList"], function(result){
        var name = document.querySelector("#album-name").value;
        document.querySelector("#album-name").value = "";
        result.urlList.push(name);
        chrome.storage.local.set({urlList: result.urlList});
        loadOptionsList();
    })
}

function removeOption() {
    //removes the currently selected option from the list
	chrome.storage.local.get("urlList", function(result){
		result.urlList.splice(this.id, 1);
		chrome.storage.local.set({urlList: result.urlList});
		loadOptionsList();
	})
}

function loadOptionsList(){
	//clears menu-settings-list and creates the list of URLs in a table inside it
	//clear container div first
	var menuSettingsList = document.getElementById("album-settings-list");
	menuSettingsList.innerHTML = "";
	
	chrome.storage.local.get("urlList", function(result){
		var len = result.urlList.length;
		var temp = document.createElement("div");
		var addedportion = document.createElement("TABLE");
		temp.appendChild(addedportion);
		addedportion.id = "album-list";
		for (var i = 0; i < len; i++){
            var addition = addedportion.insertRow();
            addition.className = "album-list-row";
            addition.id = i;

            var textportion = addition.insertCell();
            textportion.innerHTML =  result.urlList[i];
            
            var button = addition.insertCell();
            button.innerHTML = "<button type=\"button\" name=\"remove\" id=\"" + i + "\">Remove</button>"
		}   
		document.body.appendChild(addedportion);
		menuSettingsList.appendChild(addedportion)
		var kids = document.getElementsByName("remove");
		for (var i = 0; i < kids.length; i++){
			kids[i].addEventListener("click", removeOption);
        }
        console.log(result.urlList);
    })
    
	chrome.runtime.sendMessage({type: "rebuildMenu"})
}

document.addEventListener("DOMContentLoaded", initializeOptionsMenu);
// function saveOptions(e) {
//     e.preventDefault();
//     browser.storage.sync.set({
//       color: document.querySelector("#color").value
//     });
//   }
  
//   function restoreOptions() {
  
//     function setCurrentChoice(result) {
//       document.querySelector("#color").value = result.color || "blue";
//     }
  
//     function onError(error) {
//       console.log(`Error: ${error}`);
//     }
  
//     var getting = browser.storage.sync.get("color");
//     getting.then(setCurrentChoice, onError);
//   }
  
//   document.addEventListener("DOMContentLoaded", restoreOptions);
//   document.querySelector("form").addEventListener("submit", saveOptions);