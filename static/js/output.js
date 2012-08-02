window.onload = function() {
	try {
		TagCanvas.Start('myCanvas','tags',{
			outlineColour: '#000000',
			outlineThickness: 1,
			reverse: true,
			depth: 0.8,
			stretchX: 1.5,
			maxSpeed: 0.02,
			textHeight: 30,
			minBrightness: 1.0,
			weight: true,
			weightMode: "colour",
			weightFrom: 'data-weight',
			weightGradient: {
				0:   '#000000',            
				1:   '#FFFFFF'
			}
		});
		} catch(e) {
			// something went wrong, hide the canvas container
			document.getElementById('myCanvasContainer').style.display = 'none';
		}
};

function showTweetCount(tweetCount, wordCount){
	document.getElementById('tweetCountText').innerHTML = tweetCount + " tweets have " + wordCount + " words.";
}