import { sharedLib } from './shared-lib.js';

describe('sharedLib', () => {
  it('should work', () => {
    expect(sharedLib()).toEqual('shared-lib');
  });
});
