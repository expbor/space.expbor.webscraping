import puppeteer from "puppeteer";
import fs from 'fs';

const username = process.env.username;
const password = process.env.password;
const startUrl = process.env.startUrl;


const getQuotes = async () => {
    var quotes = [];

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    // Open a new page
    var page = await browser.newPage();


    await page.goto("https://www.freelancermap.de/login", {
        waitUntil: "domcontentloaded",
    });

    await page.type('#login', username);
    await page.type('#password', password);
    await page.locator(".col-sm-12.fm-btn.fm-btn-success").click();

    await page.waitForNavigation( {waitUntil: 'domcontentloaded'} );

    await page.goto( startUrl, {
        waitUntil: "domcontentloaded",
    });


    const arrayPages = await page.evaluate(() => Array.from(document.querySelectorAll('.open-registration-modal'), element => element.innerText));
    const lastPage = arrayPages[arrayPages.length - 2];


    try {
        do {
            const currentPage = await page.evaluate(() => Array.from(document.querySelectorAll('.active.disabled'), element => element.innerText));

            console.log("Seite " + currentPage + " von " + lastPage);


            const quotesSite = await page.evaluate(() => Array.from(document.querySelectorAll('.project-title'), element => element.innerText));
            quotes = quotes.concat(quotesSite);

            const nextAvailable = await page.$(".next.open-registration-modal");
            await nextAvailable.click();
            await page.waitForNetworkIdle(100);
        } while (true);

    } catch (error) {       
        if (error.message != "Cannot read properties of null (reading 'click')"){
            console.log(error);
        }
    };

    // // Close the browser
    await browser.close();

    return(quotes);

};


// Start the scraping

var elements = await getQuotes();

var elementsObject = { elements };

var elementsString = JSON.stringify(elementsObject);

fs.writeFile('./Data.json', elementsString, err => {
    if (err) {
      console.error(err);
    } else {
      console.log("Datei erfolgreich geschrieben");
    }
  });

