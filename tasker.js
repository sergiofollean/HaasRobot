var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require('firebase/database');
// const axios = require('axios');
// Add Bot
const add = require("./tasks/add_bot.js");
const update = require("./tasks/update_bot.js");

// webdriver
var fs = require("fs");
var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
const _http = require('selenium-webdriver/http');
process.env["PATH"] += ":/home/user/src/selenium/";
var driver1 = Array();
driver1['state'] = true;

var chromeOptions = new chrome.Options();
chromeOptions.addArguments('--no-sandbox');
chromeOptions.addArguments('--start-maximized');

driver = new webdriver.Builder()
             .forBrowser("chrome")
             .setChromeOptions(chromeOptions)
             .build();

driver.get("http://127.0.0.1:8090/");

(async function haas_login() {
  await driver.findElement(webdriver.By.name('username')).sendKeys("ogtrading_master");
  await driver.findElement(webdriver.By.name('password')).sendKeys("fc0848a145a0826b37582b452667fe31");
  await driver.findElement(webdriver.By.id('sendLogin')).click();
  //do_tasks();
})();

var database = firebase.database();
var firestore = firebase.firestore();

// Firebase new task hook {
const ref = database.ref('tasks');

ref.on('child_added', (snapshot, prevChildKey) => {
  const task = snapshot.val();

  if(tasks.length == 0) {
    tasks.push([task, snapshot.key]);
    do_tasks();
  }
  else {
    tasks.push([task, snapshot.key]);
  }

  // if(task.task == 'add_account') await add_account(task, snapshot.key);
  // console.log('New Task: ' + task.data['AccountPriv']);
});
// } Firebase new task hook

// Tasker {
tasks = Array();

