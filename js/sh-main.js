/*
*  Scriping Helper
*
**/

//==================================================================================================
// 0: in hover mode 1: in select mode
var state = 0;

// indicate if our extension is started.
var started = false; 

// this global variable will remember which element we last clicked
var gCurrentNode; 


//==================================================================================================

/*
	This handler will accept launch commend from pop up html (when you click icon on your tab, you get popup.html)
*/
chrome.runtime.onMessage.addListener(
function(request, sender, response) {
    if(request.start){
    	
    	response({finishInit:true});
    	start();
    	
    }
   

});

/*
	This message handler used to commnicuate with iframe panel shown on your top right web page
*/
window.addEventListener('message', messageHandler);
function messageHandler(e){
	if(e.data.type=="close"){
		window.location.reload();
	}else if(e.data.type == "reset"){
		removeAllElementClass("sh-select");
		removeAllElementClass("sh-hover");
		removeAllElementClass("sh-predict");
		
		state = 0;
	}else if(e.data.type=="expand"){
		$("#sh-iframe").removeClass("sh-iframe-normal").addClass("sh-iframe-expand");
		$("body").append("<div id='sh-cover' ></div>");

		$("#sh-cover").click(function(e){
			e.stopPropagation();
		});

	}else if(e.data.type=="collpse"){
		$("#sh-iframe").removeClass("sh-iframe-expand").addClass("sh-iframe-normal");
		$("#sh-cover").unbind();
		$("#sh-cover").remove();
	}
}

//==================================================================================================
/*
	launch the program. add eventlistener, inject iframe panel
*/

function start(){
	if(started){
		alert("本插件已经启动!");
		return;
	}
	$("body").append("<iframe id='sh-iframe' class='sh-iframe-normal' src='"+chrome.extension.getURL("iframe.html")+"' scrolling='no' seamless='seamless'>");
	started = true;

	$("*").hover(function(e){
		if(state !== 0){
			return;
		}
		gCurrentNode = $(this);
		removeAllElementClass("sh-hover");
		removeAllElementClass("sh-predict");
		e.stopPropagation();
		e.preventDefault();
		
		var path = $(this).getFullPathName(true);

		

		$($(this).prop("tagName").toLowerCase()).each(function(){ // for all the same tag, we try to find the rest "same" element
			var this_path = $(this).getFullPathName(true);
			if(this_path == path){
				
				$(this).addClass("sh-hover");
			}
		});
		// call update for finding selector
		update_hover();
		
	});

	$("*").click(function(e){

		state = 1;
		
		e.stopPropagation();
		e.preventDefault();

		removeAllElementClass("sh-predict");

		if($(this).hasClass("sh-select")){ // unselect element
			$(this).removeClass("sh-select");
			
		}else{
			// select extra element that is not automatically selected in hover mode
			if($(this).prop("tagName") == $(".sh-hover").prop("tagName") || $(this).prop("tagName") == $(".sh-select").prop("tagName")){
				$(this).addClass("sh-select");
				gCurrentNode = $(this);
			}
			
		}

		// replace rest of the element with sh-hover
		$(".sh-hover").addClass("sh-select").removeClass("sh-hover");
		
		// call update for finding selector
		update_select();
		
	});
	
	console.log("Scraping Helper:Successfully Injected!");
}

/*
	This function is responsible for adding sh-hover to the given elements
	
	Called each time your cursor hover on element
*/
function update_hover(){	
	// Render Part   =========================================
	var className = 'sh-hover';

	var result = {path:gCurrentNode.getFullPathName(true).toLowerCase(),count:{select:$("."+className).length,predict:0},recommend:"",suggestion:"",findSolution:false};

	// Message Part =========================================
	// Post message to iframe panel for updating proposes
	$("#sh-iframe")[0].contentWindow.postMessage({data:result,type:"update"},"*");
}

/*
	This function is responsible for adding sh-select to the given elements
	***And search for optimized selector***
	Called each time your cursor click on element
*/
function update_select(){
	// Render Part   =========================================
	var className = "sh-select";
	var data = "";
	var id = 1;
	$("."+className).each(function(){
		data += "<div class='col-md-12 well'><span style='font-size:14px;' class='label label-success sh-float-left'>"+id+"</span>" + $(this).html() + "</div>";
		id ++;
	});

	// Exciting part ==================================
	var result = apporach1_SimpleSearch();

	//if(!result.findSolution)
		//result = apporach2_BreadthFirstSearch();
	
	result.modal = data;
	removeAllElementClass("sh-predict");

	if(result.findSolution){
		$(result.recommend).addClass("sh-predict");
	}else{
		$(result.suggestion).addClass("sh-predict");
	}
	
	result.count.predict = $(".sh-predict").length;

	// Message Part =========================================
	// Post message to iframe panel for updating proposes
	$("#sh-iframe")[0].contentWindow.postMessage({data:result,type:"update"},"*");
	
}

//==================================================================================================

// helper function, remove class from DOM
function removeAllElementClass(className){
	$("."+className).removeClass(className);
}

// extend jQuery selector
// finding path from given element to top of element tree (body tag)
$.fn.extend({
    getFullPathName: function(stopAtBody){
        stopAtBody = stopAtBody || false;
        function traverseUp(el){
            var result = el.tagName,
                pare = $(el).parent()[0];
            if (pare.tagName !== undefined && (!stopAtBody || pare.tagName !== 'BODY')){
                result = [traverseUp(pare), result].join(' ');
            }                
            return result;
        };
        return this.length > 0 ? traverseUp(this[0]) : '';
    }
});

// if we dont find correct selector, this global variable will remeber the most closed selector
var current_best_solution = "";
var current_best_different = 99999999999;

/*
	This function will check if the selector is correct
	Also, it update the current_best_solution and its difference, in case we dont find correct solution
*/
function isCorrectSelection(currentSelected,selector){
	var selectorResult = $(selector);
	// console.log("---Testing:"+selector+'---');
	// console.log("CurrentSelected:" + currentSelected.length);
	// console.log("SelectorSelected: "+ selectorResult.length);
	// console.log("--------------------------");
	
	
	
	

	if($(".sh-hover").length == 0){ // this only work if we had chosen an element, not in hover mode
		
		var different_count = Math.abs(currentSelected.length - selectorResult.length);
		if(different_count < current_best_different){
			current_best_different = different_count;
			current_best_solution = selector;
		}
	}
		
	
	// the fastest check, in most case (99%), same length means we have correct answer
	return currentSelected.length == selectorResult.length;

	// will uncomment following script if necessary

	// // for(var i = 0 ; i < currentSelected ; i++ ){
	// // 	if (selectorResult[i] != currentSelected[i]){
	// // 		return false;
	// // 	}
	// // }
	// return true;
	
}