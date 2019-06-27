function initializeOptionsMenu() {
    chrome.storage.local.get(["inplaceOpen", "showPrefix"], function(result){
		document.querySelector("#inplaceOpen").checked = result.inplaceOpen || false;
        document.querySelector("#showPrefix").checked = result.showPrefix || false;
        
        if(result.showPrefix == true){
            showPrefixMenu();
            loadOptionsList();
        }
        else{
            hidePrefixMenu();
        }
    })
    
    document.getElementById("add").addEventListener("click", addOption);
    document.getElementById("save").addEventListener("click", save);
}

function save() {
	//save main options locally
	chrome.storage.local.set({
		inplaceOpen: document.querySelector("#inplaceOpen").checked,
		showPrefix: document.querySelector("#showPrefix").checked
    });
    console.log(document.querySelector("#showPrefix").checked)
    if(document.querySelector("#showPrefix").checked === true){
        showPrefixMenu();
        loadOptionsList();
    }
    else{
        hidePrefixMenu();
    }
	chrome.runtime.sendMessage({type: "rebuildMenu"})
}

function addOption() {
    chrome.storage.local.get(["prefixList"], function(result){
        var name = document.querySelector("#prefix-name").value;
        document.querySelector("#prefix-name").value = "";
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
    
	var menuSettingsList = document.getElementById("prefix-settings-list");
	menuSettingsList.innerHTML = "";
	
	chrome.storage.local.get("prefixList", function(result){
		var len = result.prefixList.length;
		var temp = document.createElement("div");
		var addedportion = document.createElement("TABLE");
		temp.appendChild(addedportion);
		addedportion.id = "prefix-list";
		for (var i = 0; i < len; i++){
            var addition = addedportion.insertRow();
            addition.className = "prefix-list-row";
            addition.id = i;

            var textportion = addition.insertCell();
            var text = document.createTextNode(result.prefixList[i])
            textportion.appendChild(text);
            
            var button = addition.insertCell();
            var btn = document.createElement('input');
            btn.type = "button";
            btn.name = "remove";
            btn.id = i;
            btn.value = "Remove";
            button.appendChild(btn);
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

function hidePrefixMenu(){
    console.log("hide prefix menu")
	var PrefixMenu = document.getElementById("prefix-menu");
	PrefixMenu.classList.remove("active")
}

function showPrefixMenu(){
    console.log("show prefix menu")
	var PrefixMenu = document.getElementById("prefix-menu");
	PrefixMenu.classList.add("active")
}

document.addEventListener("DOMContentLoaded", initializeOptionsMenu);