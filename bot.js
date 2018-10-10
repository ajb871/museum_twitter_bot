//Twit module & Config//
var Twit = require('twit');
var config = require('./config.js');
//Make Twit obj
var T = new Twit(config);

//Use child_process.exec to run cmd in Command line from node
var exec = require('child_process').exec;
//fs - Node package for reading files
var fs = require('fs');
var request = require('request');
//Command to run processing sketch from terminal using processing-java.exe
var cmd = 'processing-java --sketch="%cd%\\my_sketch" --run';

//Function to run processing sketch
function send_tweet(){
	console.log('executing sketch command...\n');
	exec(cmd, function(err,stdout,stderr) { //execute command! with callback
		if (err){
			console.log(`err- ${err}`); //error log
		} else {
			console.log(`stdout- ${stdout} `);
			console.log(`stderr- ${stderr} \n`);
			console.log('sketch complete!\n'); //yay!

			console.log('posting to twitter...\n')
			var filename = 'my_sketch/output.png'; //sketch image
			var params = {
			encoding: 'base64'
			}
			var b64 = fs.readFileSync(filename, params); //read image file in base 64
			T.post('media/upload', {media_data: b64 }, uploaded); //upload media to Twitter

			function uploaded(err, data, response){ //calback function
				var id = data.media_id_string; //id of uploaded image
				var tweet = {
					status: 'here you go.... #processing #node', //text
					media_ids: [id] //image id
				}
				T.post('statuses/update', tweet, tweeted); //post to twitter!
			}
			function tweeted(err,data,response){ //callback function
				if (err){
					console.log('error! ' + err);
				} else {
					console.log('post success!')
				}
			}
		}
	});	
}

//Function to download images locally using Request
function download_image(url, filename, callback){
	request.head(url, function(err,res,body){
		console.log('content-type:', res.headers['content-type']);
		//Save response as filename 
		request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
	})
}


function send_manip_image (){
	download_image('https://www.google.com/images/srpr/logo3w.png', 'images/input.png', function(){
	  console.log('done');
	  send_tweet();
	});
}

send_manip_image();