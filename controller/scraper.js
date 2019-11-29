const puppeteer = require('puppeteer');

exports.scrapeMovies = async (req, res) => {
    let ret = [];

    // const  search  = req.params.id;
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(`https://channelmyanmar.org/movies`);
        await page.setViewport({
            width: 1200,
            height: 800
        });
        await page.waitFor(() => !!document.querySelector('.boxinfo.left'));
        const tweets = await page.evaluate(function () {
            //constant selector for the actual tweets on the screen
            const TWEET_SELECTOR = '.item_1.items .item';//'.item_1.items';
            //grab the DOM elements for the tweets
            let elements = Array.from(document.querySelectorAll(TWEET_SELECTOR));

            //create an array to return
           let ret = [];

            var name = ('h1').innerText
            console.log(name);
            //get the info from within the tweet DOM elements
            for (var i = 0; i < elements.length; i += 1) {
                //object to store data
                let tweet = {};

                

                const TWEET_TEXT_B = ".tt";
                tweet.moviename = elements[i].querySelector(TWEET_TEXT_B).textContent;

                const TWEET_IMDB = ".imdb";
                tweet.rating = elements[i].querySelector(TWEET_IMDB).textContent;

                const TWEET_IMG = ".image img";
                tweet.image = elements[i].querySelector(TWEET_IMG).src;

                const TWEET_TEXT_C = ".ttx";
                tweet.content = elements[i].querySelector(TWEET_TEXT_C).textContent;
                
                const TWEET_LINK = "a";
                var link = elements[i].querySelector(TWEET_LINK).href;
                link = link.replace("https://channelmyanmar.org", 'https://mmpuppet.herokuapp.com/movie')
                tweet.link = link

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
