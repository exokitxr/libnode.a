const path = require('path');
const fs = require('fs');
const os = require('os');
const unzipper = require('unzipper');
const rimraf = require('rimraf');

lib = 'lib.zip';

const rs = fs.createReadStream(path.join(__dirname, lib));
rs.on('open', () => {
  const ws = rs.pipe(unzipper.Extract({
    path: __dirname,
  }));
  ws.on('close', () => {
    rimraf(path.join(__dirname, lib), err => {
      if (err) {
        throw err;
      }
    });
    const platform = (() => {
      if (process.env['LUMIN'] !== undefined) {
        return 'lumin';
      } else if (process.env['ANDROID'] !== undefined) {
        return 'android';
      } else {
        return os.platform();
      }
    })();
    switch (platform) {
      case 'win32': {
        ['macos', 'linux', 'android', 'ios', 'arm64', 'magicleap'].forEach(p => {
          rimraf(path.join(__dirname, lib.replace(/\.zip$/, ''), p), err => {
           if (err) {
              throw err;
            }
         });
        });
        break;
      }
      case 'darwin': {
        ['windows', 'linux', 'android', 'ios', 'arm64', 'magicleap'].forEach(p => {
          rimraf(path.join(__dirname, lib.replace(/\.zip$/, ''), p), err => {
            if (err) {
              throw err;
            }
          });
        });
        break;
      }
      case 'linux': {
        ['windows', 'macos', 'android', 'ios', 'arm64', 'magicleap'].forEach(p => {
          rimraf(path.join(__dirname, lib.replace(/\.zip$/, ''), p), err => {
            if (err) {
              throw err;
            }
          });
        });
        break;
      }
      case 'android': {
        ['windows', 'macos', 'linux', 'ios', 'magicleap'].forEach(p => {
          rimraf(path.join(__dirname, lib.replace(/\.zip$/, ''), p), err => {
            if (err) {
              throw err;
            }
          });
        });
        break;
      }
      case 'lumin': {
        ['windows', 'macos', 'linux', 'android', 'ios', 'arm64'].forEach(p => {
          rimraf(path.join(__dirname, lib.replace(/\.zip$/, ''), p), err => {
            if (err) {
              throw err;
            }
          });
        });
        break;
      }
      default: throw new Error('unknown platform: ' + platform);
    }
  });
});
rs.on('error', err => {
  if (err.code === 'ENOENT') {
    process.exit(0);
  } else {
    throw err;
  }
});

process.on('uncaughtException', err => {
  console.warn(err.stack);
});
