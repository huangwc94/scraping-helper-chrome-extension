$(function(){


	window.addEventListener('message', messageHandler);
	function messageHandler(e){
		console.log(e.data);
		if(e.data.type=="update"){
			updatePanel(e.data.data);
		}else if(e.data.type == "address"){
			$("#sh-modal-address").text(e.data.address);
		}
	}
	$("#sh-action-reset").click(function(e){
			e.stopPropagation();

			parent.postMessage({type:"reset"},"*");

			$("#sh-suggestion-count").html("选择数量：<span class='label label-danger'>0/0</span>");
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


		if(state === 0){
			setTimeout(function(){
				$('.sh-hide-on-collpse').show();
			},600);

			$(this).html("关闭详情");
			state = 1;
			parent.postMessage({type:"expand"},"*");
		}else{
			$('.sh-hide-on-collpse').hide();
			$(this).html("查看详情");
			state = 0;
			parent.postMessage({type:"collpse"},"*");
		}

	});
	$('.sh-hide-on-collpse').hide();
	$(".sh-action-view").click(function(){
		$(".sh-hide").hide();
		$("#sh-content-"+$(this).attr("data")).show();

	});


	// $("#myModal").on("hide.bs.modal",function(){
	// 	parent.postMessage({type:"collpse"},"*");
	// });

    console.log("iframe init successful");
	function updatePanel(data){


		var isFound = data.findSolution? "label label-success" : "label label-danger";


		$("#sh-suggestion-count").html("选择数量：<span class='"+isFound+"'>"+data.count.select + "/" +data.count.predict+"</span>");
		$("#sh-suggestion-path").html("元素路径：<kbd>"+data.path+"</kbd>");
		$("#sh-suggestion-recommend").html("建议选择：<code>"+data.recommend+"</code>");

		$("#sh-suggestion-suggestion").html("备用选择：<code></code>");
		if(!data.findSolution)
			$("#sh-suggestion-suggestion").html("备用选择：<code>"+data.suggestion+"</code>");


		$("#sh-modal-content").html(
			  "<div class='sh-hide' id='sh-content-text'>"  + data.modal.text_ + "</div>"
			+ "<div class='sh-hide' id='sh-content-href'>"  + data.modal.href_ + "</div>"
			+ "<div class='sh-hide' id='sh-content-src'>"   + data.modal.src_ + "</div>"
			+ "<div class='sh-hide' id='sh-content-class'>" + replaceAll(data.modal.class_,"sh-select", "") + "</div>"
			);
		$(".sh-hide").hide();
		$("#sh-content-text").show();
		$("#sh-modal-title").html("建议选择：<code>"+data.recommend+"</code>");



	}
	function removeAllElementClass(className){
		$("."+className, window.parent.document).removeClass(className);
	}
	function replaceAll(string,search, replacement) {

    	return string.split(search).join(replacement);
	};
});
