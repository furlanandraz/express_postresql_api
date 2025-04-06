import { Cache } from './server/dao/Cache.js';

for (const [key, fn] of Object.entries(Cache)) {
  if (typeof fn === 'function') {
    console.log(`Running cache method: ${key}`);
    await fn();
  }
}