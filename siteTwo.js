// import puppeteer
const puppeteer = require('puppeteer');
const siteTwoModel = require('./models/jeep-model-two');





async function getJeepPricesSiteTwo(url) {

    //wait to launch puppeteer, IT WORKS!!!!
    const browser = await puppeteer.launch({ headless: false,  defaultViewport: null, slowMo: 250,
        args: [
        '--no-sandbox'
      ],
    });
    //open a blank pageTwo
    const [pageTwo] = await browser.pages();
    pageTwo.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36');
    //navigate to url
    await pageTwo.goto(url);
    //wait until this selector loads, then search for my car
    await pageTwo.waitForSelector('#main-content .button--green');
    await pageTwo.click('#main-content .button--green')
    await pageTwo.waitForSelector('.form-control.search-make');
    await pageTwo.click('.form-control.search-make')
    await pageTwo.waitForSelector('.searchForm-wrapper')
    await pageTwo.click('.form-control.search-make')
    // await pageTwo.hover('.search-make option:nth-of-type(16)') add hover b4 click
    await pageTwo.select('select.form-control.search-make', 'Jeep')
    // await pageTwo.hover('#make_Jeep') add hover b4 click
    await pageTwo.waitForSelector('.form-control.search-make')
    await pageTwo.click('.form-control.search-model')
    await pageTwo.select('select.form-control.search-model', 'Wrangler')
    await pageTwo.focus('.search-zip')
    await pageTwo.keyboard.type('28216', {delay: 100})
    await pageTwo.click('#make-model-form-submit')
    await pageTwo.waitForSelector('.checkbox-list li:nth-of-type(1)');
    await pageTwo.click('.checkbox-list li:nth-of-type(1)')
    await pageTwo.click('.show-me-search-submit')

    //waiting for vehicle stats to load
    await pageTwo.waitForSelector('.srp-list-item');


     const jeepInfoPageTwo = await pageTwo.evaluate(() => {
     //creating an array
       const elTwo = Array.from(new Set(document.querySelectorAll('.srp-list-item')))
       let arrTwo = []
        //gimme the info
        Promise.all(elTwo.map(info => {

            let dataObjTwo = {
                title: info.querySelector('.srp-list-item-basic-info-model').textContent.trim(),
                deetz: info.querySelector('.srp-list-item-options-descriptions').textContent.trim(),
                img: info.querySelector('.srp-list-item-photo img').src,
                listPrice: info.querySelector('.srp-list-item-price').textContent.trim(),
                monthlyPrice: info.querySelector('.price-per-month').textContent.trim(), 
                mileage: info.querySelector('.srp-list-item-basic-info-value:nth-of-type(1)').textContent.trim()
            }
            arrTwo.push(dataObjTwo)
        })
        )
        return arrTwo
    })
      
    //  console.log('page two data', jeepInfoPageTwo)
    let dataTwo = [...jeepInfoPageTwo]
    console.log('data obj two', dataTwo)


    for(let carsTwo in dataTwo){
        new siteTwoModel(dataTwo[carsTwo])
          .save()
          .catch((err => console.log(err))
           )
    }

    // //saving it to folder pile path
    //  await pageTwo.pdf({path: myBusiness.filePath})


   await browser.close()
}

getJeepPricesSiteTwo('https://www.carfax.com')
module.exports = getJeepPricesSiteTwo