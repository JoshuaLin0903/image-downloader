function initializeOptionsMenu() {
    loadOptionsList();
    document.getElementById("add").addEventListener("click", addOption);
}

function addOption() {
    chrome.storage.local.get(["prefixList"], function(result){
        var name = document.querySelector("#album-name").value;
        document.querySelector("#album-name").value = "";
        result.prefixList.push(name);
        chrome.storage.local.set({prefixList: result.prefixList});
        loadOptionsList();
    })
}

function removeOption() {
    var id = this.id;
    //removes the currently selected option from the list
	chrome.storage.local.get("prefixList", function(result){
        result.prefixList.splice(id, 1);
		chrome.storage.local.set({prefixList: result.prefixList});
		loadOptionsList();
	})
}

function loadOptionsList(){
	//clears menu-settings-list and creates the list of URLs in a table inside it
	//clear container div first
	var menuSettingsList = document.getElementById("album-settings-list");
	menuSettingsList.innerHTML = "";
	
	chrome.storage.local.get("prefixList", function(result){
		var len = result.prefixList.length;
		var temp = document.createElement("div");
		var addedportion = document.createElement("TABLE");
		temp.appendChild(addedportion);
		addedportion.id = "album-list";
		for (var i = 0; i < len; i++){
            var addition = addedportion.insertRow();
            addition.className = "album-list-row";
            addition.id = i;

            var textportion = addition.insertCell();
            textportion.innerHTML =  result.prefixList[i];
            
            var button = addition.insertCell();
            button.innerHTML = "<button type=\"button\" name=\"remove\" id=\"" + i + "\">Remove</button>"
		}   
		document.body.appendChild(addedportion);
		menuSettingsList.appendChild(addedportion)
		var kids = document.getElementsByName("remove");
		for (var i = 0; i < kids.length; i++){
			kids[i].addEventListener("click", removeOption);
        }
        console.log(result.prefixList);
    })
    
	chrome.runtime.sendMessage({type: "rebuildMenu"})
}

document.addEventListener("DOMContentLoaded", initializeOptionsMenu);