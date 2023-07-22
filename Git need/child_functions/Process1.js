/*
Read me
    eg:-
        input = bsr category link
        output = {
                B00XK9CO16: { Rank: '1' },
                B00LBB4ATO: { Rank: '2' },
                B08965K9KC: { Rank: '3' }
                }


*/
const {chromium} = require('playwright');

function starter(category_link){
    return new Promise(res=>{
        res(Main(category_link));
    })
}

async function Main(category_link){
    try
    {
        let obj_to_return = {};
        const browser = await chromium.launch();
        const context = await browser.newContext({
            userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        });
        const page = await context.newPage();
        await page.goto(category_link);
        let data = await page.evaluate(
            ()=>
            {
               return document.querySelector('.p13n-desktop-grid').getAttribute('data-client-recs-list');
            }
        )
        await browser.close();
        data = JSON.parse(data);
        data.forEach(val => {
            obj_to_return[val.id] = {Rank:val.metadataMap['render.zg.rank']}
        });
        return obj_to_return;
    }
    catch(err)
    {
        console.log("Errored");
        Main(category_link);
    }
}

module.exports = Main;