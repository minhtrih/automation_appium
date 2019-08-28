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
  const xpath_btn_start =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.TextView';
  const xpath_accept =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.TextView[2]';
  const xpath_input_phone_number =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.viewpager.widget.ViewPager/android.widget.ScrollView/android.widget.LinearLayout/android.widget.RelativeLayout[1]/android.widget.EditText';
  const xpath_input_password =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.viewpager.widget.ViewPager/android.widget.ScrollView/android.widget.LinearLayout/android.widget.RelativeLayout[2]/android.widget.EditText';
  const xpath_md_button_default_positive =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.TextView';

  const btn_start = await driver.waitForElementByXPath(xpath_btn_start, 5000);
  await btn_start.click();

  const accept = await driver.waitForElementByXPath(xpath_accept);
  await accept.click();

  const input_phone_number = await driver.waitForElementById(
    'com.bplus.vtpay:id/edt_phone_number',
    10000
  );
  await input_phone_number.sendKeys(phoneNumber);

  const input_password = await driver.waitForElementById(
    'com.bplus.vtpay:id/edt_password'
  );
  await input_password.sendKeys(passLogin);

  const md_button_default_positive = await driver.waitForElementById(
    'com.bplus.vtpay:id/md_buttonDefaultPositive',
    5000
  );
  await md_button_default_positive.click();

  return 'success';
}

app.get('/login', async (req, res) => {
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

async function getBalance() {
  const view_money = await driver.waitForElementById(
    'com.bplus.vtpay:id/view_money'
  );
  await view_money.click();

  const money = await driver.waitForElementById(
    'com.bplus.vtpay:id/login_register',
    5000
  );
  const get_balance = await money.getAttribute('text');
  return get_balance;
}

app.get('/otp/:otp', async (req, res) => {
  const dataFormUrl = req.params;
  console.log('otp: ', dataFormUrl);
});

app.get('/recharge/:receiver/:amount', async (req, res, next) => {
  const dataFormUrl = req.params;
  console.log('dataFormUrl: ', dataFormUrl);
  try {
    const balance = (await getBalance()) || 0;
    if (balance <= dataFormUrl.amount) {
      res.send("Don't have enough balance");
      return;
    }

    const xpath_choose_recharge =
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/androidx.viewpager.widget.ViewPager/android.view.ViewGroup/android.widget.ScrollView/androidx.recyclerview.widget.RecyclerView/android.widget.FrameLayout[2]/androidx.recyclerview.widget.RecyclerView/android.widget.LinearLayout/android.widget.FrameLayout/androidx.recyclerview.widget.RecyclerView/android.widget.LinearLayout[3]/android.widget.TextView';
    const choose_recharge = await driver.waitForElementByXPath(
      xpath_choose_recharge,
      5000
    );
    await choose_recharge.click();

    const xpath_btn_understand =
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.Button';
    const btn_understand = await driver.waitForElementById(
      'com.bplus.vtpay:id/btn_understend',
      5000
    );
    btn_understand.click();

    const xpath_permission_allow_button =
      '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.Button[2]';
    const permission_allow_button = await driver.waitForElementById(
      'com.android.packageinstaller:id/permission_allow_button',
      5000
    );

    const xpath_edt_phone =
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.RelativeLayout[1]/android.widget.EditText';
    const input_edt_phone = await driver.waitForElementById(
      'com.bplus.vtpay:id/edt_phone',
      5000
    );
    await input_edt_phone.sendKeys(dataFormUrl.receiver);

    const xpath_edt_amount =
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.RelativeLayout[2]/android.widget.EditText';
    const input_edt_amount = await driver.waitForElementById(
      'com.bplus.vtpay:id/edt_amount'
    );
    await input_edt_amount.sendKeys(dataFormUrl.amount);

    const xpath_tv_send =
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.Button';
    const btn_tv_send = await driver.waitForElementById(
      'com.bplus.vtpay:id/tv_send'
    );
    await btn_tv_send.click();

    const xpath_confirm =
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout[2]/android.widget.Button';
    const btn_confirm = await driver.waitForElementById(
      'com.bplus.vtpay:id/btn_confirm',
      5000
    );
    await btn_confirm.click();

    const arr_password = passLogin.split('');
    for (let i of arr_password) {
      const btn_number = await driver.waitForElementById(
        `com.bplus.vtpay:id/btn_${arr_password[i]}`
      );
      await btn_number.click();
    }

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
