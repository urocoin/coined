# coined-uro

**coined-uro** is a high-level wrapper around [BCoin] for Uro [bcoin-uro], making it easy to
send transactions and deal with wallets/accounts. Some of the original code was
based on Fedor Indutny's [BThread][bthread], the rest was from Christopher Jeffery.

## Install

``` bash
$ npm install coined-uro
```

## Usage

Coined for Uro is a fork of Coined that focuses 
on creating a very light, low dependency web based brain wallet that signs transactions inside 
the browser in-memory so that the private keys are never stored on disk anywhere.
Part of the library will be used on the client side why the server side will provide a method of 
broadcasting transactions and providing past transaction and balance data

```js
var coined = require('coined-uro');
var utils = coined.utils;
var bcoin = coined.bcoin;
var bn = coined.bn;

var coin = coined({
  db: {
    type: 'level',
    path: './bcoin-wallet'
  },
  wallet: './bcoin-wallet.json'
});

// Add a key+pair/account to our wallet, under the label "main".
coin.addAccount({ label: 'main' });

// Send
coin.on('balance', function() {
  if (coin._sentIt) return;

  var address = 'UUZDpVu9BMmih3AUd54dVJfeVmKtyZiPzB';
  var amount = 100000; // satoshis!

  // `coin.balance()` will tell you the *entire* cumulative
  // balance of every account in your wallet.
  if (coin.balance().cmpn(amount) < 0) {
    return;
  }

  return coin.sendTo(address, amount, function(err) {
    if (err) {
      console.error('sendTo failed');
      console.error(err.message);
      return;
    }
    coin._sentIt = true;
    console.log('Sending of %s satoshis to %s succeeded.', amount, address);
  });
});

// List our addresses and their associated labels.
console.log('My wallet\'s addresses:');
coin.accounts.forEach(function(account) {
  console.log(account.label + ': ' + account.getAddress());
});
```

## Example Wallet

``` js
{
  "version": 1,
  "ts": 1402363259,
  "encrypted": false,
  "compressed": true,
  "balance": "0.10981134",
  "accounts": [
    {
      "address": "1Lzcrow4haAm6j4vyKhMeFQdHcaE1VbjTc",
      "label": "main",
      "priv": "L2bka1uvakQDLabdoPuYEwtTd8a416fjhHyEq99nmaDYeuotsfeG",
      "pub": "nFB3c1yquakfoEE1A98q1HX9hjCp3kAx3a5UHeNvfwMj",
      "balance": "0.00993134",
      "tx": 32
    },
    {
      "address": "1Q3tMMNWdu3pqqhc3Hdt3L5gS26P7FdtyD",
      "label": "secondary",
      "priv": "L2ACa1uvakQDLabdoPuaEwtTd8a416fjhHyEq99nmaDYeuotsfHf",
      "pub": "hY29VUa4xfrs4vDUd4aF3cjkMoH5xegU6VzGNBqjTtCm",
      "balance": "0.09488",
      "tx": 10
    },
    {
      "address": "1BKrkLFuyM8BsS5DuwrhPXKc8uFYmsCAAn",
      "label": "test",
      "priv": "L2KEa1uvakQDLabdoPuuEwtTd8a416fjhHyEq99nmaDYeuotsEya",
      "pub": "26srZooFArAzwtQiiQx9LZWTaCupwoVS6QTdQ7CX3QyGa",
      "balance": "0.005",
      "tx": 5
    }
  ],
  "recipients": {
    "195cjSkBUZtpw7ue7mTB6MheP8c3wLkaJe": "noodles",
    "1RVx9Ezsa3zSMc1QteHnaiTXJ64foyAGe": "maxie"
  }
}
```

## Dislaimer and Note

It is *your own* responsibility to backup and keep your wallet/privkeys safe.
The coined developer(s) will not be responsible if your coins are lost,
deleted, or stolen.

Coined automatically makes a backup of your wallet every time you write to it.
Keep this in mind when encrypting it.

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

Copyright (c) 2014, Christopher Jeffrey. (MIT License)

See LICENSE for more info.

[bcoin]: https://github.com/indutny/bcoin
[bthread]: https://github.com/indutny/bthread
