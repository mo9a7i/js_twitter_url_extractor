require('colors');
const bigInt = require('big-integer');

const opn = require('opn');
const Twitter = require('twitter-lite');
const { consumer_key, consumer_secret, access_token_key, access_token_secret } = require('./config.json');

const myArgs = process.argv.slice(2);
if(myArgs.length < 1) {
	console.error('you did not supply any arguments');
	process.exit();
}
console.log('Getting tweets of ' + myArgs[0]);

const client = new Twitter({
	subdomain: 'api',
	version: '1.1',
	consumer_key: consumer_key,
	consumer_secret: consumer_secret,
	access_token_key: access_token_key,
	access_token_secret: access_token_secret,
});

const ignored_links = [
	'twitch.tv',
	'twitter.com',
	'youtube.com',
	'youtu.be',
	'github.com',
	'fllwrs.com',
];

let retreived_links = [];

let last_tweet_id = bigInt(0);
let tweets_returned_count = 0;

const parameters = {
	screen_name: myArgs[0],
	count: 200,
	trim_user: false,
	exclude_replies: false,
	include_rts: true,
	tweet_mode: 'extended',
};

function get_urls(max_tweet_id) {
	return new Promise(resolve => {
		if(max_tweet_id > 0) {
			parameters['max_id'] = parseInt(max_tweet_id);
		}

		client.get('statuses/user_timeline', parameters).then(tweets => {
			console.log(`Reteived ${tweets.length} tweets`);
			if(tweets.length > 0) {
				if(tweets.length == 1) {
					console.log(tweets[0].full_text);
				}
				tweets_returned_count += tweets.length;
				console.log(`Retreived ${tweets_returned_count} total tweets`);

				tweets.forEach(element => {
					if(element.entities && element.user.screen_name.toLowerCase() == myArgs[0].toLowerCase()) {
						if(element.entities.urls) {
							element.entities.urls.forEach(url =>{
								// Checking if the link is part of the excluded links
								let it_is_part_of_it = false;
								ignored_links.forEach(link => {
									if(url.expanded_url.includes(link)) {
										it_is_part_of_it = true;
									}
								});

								if(!it_is_part_of_it) {
									retreived_links.push({ 'url': url.expanded_url, 'date': element.created_at });
								}
							});
						}
					}
					last_tweet_id = element.id;
				});
				get_urls(bigInt(last_tweet_id).minus(1));
			}
			else{
				console.log('Reached the end of your tweets'.black.bgMagenta);
				console.log(`Total tweets is ${tweets_returned_count} total tweets`.black.bgMagenta);
				console.log('reached the end'.black.bgMagenta);
				start_http();
				resolve();
			}

		}).catch(error => console.log(error));
	});
}

function start_http() {
	// Show it in browser
	console.log('before http server creation');
	console.log((retreived_links.length + ' links found').yellow);
	if(retreived_links.length > 0) {
		console.log('reached http server creation');
		let html_content = '';
		html_content += '<h1>Found Links for ' + myArgs[0] + '</h1><ul>';
		let counter = 1;
		retreived_links.forEach(link => {
			html_content += `<li>${counter} ${link.date}: <a href="${link.url}">${link.url}</a></li>`;
			counter += 1;
		});
		html_content += '</ul>';

		const header = '';
		const body = html_content;

		const full_html = '<!DOCTYPE html>' + '<html><head>' + header + '</head><body>' + body + '</body></html>';

		const http = require('http');
		console.log('reached http server creation after');
		http.createServer(function(req, res) {
			const html = full_html;
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': html.length,
				'Expires': new Date().toUTCString(),
			});
			res.end(html);
		}).listen(8001);
		opn('http://localhost:8001/');
		console.log('reached http server after after');
	}
}

// Start the job
console.log('before'.bgYellow);
get_urls().finally(() =>{
	process.exit();
});