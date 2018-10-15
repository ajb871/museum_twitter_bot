//**********Modules & Variables ***********//
//Twit module & Config//
const Twit = require('twit');
const config = require('./config.js');
//Google-images module & config//
const GoogleImages = require('google-images');
const config_g = require('./config_g.js')

//Create Twit & Google Search client objs
const T = new Twit(config);
const client = new GoogleImages(config_g.cse_id,config_g.api_key);

//Use child_process.exec to run cmd in Command line from node
const exec = require('child_process').exec;
//fs - Node package for reading files
const fs = require('fs');
const request = require('request');

//Command string to run processing sketch from terminal using processing-java.exe
const cmd = 'processing-java --sketch="%cd%\\my_sketch" --run';

//************Functions***************//
//Download images locally using Request
var download_image = (url, filename, callback) =>{
	request.head(url, (err,response,body)=>{
		console.log('content-type:', response.headers['content-type']);
		//Save response as filename 
		request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
	})
}
//Image search from google API
var search_images = () =>{
	console.log('executing image search...');
	//Keyword to be searched
	let keyword = 'squidward';
	client.search(keyword, {size: 'small'})
		.then(images = (response) =>{
			//Choose random image from array of results:
			let rand = Math.floor(Math.random() * response.length);
			let img_result = response[rand];
			console.log('\nimage search complete!');
			console.log(`url: ${img_result.url}\n`);
			//Download found image from URL (with download_image() func)
			console.log('proceeding to download...\n');
			download_image(img_result.url,'images/input.png',()=>{
				//Callback:
				console.log('download complete!\n');
				//Run processing and Send the Tweet!
				send_tweet();
			});
		})
		.catch((err)=>{ //error handling
			console.log(`image search error! ${err}`);
		});
}

//Function to run processing sketch & send tweet!
var send_tweet =()=>{
	console.log('executing sketch command...\n');
	//Execute command to launch processing sketch:
	exec(cmd, (err,stdout,stderr) => {
		if (err) { //error catching
			console.log(`exec error! ${err}`);
			return; //end function
		}
		console.log(`stdout- ${stdout}`);
		console.log(`stderr- ${stderr}`);
		console.log('sketch complete!\n'); //yay!

		///Start Posting to Twitter///
		console.log('posting to twitter...')
		var filename = 'my_sketch/output.png'; //output image from processing sketch
		var params = {
		encoding: 'base64'
		}
		var b64 = fs.readFileSync(filename, params); //read image file in base 64		
		
		var tweeted = (err,data,response) =>{ //callback function
			if (err){
				console.log(`error! ${err}`);
				return;
			} else {
				console.log('post success!');
				//Run in browser to check success!
				exec('start https://twitter.com/tweetmuseum_bot');
			}
		}
		var uploaded = (err, data, response) =>{ //calback function
			var id = data.media_id_string; //id of uploaded image
			var tweet = {
				status: 'here you go.... #processing #node', //text
				media_ids: [id] //image id
			}
			//Post to Twitter!
			T.post('statuses/update', tweet, tweeted); 
		}

		T.post('media/upload', {media_data: b64 }, uploaded); //upload media to Twitter
	});
}

var search_tweets = () =>{
//COMMIT

	
}