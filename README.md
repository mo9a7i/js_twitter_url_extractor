# Twitter Timeline URL Extractor

This cli nodejs application takes a twitter username as an argument then retrevies all the tweets 200 tweets at a time including replies and retweets.
The logic will ignore retweets, and then look for urls in the text and print it to an html file and open it for you.

## Installation

Simply call
`git clone https://github.com/mo9a7i/js_twitter_url_extractor`

## Usage

Also, simply call
`node index.js username`

## Libraries Used

- **Colors**: to beautify console printing
- **BigInt**: since tweet ids are longer than 15 decimals, library is needed to make calculations 
- **opn**: to open up the default browser with the generated html content
- **twitter-lite**: to interact with twitter

## Thanks to

- **iiMISHARI**: <https://www.twitch.tv/iimishari>
- **Mutlaq_777**: <https://www.twitch.tv/mutlaq_777>
- **BoDhennen**: <https://www.twitch.tv/bodhennen>