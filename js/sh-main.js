$(function(){
	console.log("injection complete!");
	var state = 0;
	$("*").hover(function(e){
		if(state !== 0){
			return;
		}
		removeAllElementClass("sh-hover");
		
		e.stopPropagation();
		
		
		var path = $(this).getFullPath(true);
		//console.log(path);
		$($(this).prop("tagName").toLowerCase()).each(function(){
			var this_path = $(this).getFullPath(true);
			if(this_path == path){
				$(this).css("border","soild");
				$(this).addClass("sh-hover");
			}
		});
		// $(this).addClass("sh-tooltip");
		// $(this).attr("data-tip","选择提示 : "+path.toLowerCase());
		updateSuggestion(path,$(this).attr("class"));
		
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
			$(this).addClass("sh-select");
		}
		$(".sh-hover").addClass("sh-select");
		removeAllElementClass("sh-hover");
		var path = $(this).getFullPath(true);
		var suggestion = $(this).attr("class");
		updateSuggestion(path,suggestion);
		
	});

	$("body").append("<div id='sh-clear' class='sh-move-to-right'>重新选择<div class='sh-suggestion '></div></div>");
	$("#sh-clear").click(function(e){
		e.stopPropagation();
		removeAllElementClass("sh-select");
		state = 0;
	});

	function updateSuggestion(path,suggestion){
		$(".sh-suggestion").html("元素路径："+path.toLowerCase()+"<br>选择提示："+suggestion);
	}

	function removeAllElementClass(className){
		$("."+className).removeClass(className);
	}

	$.fn.extend({
        getFullPath: function(stopAtBody){
            stopAtBody = stopAtBody || false;
            function traverseUp(el){
                var result = el,
                    pare = $(el).parent()[0];
                if (pare.tagName !== undefined && (!stopAtBody || pare.tagName !== 'BODY')){
                    result = [traverseUp(pare), result];
                }                
                return result;
            };
            return this.length > 0 ? traverseUp(this[0]) : '';
        }
    });
    $.fn.extend({
        getFullPath: function(stopAtBody){
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
