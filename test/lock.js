'use strict';

const Mutex = require('../lib/wmcc-mutex');

function sleep(count) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(count);
    }, Math.floor(Math.random() * (500 - 10)) + 10);
  });
}

(async() => {
  const Lock1 = Mutex.create();
  const Lock2 = new Mutex;
  const Lock3 = Mutex.create();
  for (let i = 0; i < 5; i++) {
    // to prevent race condition
    const unlock1 = await Lock1();
    const first = await sleep(i);
    console.log(`First count: ${first}  -`);
    unlock1();

    const unlock2 = await Lock2.lock();
    const second = await sleep(i);
    console.log(`Second count: ${second} |`);
    unlock2();
  }

  (async() => {
    const Lock = Mutex.create();
    for (let i = 0; i < 5; i++) {
      const unlock = await Lock();
      const other = await sleep(i);
      console.log(`Other count: ${other}  <`);
      unlock();
    }
  })();

  for (let i = 0; i < 5; i++) {
    const unlock3 = await Lock3();
    const third = await sleep(i);
    console.log(`Third count: ${third}`);
    unlock3();
  }
})();