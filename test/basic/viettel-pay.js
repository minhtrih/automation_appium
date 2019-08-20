const express = require('express');
const wd = require('wd');

const {
  androidCaps,
  getDeviceName,
  serverConfig,
  androidApiDemos,
  SAUCE_TESTING,
  SAUCE_USERNAME,
  SAUCE_ACCESS_KEY
} = require('../helpers/config');

const { phoneNumber, passLogin } = require('../helpers/infoVTPay');

const app = express();
const port = 3000;

async function login() {
  const btn_start = await driver.waitForElementByXPath(
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.TextView'
  );
  await btn_start.click();

  const accept = await driver.waitForElementByXPath(
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.TextView[2]'
  );
  await accept.click();

  await driver.sleep(10000);

  const inputPhoneNumber = await driver.waitForElementByXPath(
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.viewpager.widget.ViewPager/android.widget.ScrollView/android.widget.LinearLayout/android.widget.RelativeLayout[1]/android.widget.EditText'
  );
  await inputPhoneNumber.sendKeys(phoneNumber);

  const inputPassword = await driver.waitForElementByXPath(
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.viewpager.widget.ViewPager/android.widget.ScrollView/android.widget.LinearLayout/android.widget.RelativeLayout[2]/android.widget.EditText'
  );
  await inputPassword.sendKeys(passLogin);

  return 'success';
}

app.get('/', async (req, res) => {
  try {
    console.log('login');
    let result = await login();
    if (result === 'success') {
      res.send(result);
    }
  } catch (e) {
    res.send(e);
  }
});

app.get('/recharge/:receiver/:amount', async (req, res, next) => {
  const dataFormUrl = req.params;
  console.log('dataFormUrl: ', dataFormUrl);
  try {
    // await driver.launchApp();
    res.send('Success');
  } catch (ex) {
    res.send('Send again');
  }
  next();
});

let driver;
let allPassed = true;

async function startAppium() {
  // Connect to Appium server
  driver = SAUCE_TESTING
    ? await wd.promiseChainRemote(serverConfig)
    : await wd.promiseChainRemote(
        serverConfig,
        SAUCE_USERNAME,
        SAUCE_ACCESS_KEY
      );

  // add the name to the desired capabilities
  const sauceCaps = SAUCE_TESTING
    ? {
        name: 'Android Selectors Tests'
      }
    : {};

  const deviceName = await getDeviceName();

  // merge all the capabilities
  const caps = {
    ...androidCaps,
    ...sauceCaps,
    deviceName,
    // noReset: true,
    noSign: true,
    disableAndroidWatchers: true,
    autoLaunch: true,
    dontStopAppOnReset: true,
    app: androidApiDemos
  };

  // Start the session, merging all the caps
  return await driver.init(caps);
}

async function shutdownAppium() {
  console.log('quit');
  // shutdown driver app
  await driver.quit();
  if (SAUCE_TESTING && driver) {
    await driver.sauceJobStatus(allPassed);
  }
}

app.listen(port, async () => {
  const status = await startAppium();
  console.log('Appium started status', status);
  console.log(`Example app listening on port ${port}!`);
});

process.on('exit', async () => {
  // Add shutdown logic here.
  const status = await shutdownAppium();
  console.log('Goodbye', status);
});
