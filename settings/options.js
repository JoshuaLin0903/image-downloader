function initializeOptionsMenu() {
    chrome.storage.local.get(["inplaceOpen", "showPrefix", "TwitterCredit", "prefixList"], function(result){
		document.querySelector("#inplaceOpen").checked = result.inplaceOpen || false;
        document.querySelector("#showPrefix").checked = result.showPrefix || false;
        document.querySelector("#TwitterCredit").checked = result.TwitterCredit || false;
        document.getElementById("prefix-list").value = result.prefixList.join('\n') || "";
        
        if(result.showPrefix == true){
            showPrefixMenu();
        }
        else{
            hidePrefixMenu();
        }
    })
    
    document.getElementById("save-prefix-list").addEventListener("click", save_prefix);
    document.getElementById("save-main-settings").addEventListener("click", save_main);
}

function save_main() {
	//save main options locally
	chrome.storage.local.set({
		inplaceOpen: document.querySelector("#inplaceOpen").checked,
        showPrefix: document.querySelector("#showPrefix").checked,
        TwitterCredit: document.querySelector("#TwitterCredit").checked
    });
    if(document.querySelector("#showPrefix").checked === true){
        showPrefixMenu();
    }
    else{
        hidePrefixMenu();
    }
	chrome.runtime.sendMessage({type: "refreshSettings"})
}

function save_prefix() {
    var data = document.getElementById("prefix-list").value
    prefix_list = data.split('\n')

    chrome.storage.local.set({prefixList: prefix_list});
    chrome.runtime.sendMessage({type: "refreshSettings"})
}

function hidePrefixMenu(){
	var PrefixMenu = document.getElementById("prefix-menu");
	PrefixMenu.classList.remove("active")
}

function showPrefixMenu(){
	var PrefixMenu = document.getElementById("prefix-menu");
	PrefixMenu.classList.add("active")
}

document.addEventListener("DOMContentLoaded", initializeOptionsMenu);