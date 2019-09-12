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

// Kiểm tra policy vtpay
async function checkPolicy() {
  const xpath_btn_start =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.TextView';
  const xpath_accept =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.TextView[2]';

  const id_btn_start = 'com.bplus.vtpay:id/btn_start';
  const id_btn_accept = 'com.bplus.vtpay:id/accept';

  const check_btn_start = await driver.hasElementById(id_btn_start);
  if (check_btn_start) {
    const btn_start = await driver.waitForElementByXPath(xpath_btn_start, 5000);
    await btn_start.click();
    const accept = await driver.waitForElementByXPath(xpath_accept, 5000);
    await accept.click();
  }
}

// Kiểm tra có thông báo hiện lên không
async function checkNotification() {
  const xpath_md_button_default_positive =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.TextView';
  const id_md_button_default_positive =
    'com.bplus.vtpay:id/md_buttonDefaultPositive';
  await driver.sleep(2000);
  const check_md_button_default_positive = await driver.hasElementById(
    id_md_button_default_positive
  );
  if (check_md_button_default_positive) {
    const md_button_default_positive = await driver.waitForElementByXPath(
      xpath_md_button_default_positive,
      5000
    );
    await md_button_default_positive.click();
  }
}

// Đăng nhập vào ví viettelpay
async function login() {
  const xpath_input_phone_number =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.viewpager.widget.ViewPager/android.widget.ScrollView/android.widget.LinearLayout/android.widget.RelativeLayout[1]/android.widget.EditText';
  const xpath_input_password =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/androidx.viewpager.widget.ViewPager/android.widget.ScrollView/android.widget.LinearLayout/android.widget.RelativeLayout[2]/android.widget.EditText';

  const id_input_phone_number = 'com.bplus.vtpay:id/edt_phone_number';
  const id_input_password = 'com.bplus.vtpay:id/edt_password';

  await checkPolicy();

  const input_phone_number = await driver.waitForElementById(
    id_input_phone_number,
    30000
  );
  await input_phone_number.sendKeys(phoneNumber);

  const input_password = await driver.waitForElementById(id_input_password);
  await input_password.sendKeys(passLogin);

  await driver.sleep(5000);
  // sai mật khẩu
  const xpath_md_content = '';
  const id_md_content = 'com.bplus.vtpay:id/md_content';
  const check_md_content = await driver.elementByIdIfExists(id_md_content);
  if (check_md_content) {
    const get_notice = await check_md_content.getAttribute('text');
    if (get_notice.includes('sai mật khẩu')) {
      await checkNotification();
      return get_notice;
    }
  }
  // tài khoản không tồn tại
  const xpath_content =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.TextView[2]';
  const id_content = 'com.bplus.vtpay:id/content';
  const check_content = await driver.elementByIdIfExists(id_content);
  console.log('TCL: login -> check_content', check_content);
  if (check_content) {
    const get_notice = await check_content.getAttribute('text');
    if (check_content.includes('chưa đăng dịch vụ')) {
      const xpath_cancel_btn =
        '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.TextView[1]';
      const id_cancel_btn = 'com.bplus.vtpay:id/cancel_btn';
      await driver.waitForElementById(id_cancel_btn, 5000).click();
      return get_notice;
    }
  }
  await checkNotification();
  return 'success';
}

// Kiểm tra số dư trong ví
async function getBalance() {
  let get_balance = '';
  const money = await driver.waitForElementById(
    'com.bplus.vtpay:id/login_register',
    5000
  );
  get_balance = await money.getAttribute('text');
  if (get_balance === '******') {
    const view_money = await driver.waitForElementById(
      'com.bplus.vtpay:id/view_money',
      5000
    );
    await view_money.click();
  }
  await driver.sleep(2000);
  get_balance = await money.getAttribute('text');
  return get_balance;
}

async function checkBTN(xpath_btn, id_btn) {
  await driver.sleep(2000);
  const check_btn = await driver.hasElementById(id_btn);
  if (check_btn) {
    const element_btn = await driver.waitForElementByXPath(xpath_btn, 5000);
    element_btn.click();
  }
}

