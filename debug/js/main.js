function onClick(){

}
function httpRequestAsync(pUrl, pMethod, pData, pCallback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            pCallback(xmlHttp);
    }
    xmlHttp.open(pMethod, pUrl, true); // true for asynchronous 
    xmlHttp.send(pData);
}
function resposeHandler(response) {
	var textArea = document.getElementsByName('responseData');
	textArea[0].value = response.responseText;

}
window.onload = function(){
	document.getElementById('submitButtom').addEventListener("click", function(event){
		event.preventDefault();
		var form = document.forms['myForm'];
		var url = form.elements['url'].value;
		var method = form.elements['method'].value;
		var data = form.elements['requestData'].value;
		httpRequestAsync(url, method, data, resposeHandler);
		// console.log(method);
		// console.log(url);
		// console.log(data);
	});
}