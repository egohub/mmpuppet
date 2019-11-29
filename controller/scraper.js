const puppeteer = require('puppeteer');

exports.scrapeMovie = async (req, res) => {
    let ret = [];

    const  search  = req.params.id;
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(`https://channelmyanmar.org/`+search);
          
        
        await page.setViewport({
            width: 1200,
            height: 800
        });
        await page.waitFor(() => !!document.querySelector('.sbox'));
        const tweets = await page.evaluate(function () {

            const TWEET_SELECTOR = '.elemento a';
            const moviename = 'h1';
            //grab the DOM elements for the tweets
            let elements = Array.from(document.querySelectorAll(TWEET_SELECTOR));

            //create an array to return
           let ret = [];

            var name = ('h1').innerText
            console.log(name);
            //get the info from within the tweet DOM elements
            for (var i = 0; i < elements.length; i += 1) {
                let tweet = {};

                var link = elements[i].href;
                link = link.replace("https://roda.site/?r=", '')
                link = atob(link)
                tweet.link = link
                const TWEET_TEXT_B = ".b";
                tweet.text = elements[i].querySelector(TWEET_TEXT_B).textContent;

                const TWEET_TEXT_C = ".c";
                tweet.size = elements[i].querySelector(TWEET_TEXT_C).textContent;
               
                ret.push(tweet);
            }
            return ret;
        });

        ret.push(tweets);
        //close the page
        await page.close();
        //close the browser
        await browser.close();
        res.send(ret);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};
