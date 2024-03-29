// import puppeteer
const puppeteer = require('puppeteer');
const  siteOneModel = require('./models/jeep-model-one');

async function getJeepPricesSiteOne(url) {


    //wait to launch puppeteer
    //try copying full x path and grabbing car prices tomorrow, pdf only generates in headless
    //open a blank pageOne
    const browser = await puppeteer.launch({headless: false, defaultViewport: null, slowMo: 250,
        args: [
        '--no-sandbox'
      ],});
      //open one broser tab at a time instead of multiple
    const [pageOne] = await browser.pages();
    pageOne.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36');
    //navigate to url
    await pageOne.goto(url);
    //wait until this selector loads, then search for my car
    await pageOne.waitForSelector('.opensearch');
    await pageOne.focus('#opensearch-widget-container input')
    await pageOne.keyboard.type('Jeep Wrangler Sahara', {delay: 100})
    await pageOne.click('.btn-cta.stat-search-submit')

    //waiting for vehicle stats to load
    await pageOne.waitForSelector('.hasVehicleInfo');

    const jeepInfoPageOne = await pageOne.evaluate(() => {
        const el = Array.from(new Set(document.querySelectorAll('.hasVehicleInfo')))
        let arr = []

        Promise.all(el.map(info => {

           let dataObj = {
               title: info.querySelector('.vehicleTitle').textContent.trim(),
               deetz: info.querySelector('.srpVehicleDetails').textContent.trim(),
               img: info.querySelector('.vehicleImg').src,
               price: info.querySelector('.priceBlock').textContent,
               
            }
          arr.push(dataObj)  
         
        })
        )
        return arr
    }
    )

    // console.log('jeeps', jeepInfo)
    let data = [...jeepInfoPageOne]
    
   
    // console.log('Data obj', data)

    for(let cars in data){
        new siteOneModel(data[cars])
          .save()
          .catch((err => console.log(err))
           )
    }
    


await browser.close()

}



getJeepPricesSiteOne('https://www.waldorfchryslerjeep.com/')
module.exports = getJeepPricesSiteOne