//Twit module & Config//
var Twit = require('twit');
var config = require('./config.js');
//Make Twit obj
var T = new Twit(config);


//Use child_process.exec to run cmd in Command line from node
var exec = require('child_process').exec;
//Get current directory
var cd = __dirname;
//Command to run processing sketch from terminal using processing-java.exe
var cmd = 'processing-java --sketch=' + cd + '\\my_sketch --run';


//Function to run processing sketch
function run_sketch (){
	console.log('executing sketch command...\n');
	exec(cmd, (err,stdout,stderr) => {
		if (err){
			console.log(`err- ${err}`);
		} else {
			console.log(`stdout- ${stdout} `);
			console.log(`stderr- ${stderr} \n`);
			console.log('sketch complete!');
		}
	});

}

run_sketch();
