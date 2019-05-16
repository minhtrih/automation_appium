const { exec } = require('child_process');

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
