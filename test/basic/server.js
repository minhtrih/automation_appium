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

const {
  userName,
  passLogin,
  passValid
} = require('../helpers/infoUser');

const app = express();
const port = 3000;

function checkCardName(cardName) {
  let XPathCard;
  if (cardName === 'viettel') {
    XPathCard =
      '//android.webkit.WebView[@content-desc="Mua card, thẻ cào điện thoại: Viettel, Mobifone, Vinaphone online siêu rẻ | Sendo.vn"]/android.view.View[5]/android.view.View[2]/android.widget.Image';
  } else if (cardName === 'mobifone') {
    XPathCard =
      '//android.webkit.WebView[@content-desc="Mua card, thẻ cào điện thoại: Viettel, Mobifone, Vinaphone online siêu rẻ | Sendo.vn"]/android.view.View[5]/android.view.View[3]/android.widget.Image/android.widget.Image';
  } else if (cardName === 'vinaphone') {
    XPathCard =
      '//android.webkit.WebView[@content-desc="Mua card, thẻ cào điện thoại: Viettel, Mobifone, Vinaphone online siêu rẻ | Sendo.vn"]/android.view.View[5]/android.view.View[4]/android.widget.Image/android.widget.Image';
  } else if (cardName === 'vietnammobile') {
    XPathCard =
      '//android.webkit.WebView[@content-desc="Mua card, thẻ cào điện thoại: Viettel, Mobifone, Vinaphone online siêu rẻ | Sendo.vn"]/android.view.View[5]/android.view.View[5]/android.widget.Image/android.widget.Image';
  } else if (cardName === 'gmobile') {
    XPathCard =
      '//android.webkit.WebView[@content-desc="Mua card, thẻ cào điện thoại: Viettel, Mobifone, Vinaphone online siêu rẻ | Sendo.vn"]/android.view.View[5]/android.view.View[6]/android.widget.Image/android.widget.Image';
  } else {
    return false;
  }
  return XPathCard;
}

function checkContentDescCardPrice(cardPrice) {
  let contentDescCardPrice;
  if (cardPrice == 10) {
    contentDescCardPrice = '10.000đ';
  } else if (cardPrice == 20) {
    contentDescCardPrice = '20.000đ';
  } else if (cardPrice == 50) {
    contentDescCardPrice = '50.000đ';
  } else if (cardPrice == 100) {
    contentDescCardPrice = '100.000đ';
  } else if (cardPrice == 200) {
    contentDescCardPrice = '200.000đ';
  } else if (cardPrice == 300) {
    contentDescCardPrice = '300.000đ';
  } else if (cardPrice == 500) {
    contentDescCardPrice = '500.000đ';
  } else {
    return false;
  }
  return contentDescCardPrice;
}

async function closeAdvertisement(flag) {
  // console.log('closeAdvertisement');
  let count = 0
  while (flag == false) {
    // console.log(count);
    try {
      const btnClose = await driver.waitForElementById('com.sendo:id/btnClose');
      await btnClose.click();
      flag = true;
    } catch (e) {
      if (count == 5) {
        flag = true;
      } else {
        count++;
      }
    }
  }
}

async function backToHomePage() {
  // console.log('back to home page');
  let flag = false;
  while (flag == false) {
    try {
      const tabHome = await driver.waitForElementById('com.sendo:id/tab_home');
      await tabHome.click();
      flag = true;
    } catch (e) { }
  }
}

async function tabUser() {
  let tabUser;
  try {
    tabUser = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[5]'
    );
    await tabUser.click();
  } catch (e) {
    await driver.back();
    tabUser = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[5]'
    );
    await tabUser.click();
  }
}

async function loginAccount() {
  try {
    const tvFullName = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[1]/android.widget.RelativeLayout/android.widget.TextView'
    );
    await tvFullName.click();

    const btnSendoId = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.TextView[2]'
    );
    await btnSendoId.click();

    const edtEmail = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.LinearLayout[1]/android.widget.EditText'
    );
    await edtEmail.sendKeys(userName);

    const edtPassword = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.LinearLayout[2]/android.widget.EditText'
    );
    await edtPassword.sendKeys(passLogin);

    const btnLogin = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.LinearLayout[2]/android.widget.ImageView[2]'
    );
    await btnLogin.click();
  } catch {
    await driver.back();
  }
}

