import wd from 'wd';
import chai from 'chai';
import {
  androidCaps,
  getDeviceName,
  serverConfig,
  androidApiDemos,
  SAUCE_TESTING,
  SAUCE_USERNAME,
  SAUCE_ACCESS_KEY
} from '../helpers/config';

const { assert } = chai;

const readline = require('readline-sync');

describe('Basic Android selectors', function() {
  let driver;
  let allPassed = true;

  before(async function() {
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
      app: androidApiDemos
    };

    // Start the session, merging all the caps
    await driver.init(caps);
  });

  afterEach(function() {
    console.log('passed');
    // keep track of whether all the tests have passed, since mocha does not do this
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  after(async function() {
    console.log('quit');
    // shutdown driver app
    await driver.quit();
    if (SAUCE_TESTING && driver) {
      await driver.sauceJobStatus(allPassed);
    }
  });

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
    while (flag == false) {
      try {
        const btnClose = await driver.waitForElementById(
          'com.sendo:id/btnClose'
        );
        await btnClose.click();
        flag = true;
      } catch (e) {}
    }
  }

  async function backToHomePage() {
    // console.log('back to home page');
    let flag = false;
    while (flag == false) {
      try {
        const tabHome = await driver.waitForElementById(
          'com.sendo:id/tab_home'
        );
        await tabHome.click();
        flag = true;
      } catch (e) {}
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
    await edtEmail.sendKeys('0968406618');

    const edtPassword = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.LinearLayout[2]/android.widget.EditText'
    );
    await edtPassword.sendKeys('phuong92');

    const btnLogin = await driver.waitForElementByXPath(
      '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]/android.widget.LinearLayout[2]/android.widget.ImageView[2]'
    );
    await btnLogin.click();
  }

  async function buyCard(XPathCard, contentDescCardPrice, NumberOfCards) {
    while (true) {
      try {
        const rechargePhone = await driver.waitForElementByXPath(
          '/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.RelativeLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.view.ViewGroup/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[2]/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[8]/android.widget.ImageView'
        );
        await rechargePhone.click();
        break;
      } catch (e) {}
    }

    while (true) {
      try {
        const scratchCard = await driver.waitForElementByXPath(
          '//android.view.View[@content-desc="Thẻ cào "]'
        );
        await scratchCard.click();
        break;
      } catch (e) {}
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
      } catch (e) {}
    }
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
    await inputPasswordWallet.sendKeys('458#@%10');
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

    const amountHistory = await driver.waitForElementById(
      'com.sendo:id/amount'
    );
    const readAmount = await amountHistory.getAttribute('text');

    const statusHistory = await driver.waitForElementById(
      'com.sendo:id/status'
    );
    const readStatus = await statusHistory.getAttribute('text');

    const dateHistory = await driver.waitForElementById('com.sendo:id/date');
    const readDate = await dateHistory.getAttribute('text');

    console.log('Thông tin giao dịch: ');
    console.log('Nội dung: ', readDesc);
    console.log('Số tiền: ', readAmount);
    console.log('Trạng thái: ', readStatus);
    console.log('Thời gian: ', readDate);
  }

  it('login and see transaction history', async function() {
    let activity = await driver.getCurrentActivity();
    console.log('activity ', activity);
    console.log(
      await driver.isAppInstalledOnDevice('Sendo_App_v4.0.14_apkpure.com.apk')
    );
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
    } catch (e) {}

    await tabUser();

    //login account
    await loginAccount();

    // back to home page
    await backToHomePage();

    // loop for buy card
    while (1) {
      let XPathCard = false;
      while (XPathCard == false) {
        console.log('wrong card name');
        let cardName = readline
          .question(
            'Loại thẻ: (viettel, mobifone, vinaphone, vietnammobile, gmobile) '
          )
          .toLowerCase();
        XPathCard = checkCardName(cardName);
      }

      let contentDescCardPrice = false;
      while (contentDescCardPrice == false) {
        console.log('wrong contentDescCardPrice');
        let cardPrice = readline.question(
          'Mệnh giá: (10, 20, 50, 100, 200, 300, 500) '
        );
        contentDescCardPrice = checkContentDescCardPrice(cardPrice);
      }

      let NumberOfCards = readline.question('Số lượng thẻ: ');

      await buyCard(XPathCard, contentDescCardPrice, NumberOfCards);
    }

    // await checkTransaction();
  });
});
