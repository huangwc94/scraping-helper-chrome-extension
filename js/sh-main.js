$(function(){
	var started = false;
	var state = 0;
	//start();
	// chrome.commands.onCommand.addListener(function(command) {
 //        console.log('Command:', command);
 //      });
    
	console.log("sh-main.js run");
	
	
	chrome.runtime.onMessage.addListener(
    function(request, sender, response) {
        if(request.start){
        	$("body").append("<iframe id='sh-iframe' class='sh-normal-size' src='"+chrome.extension.getURL("iframe.html")+"' scrolling='no' \
    seamless='seamless'>");
        	response({finishInit:true});
        	start();
        	
        }
       
        //addPanel();
	});
	
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



	function start(){
		if(started){
			alert("本插件已经启动");
			return;
		}
		started = true;


		console.log("Scraping Helper:Successfully Injected!");
		
		$("*").hover(function(e){
			if(state !== 0){
				return;
			}
			removeAllElementClass("sh-hover");
			removeAllElementClass("sh-predict");
			e.stopPropagation();
			e.preventDefault();
			
			var path = $(this).getFullPathName(true);
			var selected_node = $(this);
			$($(this).prop("tagName").toLowerCase()).each(function(){
				var this_path = $(this).getFullPathName(true);
				if(this_path == path){
					$(this).css("border","soild");
					$(this).addClass("sh-hover");
				}
			});
			update();
			
		});
		$("*").click(function(e){
			state = 1;
			e.stopPropagation();
			e.preventDefault();
			removeAllElementClass("sh-predict");
			if($(this).hasClass("sh-select")){
				$(this).removeClass("sh-select");
				
			}else{
				if($(this).prop("tagName") == $(".sh-hover").prop("tagName") || $(this).prop("tagName") == $(".sh-select").prop("tagName")){
					$(this).addClass("sh-select");
				}
				
			}
			$(".sh-hover").addClass("sh-select").removeClass("sh-hover");
			
			update();
			
		});
		addPanel();
		
	}
	var isShowingModal = false;
	

	function update(){
		var result = apporach1_BreadthFirstSearch();
		//console.log($("#sh-iframe")[0].contentWindow);
		var className;
		if(state == 0){
			className = 'sh-hover';
		}else{
			className = "sh-select";
		}
		var data = "";
		$("."+className).each(function(){
			data += "<p>"+$(this).text() + "</p><br>";
			});
		
		result.modal = data;


		$("#sh-iframe")[0].contentWindow.postMessage({data:result,type:"update"},"*");
		// chrome.runtime.sendMessage({data:result,update:true},function(e){
			
		// });
	}
	var current_best_solution = "";
	var current_best_different = 99999999999;
	function apporach1_BreadthFirstSearch(){
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

	function isCorrectSelection(currentSelected,selector){
		var selectorResult = $(selector);
		// console.log("---Testing:"+selector+'---');
		// console.log("CurrentSelected:" + currentSelected.length);
		// console.log("SelectorSelected: "+ selectorResult.length);
		// console.log("--------------------------");
		removeAllElementClass("sh-predict");

		if($(".sh-hover").length == 0){
			selectorResult.addClass("sh-predict");
			var different_count = Math.abs(currentSelected.length - selectorResult.length);
			if(different_count < current_best_different){
				current_best_different = different_count;
				current_best_solution = selector;
			}
		}
			
		

		return currentSelected.length == selectorResult.length;

		// if (currentSelected.length != selectorResult.length){

		// 	return false;
		// }

		// // for(var i = 0 ; i < currentSelected ; i++ ){
		// // 	if (selectorResult[i] != currentSelected[i]){
		// // 		return false;
		// // 	}
		// // }
		// return true;
		
	}
	function removeAllElementClass(className){
		$("."+className).removeClass(className);
	}

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
