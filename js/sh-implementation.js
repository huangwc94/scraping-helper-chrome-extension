/*
	Linear iteration apporach fast

*/
var availableFunction = [apporach1_SimpleSearch,apporach2_BreadthFirstSearch];


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

	var predict_count = $(".sh-predict").length;

	return {path:path.toLowerCase(),count:{select:count,predict:predict_count},recommend:recommend,suggestion:suggestion,findSolution:findSolution};
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
	var predict_count = $(".sh-predict").length;
	return {path:path.toLowerCase(),count:{select:count,predict:predict_count},recommend:recommend,suggestion:current_best_solution,findSolution:findSolution};
}

/*
	Recursive BFS
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

