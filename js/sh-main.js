$(function(){
	console.log("injection complete!");
	var state = 0;
	$("*").hover(function(e){
		if(state !== 0){
			return;
		}
		removeAllElementClass("sh-hover");
		
		e.stopPropagation();
		
		
		var path = $(this).getFullPathName(true);
		var selected_node = $(this);
		//console.log(path);
		$($(this).prop("tagName").toLowerCase()).each(function(){
			var this_path = $(this).getFullPathName(true);
			if(this_path == path){
				$(this).css("border","soild");
				$(this).addClass("sh-hover");
			}
		});
		// $(this).addClass("sh-tooltip");
		// $(this).attr("data-tip","选择提示 : "+path.toLowerCase());
		updateSuggestion();
		
	});
	$("*").click(function(e){
		state = 1;
		e.stopPropagation();
		//e.preventDefault();
		
		if($(this).hasClass("sh-select")){
			$(this).removeClass("sh-select");
				// .function(){
				// 	if ($(".sh-select") === null){
				// 		state = 0;
				// 		alert("auto reset!");
				// 		return;
				// 	};
				// }
			
			
		}else{
			if($(this).prop("tagName") == $(".sh-hover").prop("tagName") || $(this).prop("tagName") == $(".sh-select").prop("tagName")){
				$(this).addClass("sh-select");
			}
			
		}
		$(".sh-hover").addClass("sh-select").removeClass("sh-hover");
		
		updateSuggestion();
		
	});
	addPanel();
	function addPanel(){
		$("body").append("<div id='sh-panel' class='sh-move-to-right'><h4>内容选择器控制面板</h4><ul><li><button id='sh-action-reset'>重新选择</button></li><li><button  id='sh-action-copy-selector'>拷贝选择器</button></li><li><button  id='sh-action-copy-content'>拷贝内容</button></li><div id='sh-suggestion'></div></div>");

		$("#sh-action-reset").click(function(e){
			e.stopPropagation();
			removeAllElementClass("sh-select");
			state = 0;
		});

		$("#sh-action-copy-selector").click(function(e){
			e.stopPropagation();
			
			
			
			$(".modal").text($("#sh-suggestion-code").text()).modal();
		});

		$("#sh-action-copy-content").click(function(e){
			e.stopPropagation();
			var data = "";
			$(".sh-select").each(function(){
				data += $(this).text();
			});
			$(".modal").text(data).modal();
		});
	}
	

	function updateSuggestion(){
		apporach1_BreadthFirstSearch();
	}

	function apporach1_BreadthFirstSearch(){
		var currentUseingClassName = state === 0 ? "sh-hover" : "sh-select";
		console.log("============================================================");
		var currentSelected = $("."+currentUseingClassName);

		var path;
		var count = currentSelected.length;
		var suggestion = "";
		var findSolution = false;
		if(currentSelected.length>0){
			path = currentSelected.getFullPathName(true);

			findSolution = true;
			var currentNode = $(currentSelected[0]);
			suggestion = "";
			while(!isCorrectSelection(currentSelected,suggestion) && currentNode.prop("tagName") !== "BODY" ){
				findSolution = false;
				console.log(currentNode);
				var classList = currentNode.attr('class')===undefined ? [] :currentNode.attr('class').split(/\s+/);

				// loop though all possible class attritube to see if we are able to succfully select 
				console.log("Current Node Class List"+currentNode.attr('class'));
				$.each(classList, function(index, item) {
					
					if(item == 'sh-select' || item == 'sh-hover' || item == ''){
						return;
					}
					console.log("Using class:"+item);
					var trival_solution = currentNode.prop("tagName").toLowerCase()+"."+item +" "+  suggestion;
					if(isCorrectSelection(currentSelected,trival_solution)){
						findSolution = true;
						suggestion = trival_solution;
						console.log("Solution Found!");
						return false;
					}
				});
				if(findSolution){
					break;
				}
				console.log("go to upper level tree for answer");
				suggestion = currentNode.prop("tagName").toLowerCase() + " "+suggestion;
				currentNode = currentNode.parent();
			}
		}
		
		if(!findSolution){
			suggestion = "找不到合适的选择器！请重试";
		}
		$("#sh-suggestion").html("元素路径："+path.toLowerCase()+"<br>选择数量："+count+"<br>选择器提示：<span id='sh-suggestion-code'>"+suggestion+"</span>");
	}

	function isCorrectSelection(currentSelected,selector){
		var selectorResult = $(selector);
		console.log("---Testing:"+selector+'---');
		console.log(currentSelected);
		console.log(selectorResult);
		console.log("--------------------------");
		if (currentSelected.length != selectorResult.length){

			return false;
		}

		// for(var i = 0 ; i < currentSelected ; i++ ){
		// 	if (selectorResult[i] != currentSelected[i]){
		// 		return false;
		// 	}
		// }
		return true;
		
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
