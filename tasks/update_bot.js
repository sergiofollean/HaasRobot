var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require('firebase/database');

var database = firebase.database();
var firestore = firebase.firestore();

module.exports.update_bot = async function update_bot(task, key, driver, webdriver) {
  // Wait if login doing
  await driver.wait(webdriver.until.elementIsNotVisible(driver.findElement(webdriver.By.id('loadingScreen'))), 240000);

  // Execution
  console.log('- Start update_bot task ');
  await driver.executeScript('document.querySelector(\'a[href="#/HaasBots"]\').click()');

  await driver.executeScript('document.evaluate(\'//div[@id="HaasBotLandingPageList"]//span[text()="'+task.data['id']+'"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.dispatchEvent(new MouseEvent("dblclick", {"bubbles": true})) ');

  await driver.wait(webdriver.until.elementIsVisible(driver.findElement(webdriver.By.className('haasBotsPage customBotFullScreen'))), 120000);


  // Spot {
  if(task.data['Bot'] == 'spot') {
    if(typeof task.data['PriceDriver'] !== 'undefined') {
      locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]');
      var account = driver.wait(webdriver.until.elementLocated(locator));
      if(await account) {
        // Select account
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
      }
    }

    if(typeof task.data['Market'] !== 'undefined') {
      locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="new-tooltip-handler"][text()="Market:"]/following::input');
      var marketInput = driver.wait(webdriver.until.elementLocated(locator));
      if(await marketInput) {
        await marketInput.clear();
        await marketInput.sendKeys(task.data['Market']);
      }

      locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]');
      var market = driver.wait(webdriver.until.elementLocated(locator));
      if(await market) {
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
      }
    }

    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Base Price"]/following::input');
    var basePrice = driver.wait(webdriver.until.elementLocated(locator));
    if(await basePrice) {
      if(typeof task.data['BasePrice'] !== 'undefined') {
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Base Price"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['BasePrice']+'";');
      }

      if(typeof task.data['Buy'] !== 'undefined') {
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="No Buy Orders"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['Buy']+'";');
      }

      if(typeof task.data['Sell'] !== 'undefined') {
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="No Sell Orders"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['Sell']+'";');
      }

      if(typeof task.data['OrderSize'] !== 'undefined') {
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Order Size"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['OrderSize']+'";');
      }

      if(typeof task.data['Spread'] !== 'undefined') {
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Price Spread (%)"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['Spread']+'";');
      }
    }
  }
  // } Spot
  // Futures {
  if(task.data['Bot'] == 'futures') {
    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]');
    var market = driver.wait(webdriver.until.elementLocated(locator));
    if(await market) {
      // Bot already opened
      // Select Market
      if(typeof task.data['PriceDriver'] !== 'undefined') {
        // Select account
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
      }

      if(typeof task.data['Market'] !== 'undefined') {
        // Select market
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
      }

      // Slot Size
      if(typeof task.data['SlotSize'] !== 'undefined') {
        // Slot size
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="02. Slot Size"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['SlotSize']+'";');

        // Max Open Contracts
        if(task.data['SlotSize_Level'] === 0) {
          let max_open_contracts = parseFloat(task.data['SlotSize']) * 70;
          await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="01. Max. Open contract(s)"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+max_open_contracts+'";');
        }
        else {
          let max_open_contracts = parseFloat(task.data['SlotSize']) * 110;
          await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="01. Max. Open contract(s)"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+max_open_contracts+'";');
        }
      }
    }

    if(typeof task.data['Oposition'] !== 'undefined') {
      // Oposition
      if(task.data['Oposition'] == 'long') {
        await driver.executeScript('\
          document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="01. Allow Long"]//following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.checked = true;\
  \
          document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="02. Allow Short"]//following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.checked = false;');
      }
      else {
        await driver.executeScript('\
          document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="01. Allow Long"]//following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.checked = false;\
  \
          document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="02. Allow Short"]//following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.checked = true;');
      }
    }

    if(typeof task.data['Level'] !== 'undefined') {
      // Level settings
      switch (task.data['Level']) {
        case 0:
          // Level 0
          spread_long = 1.6;
          spread_short = 2.4;
          cancel_distance = 0.8;
          take_profit = 0.8;
          break;
        case 1:
          // Level 1
          spread_long = 0.8;
          spread_short = 1.2;
          cancel_distance = 0.4;
          take_profit = 0.47;
          break;
        case 2:
          // Level 2
          spread_long = 0.4;
          spread_short = 0.6;
          cancel_distance = 0.2;
          take_profit = 0.47;
          break;
        default:
          console.log('Something went wrong.');
      }

      // Set settings
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="04A. Slot Spread Long %"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+spread_long+'";');

      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="04B. Slot Spread Short %"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+spread_short+'";');

      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="05. Cancel Distance %"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+cancel_distance+'";');

      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="01. Take-Profit %"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+take_profit+'";');
    }
  }
  // } Futures
  // Futures Pro {
  if(task.data['Bot'] == 'futurespro') {
    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]');
    var market = driver.wait(webdriver.until.elementLocated(locator));
    if(await market) {
      // Bot already opened
      // Select Market
      if(typeof task.data['PriceDriver'] !== 'undefined') {
        // Select account
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
      }

      if(typeof task.data['Market'] !== 'undefined') {
        // Select market
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
      }

      if(typeof task.data['TradeAmount'] !== 'undefined') {
        // Trade Amount
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[text()="Trade Amount:"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['TradeAmount']+'";');
      }

      if(typeof task.data['Base_MA_Type'] !== 'undefined') {
        // Base_MA_Type
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="2. Base MA Type"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['Base_MA_Type']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
      }

      if(typeof task.data['Base_MA_Length'] !== 'undefined') {
        // Base_MA_Length
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="1. Base MA Length"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['Base_MA_Length']+'";');
      }

      if(typeof task.data['Price_Data_Timeframe'] !== 'undefined') {
        // Price_Data_Timeframe
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="4. Price Data Timeframe"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['Price_Data_Timeframe']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
      }

      if(typeof task.data['ATR_Length'] !== 'undefined') {
        // ATR_Length
        await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="3. ATR Length"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['ATR_Length']+'";');
      }
    }
  }
  // } Futures Pro

  // Save
  var locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@id="HaasScriptBotsSave"]');
  var save_check = driver.wait(webdriver.until.elementLocated(locator));
  if(await save_check) {
    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@id="HaasScriptBotsSave"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
  }

  // Check bot status
  var locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//i[@class="fa fa-play"] | //div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//i[@class="fa fa-pause"]');
  var status_check = driver.wait(webdriver.until.elementLocated(locator));

  if(await status_check.getAttribute('class') == 'fa fa-pause') {
    status = 'active';
  }
  else {
    status = 'paused';
  }

  // Done
  await firestore.collection('users').doc(task.user).collection('Bots').doc(task.data['id']).update({'Status': status});
  await database.ref('tasks/'+key).remove();
}
