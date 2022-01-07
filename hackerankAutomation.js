// node hackerankAutomation.js --source="https://www.hackerrank.com" 

let minimist= require("minimist");
let fs=require("fs");
let puppeteer=require("puppeteer");


let args=minimist(process.argv);
let configJson=fs.readFileSync("config.json","utf-8");
// console.log(configJson);
let configJso=JSON.parse(configJson);

(async function kuchbhi()
{
    let browser = await puppeteer.launch( {headless : false, args:['--start-maximized'], defaultViewport: null});

    let pages = await browser.pages();
    let page=pages[0];
    await page.goto(args.source);

    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    await page.waitForSelector("a[href='https://www.hackerrank.com/login']")
    await page.click("a[href='https://www.hackerrank.com/login']");

    await page.waitForSelector("input[name='username']")
    await page.type("input[name='username']",configJso.name, { delay: 100 })

    await page.waitForSelector("input[name='password']")
    await page.type("input[name='password']", configJso.password, {delay:100})

    await page.waitForSelector("button[data-analytics='LoginPassword']")
    await page.click("button[data-analytics='LoginPassword']")

    await page.waitForSelector("a[data-analytics='NavBarContests']")
    await page.click("a[data-analytics='NavBarContests']")

    await page.waitForSelector("a[href='/administration/contests/']")
    await page.click("a[href='/administration/contests/']")

    await page.waitForSelector("a[data-attr1='Last']");
    let numPages=await page.$eval("a[data-attr1='Last']", function(atag){
        let nps=parseInt(atag.getAttribute("data-page"));
        return nps
    })

    for(let i=1; i<=numPages; i++ ){
        await handlepage(browser, page);    
    }
  
})();

 async function handlepage(browser, page)
 {
    await page.waitForSelector("a.backbone.block-center");
    let curl= await page.$$eval("a.backbone.block-center", function(atags)
    {
        let urls=[]
        for(let i=0; i<atags.length; i++)
        {
            let curls=atags[i].getAttribute("href");
            urls.push(curls);
        }
        return urls;
    });
    
    
    for(let i=0; i<curl.length; i++)
    {
        await handleContenst(browser, curl[i]);
    }
    await page.waitForSelector("a[data-attr1='Right']");
        await page.click("a[data-attr1='Right']");
 }



async function handleContenst(browser, url)
{
    let newPage= await browser.newPage();
    await newPage.goto(args.source + url);

    await newPage.waitFor(2000);

    await newPage.waitForSelector("li[data-tab='moderators']");
    await newPage.click("li[data-tab='moderators']");

    await newPage.waitForSelector("input#moderator");
    await newPage.type("input#moderator","pepcoding_sumeet", {delay: 50});

    await newPage.keyboard.press("Enter");
    
    await newPage.waitFor(1500);
    await newPage.close();
    await newPage.waitFor(1500);
    
}