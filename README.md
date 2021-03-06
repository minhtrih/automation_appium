# Javascript WD Client Sample Code

## Setup

- Must have NodeJS (6+) and NPM installed (https://nodejs.org/en/)
- Install dependencies by running `npm install`

## Running Tests

- To run all of the tests, run `yarn /project/`
- To run individual tests, run `$ yarn /mocha test/path/to/test.js`

## Troubleshooting

- `Original error: '12.1' does not exist in the list of simctl SDKs. Only the following Simulator SDK versions are available on your system: x.y`
  - By default, these example tests expect IOS version 12.1
  - If 12.1 isn't available on your system, set the version by setting environment variable `IOS_PLATFORM_VERSION`
    (e.g., `IOS_PLATFORM_VERSION=11.2 $(npm bin)/mocha -t 6000000 test/path/to/test.js`), or install the iOS 12.1 SDK with Xcode.

## Docs

- Sendo
- ViettelPay
  - http://localhost:3000/reset-app : rebuild app again if error
  - http://localhost:3000/login : login user, password
  - http://localhost:3000/logout : login user, password
  - http://localhost:3000/recharge/{phone}/{amount} : input phone number and money
  - http://localhost:3000/otp/{otp} : otp of phone number
  - http://localhost:3000/exit : shutdown app
