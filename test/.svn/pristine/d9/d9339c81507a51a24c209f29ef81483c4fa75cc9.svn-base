const path = require('path');
const { exec } = require('child_process');

const SAUCE_TESTING = process.env.SAUCE_LABS;
const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;

const sauceCaps = SAUCE_TESTING
  ? {
      name: undefined, // will be added in tests
      build: `JavaScript (wd) Sample Code ${new Date()}`,
      tags: ['e2e', 'appium', 'sample-code']
    }
  : {};

const iosCaps = {
  platformName: 'iOS',
  automationName: 'XCUITest',
  deviceName: process.env.IOS_DEVICE_NAME || 'iPhone XR',
  platformVersion: process.env.IOS_PLATFORM_VERSION || '12.1',
  app: undefined, // Will be added in tests
  // appiumVersion: '1.12.1',
  showIOSLog: false,
  ...sauceCaps
};

var getDeviceName = async function() {
  return new Promise((resolve, reject) => {
    exec('adb devices', function(err, stdout) {
      if (err) {
        return reject(err);
      }
      const match = stdout.match(/[\d\.]+:\d+/);
      resolve(match ? match[0] : '');
    });
  });
};

// Leave the Android platformVersion blank and set deviceName to a random string
// (Android deviceName is ignored by Appium but is still required)
// If we're using SauceLabs, set the Android deviceName and platformVersion to
// the latest supported SauceLabs device and version
const DEFAULT_ANDROID_DEVICE_NAME = '';
const DEFAULT_ANDROID_PLATFORM_VERSION = process.env.SAUCE_LABS ? '7.1' : '8';

const androidCaps = {
  platformName: 'Android',
  automationName: 'UiAutomator2',
  deviceName: process.env.ANDROID_DEVICE_NAME || DEFAULT_ANDROID_DEVICE_NAME,
  platformVersion:
    process.env.ANDROID_PLATFORM_VERSION || DEFAULT_ANDROID_PLATFORM_VERSION,
  app: undefined, // Will be added in tests
  appWaitActivity: '.module.home.view.HomeActivity',
  ...sauceCaps
};

// figure out where the Appium server should be pointing to
const serverConfig = SAUCE_TESTING
  ? {
      host: 'ondemand.saucelabs.com',
      port: 80
    }
  : {
      host: process.env.APPIUM_HOST || 'localhost',
      port: process.env.APPIUM_PORT || 4723
    };

// figure out the location of the apps under test
const GITHUB_ASSET_BASE = 'http://appium.github.io/appium/assets';
const LOCAL_ASSET_BASE = path.resolve(__dirname, '..', '..', 'appAPK');

let iosTestApp, androidApiDemos;
if (SAUCE_TESTING) {
  // TODO: Change thes URLs to updated locations
  iosTestApp = `${GITHUB_ASSET_BASE}/TestApp9.4.app.zip`;
  androidApiDemos = `${GITHUB_ASSET_BASE}/ApiDemos-debug.apk`;
} else {
  iosTestApp = path.resolve(LOCAL_ASSET_BASE, 'TestApp.app.zip');
  // androidApiDemos = path.resolve(LOCAL_ASSET_BASE, 'ApiDemos-debug.apk');
  androidApiDemos = path.resolve(
    LOCAL_ASSET_BASE,
    'Sendo_App_v4.0.14_apkpure.com.apk'
  );
}

module.exports = {
  iosTestApp,
  androidApiDemos,
  iosCaps,
  androidCaps,
  sauceCaps,
  getDeviceName,
  serverConfig,
  SAUCE_TESTING,
  SAUCE_USERNAME,
  SAUCE_ACCESS_KEY
};
