import { expect } from 'chai';
import { transform } from '../node-press_releases_listing';
import mockOutput from './mockOutputs/node-press_releases_listing';
import {
  mockEntity,
  mockAncestors,
} from './mockInputs/node-press_releases_listing';

describe('node-press_releases_listing', () => {
  it('transforms data object as required', () => {
    const result = transform(mockEntity, mockAncestors);
    expect(result).to.deep.equal(mockOutput);
  });
});
