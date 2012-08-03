var twitter = {
	screenName : "",
	collectedData : {},
	collectedDataSize : 0,
	lastId : 0,
	
	callTwitterAPI: function(callback, maxId){ //call twitter api using jsonp
		var head= document.getElementsByTagName('head')[0];
		var script= document.createElement('script');
		script.type= 'text/javascript';
		api = "http://api.twitter.com/1/statuses/user_timeline.json?suppress_response_codes&trim_user=true&include_rts=true&exclude_replies=true&count=200&callback="+callback+"&screen_name="+this.screenName;
		if(maxId != 0)
			api += "&max_id=" + maxId;
		script.src = api;
		head.appendChild(script); 
	},
	
	sendDataToServer: function(){	//process the collectedData and send it to server
		var tweetStat = {};
		var wordArr = [];
		var wordCount = 0;
		var tweetText = '';
		
		for (var key in this.collectedData) {	//create an object 'tweetStat' with wordCount as key and tweetCount as value
			tweetText = this.collectedData[key];
			tweetText = tweetText.replace(/\s/g,' ');
			wordArr = tweetText.split(' ');
			wordCount = 0;
			for (var j = 0; j < wordArr.length; j++){
				if (wordArr[j].length > 0)
					wordCount++;
			}
			if (wordCount in tweetStat)
				tweetStat[wordCount] += 1;
			else
				tweetStat[wordCount] = 1;
		}
		
		document.getElementById("twitterData").value = JSON.stringify(tweetStat);
		document.getElementById("dataForm").submit();
	},

	takeRequiredData: function(data){	//take only id and text from each tweet data
		var len = data.length;
		if(len > 1){ //api with max_id parameter returns a single tweet data if there are no more tweets
			this.lastId = data[len-1].id_str;
			
			for(var i=0; i<data.length; i++){
				if(this.collectedDataSize >= 1000)
					break;
				if(!(data[i].id_str in this.collectedData)){
					this.collectedData[data[i].id_str] = data[i].text;
					this.collectedDataSize++;
				}
			}
			
			if(this.collectedDataSize < 1000) //repeat api call until we get data of 1000 tweets
				this.callTwitterAPI("twitter.takeRequiredData", this.lastId);
			else
				this.sendDataToServer();
		}else
			this.sendDataToServer();
	},

	parseFirstResponse: function(data){
		document.getElementById("errorMsg").innerHTML = "";
		document.getElementById("errorResponse").innerHTML = "";
		
		if ("error" in data){	//handling errors that the api returns
			document.body.style.cursor = 'auto';
			var errorResponse = "";
			document.getElementById("errorMsg").innerHTML = "Error: " + data.error;
			if(data.error == "Not found")
				errorResponse = "Bad twitter Username or error.";
			else if(data.error == "Not authorized")
				errorResponse = "Twitter timeline might not be public.";
			document.getElementById("errorResponse").innerHTML = errorResponse;
		} 
		else if(data.length == 0){
			document.body.style.cursor = 'auto';
			document.getElementById("errorMsg").innerHTML = "The user might have zero tweets on twitter!";
		}
		else
			this.takeRequiredData(data);
	}
};

function detectEnterPress(e){
	var keynum; // set the variable that will hold the number of the key that has been pressed.
	
	if(window.event) // (IE)
	{keynum = e.keyCode;}

	else if(e.which) // (other browsers)
	{keynum = e.which;}
	if(keynum == 13){ // this is Enter (keyascii code 13)
		onSubmit();
	}
}

function setFocus(elementId){
	document.getElementById(elementId).focus()
}

function onSubmit(){ 
	var screenName = document.getElementById('screenNameTextbox').value;
	if(screenName.length > 0){	
		document.body.style.cursor = 'wait';
		twitter.screenName = encodeURIComponent(screenName);
		twitter.callTwitterAPI('twitter.parseFirstResponse', 0);
	}
}

