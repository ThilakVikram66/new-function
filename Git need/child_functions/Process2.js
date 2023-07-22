/*
Read me
    eg:-
        input = asin
        output = object contains parent asin and variation asins
        {
            V_asin: ['B0BTX6C21W', 'B0BTX881VM','B0BTX7T15Y'],
            P_asin: 'B0BTX7T15Y'
        }


*/
const {chromium} = require('playwright');




function Promiser(asin)
{
    return new Promise(res=>{
        Main(asin,res);
    })
}

async function Main(asin,res){
    try
    {
        console.log("Current Asin",asin)
        const browser = await chromium.launch();
        const context = await browser.newContext({userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"});
        const page = await context.newPage();
        await page.goto(`https://www.amazon.com/dp/${asin}`,{waitUntil:"domcontentloaded"});
        try
        {
            let data = await page.evaluate(()=>{
                if(isTwisterPage === 1)
                {
                    let variation_asin = window.Twister.dimensionalSummaryModule.dimensionCombinationToASINMap;
                    return {
                        'V_asin':Object.values(variation_asin)
                    }
                    
                }
                if(isTwisterPage === 0)
                {
                    return "Non";
                }
            });
            await browser.close();
            if(data == "Non")
            {
                res( {
                    "V_asin":asin,
                    "P_asin":asin
                });
            }
            else{
                return res({
                    "P_asin":asin,
                "V_asin":data});
            }
        }
        catch(err)
                {
                    console.log("inner error",asin);
                    Main(asin,res);
                }
    }
    catch(err)
    {
        console.log("outer error",asin);
        Main(asin,res);
    }
}
module.exports = Promiser;