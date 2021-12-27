var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require('firebase/database');

var database = firebase.database();
var firestore = firebase.firestore();

module.exports.add_bot = async function(task, key, driver, webdriver) {
  // Wait if login doing
  await driver.wait(webdriver.until.elementIsNotVisible(driver.findElement(webdriver.By.id('loadingScreen'))), 240000);

  // Execution
  console.log('- Start add_bot task ');
  await driver.executeScript('document.querySelector(\'a[href="#/HaasBots"]\').click()');
  await driver.wait(webdriver.until.elementIsVisible(driver.findElement(webdriver.By.xpath('//div[@id="HaasBotsLandingPageNewBot"]'))), 120000);
  await driver.findElement(webdriver.By.xpath('//div[@id="HaasBotsLandingPageNewBot"]')).click();

  // Enter Name popup
  var locator = webdriver.By.xpath('//div[@class="garbage ui-draggable"]/div[text()="New Bot"]/following::input');
  var input = driver.wait(webdriver.until.elementLocated(locator));
  if(await input) {
    input.sendKeys(task.data['id']);
    await driver.findElement(webdriver.By.xpath('//div[@class="garbage ui-draggable"]/div[text()="New Bot"]/following::div[text()="Save"]')).click();
  }

  // Spot {
  if(task.data['Bot'] == 'spot') {
    // Select bot script popup
    locator = webdriver.By.xpath('//div[@class="garbage ui-draggable elementPopup"]/div[@class="elements"]/div[contains(text(), "Haasonline Original - Flash Crash Bot")]');
    var script = driver.wait(webdriver.until.elementLocated(locator));
    if(await script) {
      script.click();
    }

    // Wait for bot page loading
    await driver.wait(webdriver.until.elementIsVisible(driver.findElement(webdriver.By.className('haasBotsPage customBotFullScreen'))), 120000);

    // Select Account and Market
    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]');
    var account = driver.wait(webdriver.until.elementLocated(locator));
    if(await account) {
      // Select account
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }

    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="new-tooltip-handler"][text()="Market:"]/following::input');
    var marketInput = driver.wait(webdriver.until.elementLocated(locator));
    if(await marketInput) {
      // Select market
      await marketInput.clear();
      await marketInput.sendKeys(task.data['Market']);
    }

    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]');
    var market = driver.wait(webdriver.until.elementLocated(locator));
    if(await market) {
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }

    // Set settings
    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Base Price"]/following::input');
    var basePrice = driver.wait(webdriver.until.elementLocated(locator));
    if(await basePrice) {
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Base Price"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['BasePrice']+'";');

      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="No Buy Orders"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['Buy']+'";');
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="No Sell Orders"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['Sell']+'";');

      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Order Size"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['OrderSize']+'";');

      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Price Spread (%)"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['Spread']+'";');
    }

    // Save
    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@id="HaasScriptBotsSave"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
  }
  // } Spot
  // Futures {
  if(task.data['Bot'] == 'futures') {
    // Select bot script popup
    locator = webdriver.By.xpath('//div[@class="garbage ui-draggable elementPopup"]/div[@class="elements"]/div[contains(text(), "CSTM GRID TACTIC")]');
    var script = driver.wait(webdriver.until.elementLocated(locator));
    if(await script) {
      script.click();
    }

    // Wait for bot page loading
    await driver.wait(webdriver.until.elementIsVisible(driver.findElement(webdriver.By.className('haasBotsPage customBotFullScreen'))), 120000);

    // Select Account and Market
    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]');
    var market = driver.wait(webdriver.until.elementLocated(locator));
    if(await market) {
      // Select market
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }

    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]');
    var account = driver.wait(webdriver.until.elementLocated(locator));
    if(await account) {
      // Select account
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }

    // Select opotision
    if(task.data['Oposition'] == 'long') {
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="01. Allow Long"]//following::label\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }
    else {
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="02. Allow Short"]//following::label\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }

    // Level settings
    switch (task.data['Level']) {
      case 0:
        // Level 0
        spread_long = 1.6;
        spread_short = 2.4;
        cancel_distance = 0.8;
        take_profit = 0.47;
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

    // await driver.findElement(webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@id="HaasScriptBotsSave"]')).click();

    // Slot size
    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="02. Slot Size"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['SlotSize']+'";');

    // Max Open Contracts
    if(task.data['Level'] === 0) {
      let max_open_contracts = parseFloat(task.data['SlotSize']) * 70;
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[contains(text(), "01. Max. Open")]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+max_open_contracts+'";');
    }
    else {
      let max_open_contracts = parseFloat(task.data['SlotSize']) * 110;
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[contains(text(), "01. Max. Open")]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+max_open_contracts+'";');
    }

    // Save
    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@id="HaasScriptBotsSave"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
  }
  // } Futures
  // Futures Pro {
  if(task.data['Bot'] == 'futurespro') {
    // Select bot script popup
    locator = webdriver.By.xpath('//div[@class="garbage ui-draggable elementPopup"]/div[@class="elements"]/div[contains(text(), "Kgbx")]');
    var script = driver.wait(webdriver.until.elementLocated(locator));
    if(await script) {
      script.click();
    }

    // Wait for bot page loading
    await driver.wait(webdriver.until.elementIsVisible(driver.findElement(webdriver.By.className('haasBotsPage customBotFullScreen'))), 120000);

    // Select Account and Market
    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]');
    var market = driver.wait(webdriver.until.elementLocated(locator));
    if(await market) {
      // Select market
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="selectlist favorite-markets"]/div[contains(text(), "'+task.data['Market']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }

    locator = webdriver.By.xpath('//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]');
    var account = driver.wait(webdriver.until.elementLocated(locator));
    if(await account) {
      // Select account
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@class="script-bot-parameters"]//div[text()="Account:"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['PriceDriver']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }

    // Select opotision
    if(task.data['Oposition'] == 'long') {
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Allow Longs"]//following::label\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }
    else {
      await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="Allow Shorts"]//following::label\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
    }

    // Trade Amount
    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[text()="Trade Amount:"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['TradeAmount']+'";');

    // Set settings
    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="1. Base MA Length"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['Base_MA_Length']+'";');

    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="2. Base MA Type"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['Base_MA_Type']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');

    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="3. ATR Length"]/following::input\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value = "'+task.data['ATR_Length']+'";');

    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//span[text()="4. Price Data Timeframe"]/following::div[@class="selectlist"]/div[contains(text(), "'+task.data['Price_Data_Timeframe']+'")]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');

    // Save
    await driver.executeScript('document.evaluate(\'//div[@class="haasBotsPage customBotFullScreen scroll-page content-frame"]//div[@id="HaasScriptBotsSave"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();');
  }
  // } Futures Pro

  // Done
  try {
    await firestore.collection('users').doc(task.user).collection('Bots').doc(task.data['id']).update({'Status': 'paused'});
    await database.ref('tasks/'+key).remove();
  } catch {
    try {
      await database.ref('tasks/'+key).remove();
    } catch {
      console.log('Something went wrong');
    }
  }
}

// Just Sleep function
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
