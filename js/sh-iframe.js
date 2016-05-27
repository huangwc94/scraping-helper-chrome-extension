$(function(){
	console.log(chrome);
	window.addEventListener('message', messageHandler);
	function messageHandler(e){
		if(e.data.type=="update"){
			updatePanel(e.data.data);
		}
	}
	$("#sh-action-reset").click(function(e){
			e.stopPropagation();
			parent.postMessage({type:"reset"},"*");
			$("#sh-suggestion-find").html("是否找到：<span class='bg-danger'>否</span>");
			$("#sh-suggestion-count").html("选择数量：0/0");
			$("#sh-suggestion-path").html("元素路径：<kbd></kbd>");
			$("#sh-suggestion-recommend").html("建议选择：<code></code>");
			$("#sh-suggestion-suggestion").html("备用选择：<code></code>");
			$("#sh-modal-content").html("");
			$("#sh-modal-title").html("建议选择：<code></code>");
	});
	$("#sh-action-close").click(function(e){
		parent.postMessage({type:"close"},"*");
	});
	var state = 0;

	$("#sh-action-detail").click(function(e){
		e.stopPropagation();
		parent.postMessage({type:"expand"},"*");
		$('#myModal').modal({});
	});
	$("#myModal").on("hide.bs.modal",function(){
		parent.postMessage({type:"collpse"},"*");
	});

    console.log("iframe init successful");
	function updatePanel(data){

		var isFound = data.findSolution? "<span class='bg-success'>是</span>" : "<span class='bg-danger'>否</span>";
		console.log(data);
		$("#sh-suggestion-find").html("是否找到："+isFound);
		$("#sh-suggestion-count").html("选择数量："+data.count.select + "/" +data.count.predict);
		$("#sh-suggestion-path").html("元素路径：<kbd>"+data.path+"</kbd>");
		$("#sh-suggestion-recommend").html("建议选择：<code>"+data.recommend+"</code>");

		$("#sh-suggestion-suggestion").html("备用选择：<code></code>");
		if(!data.findSolution)
			$("#sh-suggestion-suggestion").html("备用选择：<code>"+data.suggestion+"</code>");
		

		$("#sh-modal-content").html(data.modal);
		$("#sh-modal-title").html("建议选择：<code>"+data.recommend+"</code>");
	}
	function removeAllElementClass(className){
		$("."+className, window.parent.document).removeClass(className);
	}
});