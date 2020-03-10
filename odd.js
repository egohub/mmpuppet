const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

var localUrl = 'http://localhost:8888/';
(async() => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(localUrl);
    // await page.waitFor(1500);
    var json = { leagueName: {}, matches: [] };
    var league, teams, time, odds, ou, test;
    play = { league: {}, live: {} };

    let content = await page.content();
    let $ = cheerio.load(content);
    let start = $('.GridBg1 .GridBg2 ').not('tbody[soclid="0"]') //.find('.GridItem');
    console.log(start.length);
    var startT = new Date();

    $(start).each(function(i, element) {
        var a = $(this).find('.GridItem')

        play.league = a.find('.L_Name ').text().trim();
        play.live = $(this).find('.GridItem').children().hasClass('eventRun2');
        play.team = [];
        // play.live = live;
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
            play.team.push(obj)
        })

        console.log(JSON.stringify(play, null, 2));
    })
    var endT = new Date()
    console.log(startT - endT + ' ms');
    await browser.close();
})()


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
