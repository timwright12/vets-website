import { disableButtons } from './utils';
import { expect } from 'chai';

let mockEvent;

describe('utils.js', () => {
  beforeEach(() => {
    mockEvent = {
      target: {
        tagName: 'BUTTON',
        parentNode: {
          childNodes: [
            { disabled: false },
            { disabled: false },
            { disabled: false },
          ],
        },
      },
    };
  });

  it('disableButtons', () => {
    disableButtons(mockEvent);
    expect(mockEvent.target.parentNode.childNodes[0].disabled).to.equal(true);
    expect(mockEvent.target.parentNode.childNodes[1].disabled).to.equal(true);
    expect(mockEvent.target.parentNode.childNodes[2].disabled).to.equal(true);
  });
});