// Nạp tiền
async function recharge(data) {
  for (let i = 1; i < 9; i++) {
    const xpath_choose_recharge = `/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/androidx.viewpager.widget.ViewPager/android.view.ViewGroup/android.widget.ScrollView/androidx.recyclerview.widget.RecyclerView/android.widget.FrameLayout/androidx.recyclerview.widget.RecyclerView/android.widget.LinearLayout/android.widget.FrameLayout/androidx.recyclerview.widget.RecyclerView/android.widget.LinearLayout[${i}]/android.widget.TextView`;
    const choose_recharge = await driver.waitForElementByXPath(
      xpath_choose_recharge,
      5000
    );
    const text_content = await choose_recharge.getAttribute('text');
    if (text_content === 'Nạp ĐT') {
      await choose_recharge.click();
      break;
    }
  }

  // Điều lệ
  await checkBTN(
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.Button',
    'com.bplus.vtpay:id/btn_understend'
  );

  // Quyền kết nối tới danh bạ
  await checkBTN(
    '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.Button[2]',
    'com.android.packageinstaller:id/permission_allow_button'
  );

  const xpath_edt_phone =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.RelativeLayout[1]/android.widget.EditText';
  const id_edt_phone = 'com.bplus.vtpay:id/edt_phone';
  const input_edt_phone = await driver.waitForElementByXPath(
    xpath_edt_phone,
    5000
  );
  await input_edt_phone.sendKeys(data.receiver);

  const xpath_edt_amount =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.RelativeLayout[2]/android.widget.EditText';
  const id_edt_amount = 'com.bplus.vtpay:id/edt_amount';
  const input_edt_amount = await driver.waitForElementByXPath(xpath_edt_amount);
  await input_edt_amount.sendKeys(data.amount);

  const xpath_tv_send =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.Button';
  const id_tv_send = 'com.bplus.vtpay:id/tv_send';
  const btn_tv_send = await driver.waitForElementByXPath(xpath_tv_send);
  await btn_tv_send.click();

  const xpath_btn_confirm =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout[2]/android.widget.Button';
  const id_btn_confirm = 'com.bplus.vtpay:id/btn_confirm';
  const btn_confirm = await driver.waitForElementByXPath(
    xpath_btn_confirm,
    5000
  );
  await btn_confirm.click();

  const arr_password = passLogin.split('');
  for (let i of arr_password) {
    const btn_number = await driver.waitForElementById(
      `com.bplus.vtpay:id/btn_${i}`,
      5000
    );
    await btn_number.click();
  }

  await driver.sleep(5000);
  const xpath_content =
    '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.TextView[2]';
  const id_content = 'com.bplus.vtpay:id/content';
  const check_content = await driver.elementByIdIfExists(id_content);
  if (check_content) {
    const get_notice = await check_content.getAttribute('text');
    if (check_content.includes('phiên làm việc')) {
      const xpath_confirm_btn =
        '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.TextView';
      const id_confirm_btn = 'com.bplus.vtpay:id/confirm_btn';
      await driver.waitForElementById(id_confirm_btn, 5000).click();
      return get_notice;
    }
  }

  // sai mật khẩu
  const xpath_md_content = '';
  const id_md_content = 'com.bplus.vtpay:id/md_content';
  const check_md_content = await driver.elementByIdIfExists(id_md_content);
  if (check_md_content) {
    const get_notice = await check_md_content.getAttribute('text');
    if (get_notice.includes('sai mật khẩu')) {
      await checkNotification();
      return get_notice;
    }
  }

  return 'success';
}

async function goBackHome() {
  const id_btn_go_home = 'com.bplus.vtpay:id/btn_go_home';
  const xpath_btn_go_home =
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[2]/android.widget.LinearLayout/android.widget.LinearLayout[2]';
  const btn_back_home = await driver.waitForElementById(id_btn_go_home, 5000);
  await btn_back_home.click();
}

// Lấy OTP
async function getOTP(otp) {
  const id_tv_resend = 'com.bplus.vtpay:id/tv_resend';
  const tv_resend = await driver.elementByIdIfExists(id_tv_resend);
  console.log('check_tv_resend', tv_resend);
  if (tv_resend) {
    await tv_resend.click();
    return 'Get OTP Again';
  }

  const input_otp = await driver.waitForElementById(
    'com.bplus.vtpay:id/edt_name',
    5000
  );
  await input_otp.sendKeys(otp);

  const btn_confirm = await driver.waitForElementById(
    'com.bplus.vtpay:id/btn_continue',
    5000
  );
  await btn_confirm.click();

  await goBackHome();

  await checkNotification();

  return 'Get OTP Success';
}

// API đăng nhập
app.get('/login', async (req, res) => {
  try {
    console.log('login');
    const result = await login();
    res.send(result);
  } catch (e) {
    const statusStart = await startAppium();
    const result = await login();
    res.send(result);
  }
});

// API lấy OTP
app.get('/otp/:otp', async (req, res) => {
  const dataFormUrl = req.params;
  console.log('otp: ', dataFormUrl);
  try {
    // await driver.sleep(2000);
    const result = await getOTP(dataFormUrl.otp);
    console.log('TCL: result', result);
    res.send(result);
  } catch (e) {
    res.send(e);
  }
});

// API reset lại app
app.get('/reset-app', async (req, res) => {
  const statusStart = await startAppium();
  console.log('Appium started status', statusStart);
  res.send('Reset success');
});

// API nạp tiền
app.get('/recharge/:receiver/:amount', async (req, res) => {
  const dataFormUrl = req.params;
  console.log('dataFormUrl: ', dataFormUrl);
  try {
    const balance = (await getBalance()) || 0;
    console.log('TCL: balance', balance);
    if (balance <= dataFormUrl.amount) {
      res.send({ status: 'failed', message: 'Không đủ số dư' });
      return;
    }

    console.log('recharge');
    let result = await recharge(dataFormUrl);
    if (result === 'success') {
      res.send({ status: 'success', message: 'Nạp tiền thành công' });
    } else {
      res.send({ status: 'fail', message: 'Nạp tiền thất bại' });
    }
  } catch (ex) {
    const statusStart = await startAppium();
    const result_login = await login();
    const result_rechange = await recharge(dataFormUrl);
    if (result_rechange === 'success') {
      res.send({ status: 'success', message: 'Nạp tiền thành công' });
    } else {
      res.send({ status: 'fail', message: 'Nạp tiền thất bại' });
    }
  }
});

// API tắt app
app.get('/exit', async (req, res) => {
  await driver.quit();
  res.send('Goodbye', status);
});

let driver;
let allPassed = true;
let currentTest = 'passed';

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
  const sauceCaps = SAUCE_TESTING ? { name: 'Android Selectors Tests' } : {};

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
    app: androidApiDemos,
    avdLaunchTimeout: 900000
  };

  // Start the session, merging all the caps
  return await driver.init(caps);
}

async function shutdownAppium() {
  console.log('quit');
  // shutdown driver app
  await driver.quit();
  allPassed = allPassed && currentTest === 'passed';
  if (SAUCE_TESTING && driver) {
    await driver.sauceJobStatus(allPassed);
  }
  return 'Byeeeeeeee';
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

// /hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[3]/android.widget.LinearLayout[1]/android.widget.RelativeLayout[1]/android.widget.TextView