async function buyCard(XPathCard, contentDescCardPrice, NumberOfCards) {
  while (true) {
    try {
      const rechargePhone = await driver.waitForElementByXPath(
        '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.view.ViewGroup/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[2]/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[8]/android.widget.ImageView'
      );
      await rechargePhone.click();
      break;
    } catch (e) { }
  }

  while (true) {
    try {
      const scratchCard = await driver.waitForElementByXPath(
        '//android.view.View[@content-desc="Thẻ cào "]'
      );
      await scratchCard.click();
      break;
    } catch (e) { }
  }

  const choseCard = await driver.waitForElementByXPath(XPathCard);
  await choseCard.click();

  const chosePrice = await driver.waitForElementByXPath(
    '//android.view.View[@content-desc="' + contentDescCardPrice + '"]'
  );
  await chosePrice.click();

  const numberCards = await driver.waitForElementByXPath(
    '//android.widget.Button[@content-desc="+"]'
  );
  for (var i = 1; i < NumberOfCards; i++) {
    await numberCards.click();
  }

  while (true) {
    try {
      const buyCard = await driver.waitForElementByXPath(
        '//android.widget.Button[@content-desc="Mua ngay"]'
      );
      await buyCard.click();
      break;
    } catch (e) { }
  }

  try {
    const choseWallet = await driver.waitForElementByXPath(
      '//android.webkit.WebView[@content-desc="Mua card, thẻ cào điện thoại: Viettel, Mobifone, Vinaphone online siêu rẻ | Sendo.vn"]/android.view.View/android.view.View[2]/android.view.View'
    );
    await choseWallet.click();
    const payCard = await driver.waitForElementByXPath(
      '//android.widget.Button[@content-desc="Thanh toán"]'
    );
    await payCard.click();
    const inputPasswordWallet = await driver.waitForElementByXPath(
      '//android.webkit.WebView[@content-desc="Mua card, thẻ cào điện thoại: Viettel, Mobifone, Vinaphone online siêu rẻ | Sendo.vn"]/android.view.View[17]/android.view.View/android.app.Dialog/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View/android.widget.EditText'
    );
    await inputPasswordWallet.sendKeys(passValid);
  } catch (error) {
    console.log("Ví không đủ tiền thanh toán");
  }
  // const accuracy = await driver.waitForElementByXPath('//android.widget.Button[@content-desc="Xác thực"]');
  // await accuracy.click().sleep(20000);
  const ivBack = await driver.waitForElementById('com.sendo:id/ivBack');
  await ivBack.click();
  await backToHomePage();
}

// checking buy card history
async function checkTransaction() {
  await tabUser();
  const llSenpayAccount = await driver.waitForElementByXPath(
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout[3]/android.widget.LinearLayout/android.widget.RelativeLayout[7]/android.widget.ImageView[2]'
  );
  await llSenpayAccount.click();
  const btnMore = await driver.waitForElementByXPath(
    '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.RelativeLayout[2]/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.LinearLayout[2]/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.TextView'
  );
  await btnMore.click();

  const descHistory = await driver.waitForElementById('com.sendo:id/desc');
  const readDesc = await descHistory.getAttribute('text');

  const amountHistory = await driver.waitForElementById('com.sendo:id/amount');
  const readAmount = await amountHistory.getAttribute('text');

  const statusHistory = await driver.waitForElementById('com.sendo:id/status');
  const readStatus = await statusHistory.getAttribute('text');

  const dateHistory = await driver.waitForElementById('com.sendo:id/date');
  const readDate = await dateHistory.getAttribute('text');

  console.log('Thông tin giao dịch: ');
  console.log('Nội dung: ', readDesc);
  console.log('Số tiền: ', readAmount);
  console.log('Trạng thái: ', readStatus);
  console.log('Thời gian: ', readDate);
}

app.get('/transaction/:cardNameValue/:cardPriceValue/:numberCardValue', async (req, res, next) => {
  const dataFormUrl = req.params;
  console.log('dataFormUrl: ', dataFormUrl);
  try {
    // await driver.launchApp();
    await closeAdvertisement(false);
    try {
      const content = await driver.waitForElementByXPath(
        '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout'
      );
      if (content !== undefined) {
        await content.click();
        const backButton = await driver.waitForElementByXPath(
          '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button[1]'
        );
        await backButton.click();
      }
    } catch (e) { }

    await tabUser();

    //login account
    await loginAccount();

    // back to home page
    await backToHomePage();

    const cardName = dataFormUrl.cardNameValue.toLowerCase();
    const XPathCard = checkCardName(cardName);
    if (XPathCard == false){
      res.send('Sai tên thẻ');
    }

    const cardPrice = dataFormUrl.cardPriceValue;
    const contentDescCardPrice = checkContentDescCardPrice(cardPrice);
    if (contentDescCardPrice == false) {
      res.send('Sai mệnh giá thẻ');
    }

    let numberOfCards = dataFormUrl.numberCardValue;
    console.log(numberOfCards);
    while(true) {
      let buyLimitCard;
      if (numberOfCards>10) {
        buyLimitCard = 10;
        numberOfCards = numberOfCards - 10;
      } else {
        buyLimitCard = numberOfCards;
        numberOfCards = 0;
      }
      console.log(numberOfCards);
      await buyCard(XPathCard, contentDescCardPrice, buyLimitCard);
      if (numberOfCards == 0) {
        console.log('done');
        break;
      };
    }
    res.send('Success');
  } catch (ex) {
    res.send("Send again");
    try {
      await driver.launchApp();
      console.log(launchAPP);
    } catch (error) {
      await startAppium();
      console.log(startAppium);
    }
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
    noReset: true,
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
  console.log('Goodbyte', status);
});