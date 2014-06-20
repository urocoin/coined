/**
 * coined - a high-level wrapper around bcoin
 * Copyright (c) 2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/coined
 */

var bcoin = require('bcoin');
var constants = bcoin.protocol.constants;
var wallet = bcoin.wallet;
var utils = require('./utils');

/**
 * Normal Protocol
 */

// Reference:
// ~/bitcoin/src/chainparams.cpp

var protocol = exports;

protocol.type = process.env.USE_TESTNET
  ? 'testnet'
  : 'normal';

var normal = protocol.normal = {};

normal.type = 'normal';

normal.seeds = [
  '128.199.204.45',
  '148.251.70.194',
  '144.76.238.2',
  '62.210.141.204',
  '162.243.193.232',
  '23.226.228.25',
  '192.99.3.15',
  '188.226.239.21'
];

normal.port = 36348;

normal.alertKey = utils.toArray(''
  + '047cf0b8c8bedb12f7acdd39b7399a079ab2f59'
  + 'adf6fff80b087601b213c34a3b4e2359e26de96'
  + 'c36296a8950b228c76e920846ac04081fb050b7'
  + '3b16936c58355',
  'hex');

normal.seeds.ips = [
  0xe3590ccf
];

normal.seeds.ips = normal.seeds.ips.map(function(ip) {
  // LE:
  return ((ip >> 0) & 0xff)
    + '.' + ((ip >> 8) & 0xff)
    + '.' + ((ip >> 16) & 0xff)
    + '.' + ((ip >> 24) & 0xff);
});

normal.seeds.push.apply(normal.seeds, normal.seeds.ips);

/**
 * Checkpoints
 */

// Reference:
// ~/bitcoin/src/checkpoints.cpp

normal.checkpoints = [
  { height: 0, 		  hash: '000001196bbe430b7e0cdce3504f5ddfda0d0313ea479526d79afbf4d090a880' },
  { height: 12700, 	hash: '00000000005f6e7b5929d186705a36549bb6e2301d4d66c80282ffdc78410cdd' }
];

// * UNIX timestamp of last checkpoint block
normal.checkpoints.tsLastCheckpoint = 1401784396;
// * total number of transactions between genesis and last checkpoint
//   (the tx=... number in the SetBestChain debug.log lines)
normal.checkpoints.txsLastCheckpoint = 16152;
// * estimated number of transactions per day after checkpoint
normal.checkpoints.txsPerDay = 500.0;

/**
 * Genesis Block
 * http://blockexplorer.com/b/0
 * http://blockexplorer.com/rawblock/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
 */

normal.genesis = {
  version: 1,
  _hash: utils.toArray(
    '000001196bbe430b7e0cdce3504f5ddfda0d0313ea479526d79afbf4d090a880',
    'hex'
  ).reverse(),
  prevBlock: [ 0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0 ],
  merkleRoot: utils.toArray(
    'cf112b0792eaf749de18d633d3545aecd7b1343d78e14a830a242a03a6c31339',
    'hex'
  ).reverse(),
  ts: 1398093006,
  bits: 0x1e0ffff0,
  nonce: 307242
};

normal.magic = 0xdeb9c3fe;
normal.addressVersion = 68;

/**
 * Use Normal
 */

protocol.__proto__ = normal;

/**
 * Testnet Protocol (v3)
 * https://en.bitcoin.it/wiki/Testnet
 */

// Reference:
// ~/bitcoin/src/chainparams.cpp

var testnet = protocol.testnet = {};

testnet.type = 'testnet';

testnet.seeds = [
  'testnet-seed.bitcoin.petertodd.org',
  'testnet-seed.bluematt.me'
];

testnet.port = 18333;

testnet.alertKey = utils.toArray(''
  + '04302390343f91cc401d56d68b123028bf52e5f'
  + 'ca1939df127f63c6467cdf9c8e2c14b61104cf8'
  + '17d0b780da337893ecc4aaff1309e536162dabb'
  + 'db45200ca2b0a',
  'hex');

/**
 * Testnet Checkpoints
 */

// Reference:
// ~/bitcoin/src/checkpoints.cpp

testnet.checkpoints = [
  { height: 546, hash: '000000002a936ca763904c3c35fce2f3556c559c0214345d31b1bcebf76acb70' }
];

testnet.checkpoints.tsLastCheckpoint = 1338180505;
testnet.checkpoints.txsLastCheckpoint = 16341;
testnet.checkpoints.txsPerDay = 300;

/**
 * Genesis Block
 * http://blockexplorer.com/testnet/b/0
 * http://blockexplorer.com/testnet/rawblock/000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943
 */

testnet.genesis =  {
  version: 1,
  _hash: utils.toArray(
    '000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943',
    'hex'
  ).reverse(),
  prevBlock: [ 0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0,
               0, 0, 0, 0, 0, 0, 0, 0 ],
  merkleRoot: utils.toArray(
    '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    'hex'
  ).reverse(),
  ts: 1296688602,
  bits: 0x1d00ffff,
  nonce: 414098458
};

testnet.magic = 0x0709110b;
testnet.addressVersion = 111;

/**
 * Use Testnet
 */

if (protocol.type === 'testnet') {
  protocol.__proto__ = testnet;

  constants.genesis = protocol.genesis;
  constants.magic = protocol.magic;
  constants.addressVersion = protocol.addressVersion;

  utils.merge(bcoin.protocol.preload, {
    'v': 1,
    'type': 'chain',
    'hashes': [utils.toHex(protocol.genesis._hash)],
    'ts': [protocol.genesis.ts],
    'heights': [0]
  });

  wallet.hash2addr = function hash2addr(hash) {
    hash = utils.toArray(hash, 'hex');

    // Add version
    hash = [ constants.addressVersion ].concat(hash);

    var addr = hash.concat(utils.checksum(hash));
    return utils.toBase58(addr);
  };
}
