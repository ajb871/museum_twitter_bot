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

const statuses = [`you.... are an artist....`, 'you inspired me', 'incredible....', 'this... is for you', 'i made this.. 4 u', 'you moved me', 'i see your poetic soul, it inspires me...'];
//************Functions***************//
//Download images locally using Request
const download_image = (url, filename, callback) =>{
	request.head(url, (err,response,body)=>{
		console.log('content-type:', response.headers['content-type']);
		//Save response as filename 
		request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
	})
}
//Image search from google API
const search_images = (json) =>{
	var json = json;
	var keywords = json.keywords;
	//For each keyword in the pair...
	for(let i=0;i<keywords.length;i++){
		console.log('\nexecuting image search...');
		let keyword = keywords[i];
		client.search(keyword, {size: 'small'})
			.then(images = (response) =>{
				//Choose random image from array of results:
				var rand = Math.floor(Math.random() * response.length);
				var img_result = response[rand];
				console.log('\nimage search '+i+' complete!');
				console.log(`url` +i+ `: ${img_result.url}\n`);
				//Download found image from URL (with download_image() func)
				console.log('proceeding to download...\n');
				download_image(img_result.url,'images/input'+ i + '.png',()=>{
					//Callback:
					console.log('download ' + i + 'complete!\n');
					//Run processing and Send the Tweet at end of loop!
					if(i == 1){
						send_tweet(json);
					}
				});
			})
			.catch((err)=>{ //error handling
				console.log(`image_search ` + i + ` error! ${err}`);
			});
	}
}

//Function to run processing sketch & send tweet!
const send_tweet =(json)=>{
	var tweet_id = json.tweet_id;
	var username = json.name;
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
			let rand_status = String(username + ' ' + statuses[Math.floor(Math.random()*statuses.length)]);
			console.log(rand_status);
			var tweet = {
				status: rand_status, //text
				/*in_reply_to_status_id: json.tweet_id,*/
				media_ids: [id] //image id
			}
			//Post to Twitter!
			T.post('statuses/update', tweet, tweeted); 
		}

		T.post('media/upload', {media_data: b64 }, uploaded); //upload media to Twitter
	});
}

//Function to random select a "trending sample" tweet with stream!
//Then create a JSON of the text, user id, and random keywords!
const search_tweets = () =>{
	//Create twitter stream
	const stream = T.stream('statuses/sample');
	//Look for tweets in stream
	stream.on('tweet', (tweet)=>{
		var tweet_id = tweet.id_str; //Tweet ID
		var screen_name = tweet.user.screen_name; //User Name
		if (tweet.extended_tweet == undefined){//Set text as extended text if applicable
			var text = tweet.text;
		} else { var text = tweet.extended_tweet.full_text;}

		//Split text into array of words
		text = text.split(" "); 
		console.log(text); //debugging

		if ((text.length > 6) && (tweet.lang == 'en')){ //If text atleast 8 words long (for accuracy)
			//Stop stream after finding a good one!
			stream.stop();
			//Choose_keywords returns array of randomly selected key words
			let keywords = choose_keywords(text);
			//Write JSON file from tweet to share information between node and Processing!:
			var json = {
				text_content : text,
				tweet_id : tweet_id,
				keywords : keywords,
				name : screen_name
			}
			var json_file = JSON.stringify(json);
			console.log('creating json file....');
			fs.writeFile('./tweet_content.json' ,json_file, (err)=>{
				if (err){
					console.log(`JSON creation error! ${err}`);
					return;
				}
				console.log('json created!');
				console.log(json);
				search_images(json);
			});
			//Search for images now!
			return; //end function!
		}
	});
}

//Choose random keywords!
const choose_keywords = (words) =>{
	let rand1 = Math.floor(Math.random() * words.length);
	let rand2 = Math.floor(Math.random() * words.length);

	let keywords = [words[rand1], words[rand2]];
	return keywords;
}


//Run the search process over an interval!
//setInterval(search_tweets,600000);
console.log("waiting...");

search_tweets();