async function do_tasks() {
  if(tasks.length == 0) {
    console.log('tasks ended');
  }

  asyncForEach(await tasks, async (task) => {
    //console.log(task[0]);
    if(task[0].task == 'add_account') await add_account(task[0], task[1]);

    if(task[0].task == 'delete_account') await delete_account(task[0], task[1]);

    if(task[0].task == 'add_bot') await add.add_bot(task[0], task[1], driver, webdriver);

    if(task[0].task == 'remove_bot') await remove_bot(task[0], task[1]);

    if(task[0].task == 'bot_start') await bot_start(task[0], task[1]);

    if(task[0].task == 'bot_stop') await bot_stop(task[0], task[1]);

    if(task[0].task == 'update_bot') await update.update_bot(task[0], task[1], driver, webdriver);

    await tasks.shift();
    do_tasks();
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
// } Tasker

// Tasks {
// Add Account
async function add_account(task, key) {
  // Wait if login doing
  await driver.wait(webdriver.until.elementIsNotVisible(driver.findElement(webdriver.By.id('loadingScreen'))), 240000);

  // Execution
  console.log('- Start add_account task');
  await driver.executeScript('document.querySelector(\'a[href="#/DriversAccounts"]\').click()');
  // console.log('# Price Drivers menu opened');
  await driver.executeScript('document.querySelector(\'#addNewAccount\').click()');
  await driver.executeScript('document.querySelector(\'#newAccountName\').value = "'+task.data['PriceDriver']+'"');

  await driver.executeScript('document.querySelector(\'#newAccountType .init\').click()');
  await driver.executeScript('document.querySelectorAll(\'#newAccountType .selectlist div\').forEach(function(el) { \
    if(el.innerText == "'+task.data['AccountType']+'") el.click(); \
  })');

  if(!task.data['Simulated']) {
    await driver.executeScript('document.querySelector(\'#newAccountPub\').value = "'+task.data['AccountPub']+'"');
    await driver.executeScript('document.querySelector(\'#newAccountPriv\').value = "'+task.data['AccountPriv']+'"');
  }
  else {
    await driver.findElement(webdriver.By.xpath('//div[@id="newAccountBox"]//label[@for="SimulatedAccount"]')).click();
  }

  await driver.executeScript('document.querySelector(\'#addAccount\').click()');

  // var status = await checkStatus(task);
  var locator = webdriver.By.xpath('//*[@id=\'accountList\']/div/div[contains(text(), \''+task.data['PriceDriver']+'\')]/following-sibling::*[@class="icon-true"] | //*[@id=\'accountList\']/div/div[contains(text(), \''+task.data['PriceDriver']+'\')]/following-sibling::*[@class="icon-false"]');
  var status_check = driver.wait(webdriver.until.elementLocated(locator));

  if(await status_check.getAttribute('class') == 'icon-true') {
    status = 'true';
  }
  else {
    status = 'false';
  }

  // await driver.wait(webdriver.until.elementLocated(webdriver.By(xpath('//*[@id=\'accountList\']/div/div[text()=\''+task.data['account_id']+'\']/following::*[@class="icon-true"]'))));
  await firestore.collection('users').doc(task.user).collection('PriceDrivers').doc(task.data['PriceDriver']).update({'Status': await status});
  await database.ref('tasks/'+key).remove();
}

// Delete Account
async function delete_account(task, key) {
  // Wait if login doing
  await driver.wait(webdriver.until.elementIsNotVisible(driver.findElement(webdriver.By.id('loadingScreen'))), 240000);

  // Execution
  console.log('- Start delete_account task '+task.data['account_id']);
  await driver.executeScript('document.querySelector(\'a[href="#/DriversAccounts"]\').click()');


  try {
      await driver.executeScript('\
      var find_element = document.evaluate("//*[@id=\'accountList\']/div/div[contains(text(), \''+task.data['account_id']+'\')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;\
      var row = find_element.closest(".row");\
      row.getElementsByClassName("fa-trash-o")[0].click();\
      \
    ');

    // Wait for fix haas lag
    await driver.wait(webdriver.until.elementLocated(webdriver.By.xpath('//*[@class=\'popup\']/div/div[text()=\'Are you sure you want to delete this account?\']')), 120000);

    await driver.executeScript('var find_element = document.evaluate("//*[@class=\'popup\']/div/div[text()=\'Are you sure you want to delete this account?\']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;\
    find_element.nextSibling.click();');

    var PriceDriver = firestore.collection('users').doc(task.user).collection('PriceDrivers').doc(task.data['account_id']).delete();
    await database.ref('tasks/'+key).remove();
  } catch {
    var PriceDriver = firestore.collection('users').doc(task.user).collection('PriceDrivers').doc(task.data['account_id']).delete();
    await database.ref('tasks/'+key).remove();
  }


}



async function remove_bot(task, key) {
  // Wait if login doing
  await driver.wait(webdriver.until.elementIsNotVisible(driver.findElement(webdriver.By.id('loadingScreen'))), 120000);

  // Execution
  console.log('- Start remove_bot task ');
  await driver.executeScript('document.querySelector(\'a[href="#/HaasBots"]\').click()');
  let atttetmps = 0;
  while (await atttetmps < 5) {
    try {
      await driver.findElement(webdriver.By.xpath('//div[@id="HaasBotLandingPageList"]//span[text()="'+task.data['id']+'"]/following::i[@class="fa fa-trash new-tooltip-handler"]')).click();
      atttetmps = 5;
      var locator = webdriver.By.xpath('//div[@class="garbage ui-draggable"]/div[text()="Delete Bot"]/following::div[@class="btn-grad button"]');
      var deleteButton = driver.wait(webdriver.until.elementLocated(locator));
      if(await deleteButton) {
        deleteButton.click();
      }
    } catch (exception) {
      await sleep(500);
      atttetmps++;
    }
  }
  await database.ref('tasks/'+key).remove();

  // await driver.findElement(webdriver.By.xpath('//div[@class="garbage ui-draggable"]/div[text()="Delete Bot"]/following::div[@class="btn-grad button"]')).click();
}

async function bot_start(task, key) {
  // Wait if login doing
  await driver.wait(webdriver.until.elementIsNotVisible(driver.findElement(webdriver.By.id('loadingScreen'))), 120000);

  // Execution
  console.log('- Start bot_start task ');
  await driver.executeScript('document.querySelector(\'a[href="#/HaasBots"]\').click()');
  await driver.executeScript('document.evaluate(\'//div[@id="HaasBotLandingPageList"]//span[text()="'+task.data['id']+'"]/ancestor::div[@class="divTableRow"]//div[@class="squaredThree"]/label\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()');

  await driver.executeScript('document.evaluate(\'//div[@id="HaasBotsLandingPageEditSelection"]//div[@id="HaasBotsLandingPageActivatedSelectedBots"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()');

  var locator = webdriver.By.xpath('//div[@class="garbage ui-draggable"]/div[text()="Activate Bots"]/following::div[text()="Activate"]');
  var activateButton = driver.wait(webdriver.until.elementLocated(locator));

  if(await activateButton) {
    await driver.executeScript('document.evaluate(\'//div[@class="garbage ui-draggable"]/div[text()="Activate Bots"]/following::div[text()="Activate"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()');

    await firestore.collection('users').doc(task.user).collection('Bots').doc(task.data['id']).update({'Status': 'active'});
    await database.ref('tasks/'+key).remove();
  }
}

async function bot_stop(task, key) {
  // Wait if login doing
  await driver.wait(webdriver.until.elementIsNotVisible(driver.findElement(webdriver.By.id('loadingScreen'))), 120000);

  // Execution
  console.log('- Start bot_stop task ');
  await driver.executeScript('document.querySelector(\'a[href="#/HaasBots"]\').click()');
  await driver.executeScript('document.evaluate(\'//div[@id="HaasBotLandingPageList"]//span[text()="'+task.data['id']+'"]/ancestor::div[@class="divTableRow"]//div[@class="squaredThree"]/label\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()');

  await driver.executeScript('document.evaluate(\'//div[@id="HaasBotsLandingPageEditSelection"]//div[@id="HaasBotsLandingPageDeactivatedSelectedBots"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()');

  var locator = webdriver.By.xpath('//div[@class="garbage ui-draggable"]/div[text()="Deactivate Bots"]/following::div[text()="Deactivate"]');
  var deactivateButton = driver.wait(webdriver.until.elementLocated(locator));

  if(await deactivateButton) {
    await driver.executeScript('document.evaluate(\'//div[@class="garbage ui-draggable"]/div[text()="Deactivate Bots"]/following::div[text()="Deactivate"]\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()');

    try {
      await firestore.collection('users').doc(task.user).collection('Bots').doc(task.data['id']).update({'Status': 'paused'});
      await database.ref('tasks/'+key).remove();
    } catch {
      await database.ref('tasks/'+key).remove();
    }
  }
}
// } Tasks

// Just Sleep function
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
