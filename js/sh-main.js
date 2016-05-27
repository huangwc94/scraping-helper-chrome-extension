$(function(){

	var started = false; // indicate if our extension is started.
	var state = 0; // 0: in hover mode 1: in select mode
    var gCurrentNode; // this global variable will remember which element we last clicked
	
	
	/*
		This handler will accept launch commend from pop up html (when you click icon on your tab, you get popup.html)
	*/
	chrome.runtime.onMessage.addListener(
    function(request, sender, response) {
        if(request.start){
        	$("body").append("<iframe id='sh-iframe' class='sh-normal-size' src='"+chrome.extension.getURL("iframe.html")+"' scrolling='no' \
    seamless='seamless'>");
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
			$("#sh-iframe").css("width","90%");
			$("#sh-iframe").css("height","90%");
		}else if(e.data.type=="collpse"){
			$("#sh-iframe").css("width","270px");
			$("#sh-iframe").css("height","440px");
		}
	}

	/*
		launch the program. add eventlistener, inject iframe panel
	*/

	function start(){
		if(started){
			alert("本插件已经启动!");
			return;
		}

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
			update();
			
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
			update();
			
		});
		
		console.log("Scraping Helper:Successfully Injected!");
	}
	
	/*
		This function is responsible for adding sh-hover or sh-select to the given elements
		***And search for optimized selector***
		Called each time your cursor hover an element or click on element
	*/

	function update(){
		
		
		
		// Render Part   =========================================
		var className;
		if(state == 0){
			className = 'sh-hover';
		}else{
			className = "sh-select";
			var data = "";
			$("."+className).each(function(){
				data += "<p>"+$(this).text() + "</p><br>";
			});
			// Exciting part ==================================
			var result = apporach1_SimpleSearch();

			if(!result.findSolution)
				result = apporach2_BreadthFirstSearch();
			

			result.modal = data;

			// Message Part =========================================
			// Post message to iframe panel for updating proposes
			$("#sh-iframe")[0].contentWindow.postMessage({data:result,type:"update"},"*");
		}
		

		

	}

	// if we dont find correct selector, this global variable will remeber the most closed selector
	var current_best_solution = "";
	var current_best_different = 99999999999;

	/*
		Linear iteration apporach fast

	*/

	function apporach1_SimpleSearch(){
		var currentUseingClassName = state === 0 ? "sh-hover" : "sh-select";
		//console.log("============================================================");
		var currentSelected = $("."+currentUseingClassName);

		var path = "";
		var count = currentSelected.length;
		var recommend,suggestion;
		var findSolution = false;


		if(currentSelected.length>0){
			path = currentSelected.getFullPathName(true);

			findSolution = true;
			var currentNode = $(currentSelected[0]);
			recommend = "";
			while(!isCorrectSelection(currentSelected,recommend) && currentNode.prop("tagName") !== "BODY" ){
				findSolution = false;
				//console.log(currentNode);
				var classList = currentNode.attr('class')===undefined ? [] :currentNode.attr('class').split(/\s+/);

				// loop though all possible class attritube to see if we are able to succfully select 
				
				$.each(classList, function(index, item) {
					
					if(item == 'sh-select' || item == 'sh-hover' || item == '' || item == 'sh-prdict'){
						return;
					}
					
					var trival_solution = currentNode.prop("tagName").toLowerCase()+"."+item +" "+  recommend;
					if(isCorrectSelection(currentSelected,trival_solution)){
						findSolution = true;
						recommend = trival_solution;
						console.log("Solution Found!");
						return false;
					}
				});
				if(findSolution){
					break;
				}
				//console.log("go to upper level tree for answer");
				recommend = currentNode.prop("tagName").toLowerCase() + " "+recommend;
				currentNode = currentNode.parent();
			}
		}
		
		if(!findSolution){
			recommend = "";
			if(current_best_solution!= ""){
				suggestion = current_best_solution;
			}else{
				suggestion = "";
			}

		}else{
			suggestion = "";
		}

		//$(document).find("#sh-suggestion").html("元素路径："+path.toLowerCase()+"<br>选择数量："+count+"<br>选择器：<span id='sh-suggestion-code'>"+suggestion+"</span>");

		return {path:path.toLowerCase(),count:count,recommend:recommend,suggestion:suggestion,findSolution:findSolution};
	}

	/*
		Apporach 1 Breadth First Search
		Looping All possible combination of selector, including element class and element id
		For bottom to top of data tree
		
	*/
	function apporach2_BreadthFirstSearch(){
		var currentUsingClassName = state === 0 ? "sh-hover" : "sh-select";
		
		var currentSelected = $("."+currentUsingClassName);
		
		var recommend;

		var findSolution = false;


		if(currentSelected.length>0){

			resultData   = breadthFirstSearchAux(currentSelected,gCurrentNode,[]);
			
			findSolution = resultData.findSolution;
			recommend    = resultData.recommend

		}
		
		var path = gCurrentNode.getFullPathName(true);
		path     = path || "";
		var count = currentSelected.length;

		return {path:path.toLowerCase(),count:count,recommend:recommend,suggestion:current_best_solution,findSolution:findSolution};
	}

	/*
		
	*/
	function breadthFirstSearchAux(currentState,currentNode,selectorArray){
		
		// prepare loop selector for this level
		
		try{
			var thisNodeTag  = currentNode.prop("tagName").toLowerCase();
			if(thisNodeTag == "body"){
				return {findSolution:false,recommend:""};
			}
		}catch(err){
			console.log("Error!!!!!!!");
			console.log(currentNode);
			return {findSolution:false,recommend:""};
		}
		var modifierList = [thisNodeTag];

		var classList = currentNode.attr('class')===undefined ? [] :currentNode.attr('class').split(/\s+/);

		$.each(classList,function(index,item){
			if(item == 'sh-select' || item == 'sh-hover' || item == '' || item == 'sh-prdict'){
				return;
			}
			modifierList.push(thisNodeTag+"."+item);
		});

		// var thisNodeId = currentNode.attr("id") || "";
		// if(thisNodeId != ""){
		// 	modifierList.push("#"+thisNodeId);
		// }

		
		// run loop
		for(var i = 0;i<modifierList.length;i++){

			var trival_selector = modifierList[i] + " " + selectorArray.join(" ");
			if(isCorrectSelection(currentState,trival_selector)){
				return {findSolution:true,recommend:trival_selector};
			}
		};

		for(var i = 0;i<modifierList.length;i++){

			selectorArray.unshift(modifierList[i]);
			result = breadthFirstSearchAux(currentState,$(currentNode.parent()[0]),selectorArray);
			if(result.findSolution){
				return {findSolution:true,recommend:result.recommend};
			}
			selectorArray.shift();
		};
		return {findSolution:false,recommend:""};

	}



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
		removeAllElementClass("sh-predict");

		if($(".sh-hover").length == 0){ // this only work if we had chosen an element, not in hover mode
			selectorResult.addClass("sh-predict");
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
});