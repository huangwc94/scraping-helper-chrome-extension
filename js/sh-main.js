$(function(){
	var started = false;
	var state = 0;
	//start();
	// chrome.commands.onCommand.addListener(function(command) {
 //        console.log('Command:', command);
 //      });
    
	console.log("sh-main.js run");
	if($("#sh-panel").length==1){
		console.log("iframe avtivited!");
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				console.log("message received!");
		    	if(request.update){
		    		updatePanel(request.data);
		    	}
		        
		        //addPanel();
		});
	}else{
		chrome.runtime.onMessage.addListener(
	    function(request, sender, response) {
	        if(request.start){
	        	$("body").append("<iframe id='sh-iframe' src='"+chrome.extension.getURL("iframe.html")+"' scrolling='no' \
        seamless='seamless'>",function(){
		        	response({finishInit:true});
		        });
	        	start();
	        	
	        }
	        
	        //addPanel();
		});
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
	function addPanel(){
		

		$("#sh-action-reset").click(function(e){
			e.stopPropagation();
			removeAllElementClass("sh-select");
			removeAllElementClass("sh-hover");
			removeAllElementClass("sh-predict");
			$("#sh-modal").hide();
			state = 0;
		});
		$("#sh-action-close").click(function(e){
			window.location.reload();
		});
		
		$("#sh-action-copy-selector").click(function(e){
			e.stopPropagation();
			if(state ==0){
				return;
			}
			if(isShowingModal){
				$("#sh-modal").hide();
				$("#sh-action-copy-selector").text("拷贝选择器");
			}else{
				$("#sh-modal").html($("#sh-suggestion-code").text()).show();
				$("#sh-action-copy-selector").text("关闭");
			}
			isShowingModal = !isShowingModal;
		});

		$("#sh-action-copy-content").click(function(e){
			e.stopPropagation();
			if(state ==0){
				return;
			}
			var data = "";
			$(".sh-select").each(function(){
				data += "<p>"+$(this).text() + "</p><br>";
			});
			
			if(isShowingModal){
				$("#sh-modal").hide();
				$("#sh-action-copy-content").text("拷贝内容");
			}else{
				$("#sh-action-copy-content").text("关闭");
				$("#sh-modal").html(data).show();
			}
			isShowingModal = !isShowingModal;
		});
		
	}
	

	function update(){
		var result = apporach1_BreadthFirstSearch();
		chrome.runtime.sendMessage({data:result,update:true},function(e){
			
		});
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
	function updatePanel(data){

		var isFound = data.findSolution? "<span class=''>是</span>" : "<span class=''>否</span>";
		console.log(data);
		$("#sh-suggestion-find").html("是否找到："+isFound);
		$("#sh-suggestion-count").html("选择数量："+data.count);
		$("#sh-suggestion-path").html("元素路径：<kbd>"+data.path+"</kbd>");
		$("#sh-suggestion-recommend").html("建议选择：<code>"+data.recommend+"</code>");
		$("#sh-suggestion-suggestion").html("备用选择：<code>"+data.suggestion+"</code>");
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
