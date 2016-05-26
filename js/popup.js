$(function(){
	$("#start_btn").click(function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

			chrome.tabs.sendMessage(tabs[0].id, {start:true},function(){
				//chrome.tabs.executeScript(tabs[0].id, "js/sh-main.js");
				window.close();
			});

		});
    	
	});

});
