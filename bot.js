const Twit = require('twit');
const config = require('./config.js');

//Go into Config File
var T = new Twit(config);

T.get('search/tweets', { q: 'nyu since:2018-07-11', count: 10 }, function(err, data, response) {
  console.log(data)
})

var tweet = {
	status: "uhhhhh"
}

T.post('statuses/update', tweet, tweetResults);

var tweetResults = (err,data,response) => {
	if (err) {
		console.log('post error');
	} else {
		console.log('post success');
	}
}

