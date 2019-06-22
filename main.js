require('dotenv').config();
var request = require('request');
var cheerio = require('cheerio');
var Twitter = require('twitter');
var config = require('./config.js');
var T = new Twitter(config);

var runMode = process.env.RUN_MODE || 'no';

if (runMode !== 'live') {
   console.log(`WARN: RUN_MODE not equal to 'live' so this won't post to Twitter`);
}

var stationId = process.env.STATION_ID || null;

if (stationId === null) {
   throw new Error('STATION_ID must be defined');
}

// Fetching out stuff from flightaware
console.log(`Fetching current data for station ${stationId}`);
    
// The URL we will scrape from 
let url = `https://flightaware.com/ajax/adsb/stats.rvt?id=${stationId}`;

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var positions = { 
		adsb: 0,
		mlat: 0, 
		other: 0,
		total: 0,
	    };

	    var aircraft = {
                adsb: 0,
                mlat: 0,
                other: 0,
                total: 0,
            };

            // Once we have our results, we'll store them in the json object.

	    // this is today, which is constantly updating
	    // let adsb = $("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(8)').children('td[style*="background-color: #FAE051"]').html();
	    // let total = $("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(11)').children('td[style*="background-color: #FAE051"]').html();

	    // this is yesterday, which is static
	    let adsb = $("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(8)').children('td:nth-child(3)').html();
	    let total = $("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(11)').children('td:nth-child(3)').html();
	    let adsbPositions = $("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(3)').children('td:nth-child(3)').html();

	    positions.adsb = parseInt($("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(3)').children('td[style*="background-color: #FAE051"]').html().replace(/,/g, ''));
	    positions.mlat = parseInt($("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(4)').children('td[style*="background-color: #FAE051"]').html().replace(/,/g, ''));
	    positions.other = parseInt($("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(5)').children('td[style*="background-color: #FAE051"]').html().replace(/,/g, ''));
	    positions.total = parseInt($("table.prettyTable.fullWidth tbody").first().children('tr:nth-child(6)').children('td[style*="background-color: #FAE051"]').html().replace(/,/g, ''));

	    let update = {
		status: `${total} ✈️  flew over us yesterday... ${adsb} were ADS-B equipped 😍, and we saw ${adsbPositions} position reports.`
	    };

	    console.log(update);
	    console.log(`Post to Twitter? ${runMode}`);
	    if (runMode === 'live') {
                T.post('statuses/update', update, function(err, tweet, response) {
  	  	   if (error) throw error;
		   // console.log(tweet);
		   // console.log(response);
	        });
	    }
        }
    })
