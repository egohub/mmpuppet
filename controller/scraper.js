const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
exports.scrapeOdd = async (req, res) => {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(process.env.BET_URL);
        await page.waitFor(1000);
        let content = await page.content();
        let $ = cheerio.load(content);
        let start = $('.GridBg1 .GridBg2 ').not('tbody[soclid="0"]')
        console.log(start.length);
        let mbet = [];

        $(start).each(function(i, element) {
            let  play = {};
            var a = $(this).find('.GridItem')
    
            play.league = a.find('.L_Name ').text().trim();
            play.live = $(this).find('.GridItem').children().hasClass('eventRun2');
            play.matches = [];

            var b = $(this).find('.MMGridItem');
            $(this).find('.MMGridItem').each(function() {
                var obj = {
                    home: $(this).find('td').eq(1).text().split('-vs-')[0].trim(),
                    away: $(this).find('td').eq(1).text().split('-vs-')[1].trim(),
                    body: {
                        hdp: $(this).find('td').eq(2).text().trim(),
                        odd: Number($(this).find('td').eq(3).text()) || "",
                        status: oddStatus($(this).find('td').eq(2).text().trim())
                    },
                    ftou: {
                        ou: $(this).find('td').eq(5).text().trim(),
                        odd: Number($(this).find('td').eq(6).text()) || ""
                    }
                };
                play.matches.push(obj)
            })
            mbet.push(play);
            
        });
        
        // console.log(data);
        res.send(mbet);

        return mbet;
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
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
               
                const TWEET_TEXT_D = ".d";
                tweet.quality = elements[i].querySelector(TWEET_TEXT_D).textContent;
                
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
function oddStatus(i) {
    // var url = i.split(")")[1];
    //url = url.split(".")[1];
    if (i.includes("H")) {
        i = "Home";
    } else if (i.includes("A")) {
        i = "Away";
    };
    return i;
};
