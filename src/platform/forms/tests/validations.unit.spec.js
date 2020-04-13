import { expect } from 'chai';
import { spy } from 'sinon';

import {
  isBlank,
  isNotBlank,
  isValidDate,
  isValidDateRange,
  isValidMonetaryValue,
  isValidName,
  validateCustomFormComponent,
  validateLength,
  validateWhiteSpace,
} from '../validations';

describe('Validations unit tests', () => {
  describe('isValidDate', () => {
    it('validate february separately cause its a special snowflake', () => {
      // feb 28 should work always.
      expect(isValidDate('28', '2', '2015')).to.be.true;

      // 2015 is not a leap year.
      expect(isValidDate('29', '2', '2015')).to.be.false;

      // 2016 is a leap year.
      expect(isValidDate('29', '2', '2016')).to.be.true;

      // feb 30 is always bad.
      expect(isValidDate('30', '2', '2016')).to.be.false;

      // feb 1 is always fine.
      expect(isValidDate('1', '2', '2016')).to.be.true;

      // feb 0 is always bad.
      expect(isValidDate('0', '2', '2016')).to.be.false;
    });

    it('validate future dates', () => {
      // future dates are bad.
      expect(isValidDate('1', '1', '2050')).to.be.false;
    });
  });

  describe('isValidDateRange', () => {
    it('validates if to date is after from date', () => {
      const fromDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '3',
          dirty: true,
        },
        year: {
          value: '2006',
          dirty: true,
        },
      };
      const toDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '4',
          dirty: true,
        },
        year: {
          value: '2006',
          dirty: true,
        },
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.true;
    });
    it('does not validate to date is before from date', () => {
      const fromDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '3',
          dirty: true,
        },
        year: {
          value: '2006',
          dirty: true,
        },
      };
      const toDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '4',
          dirty: true,
        },
        year: {
          value: '2005',
          dirty: true,
        },
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.false;
    });
    it('does validate with partial dates', () => {
      const fromDate = {
        day: {
          value: '3',
          dirty: true,
        },
        month: {
          value: '3',
          dirty: true,
        },
        year: {
          value: '2006',
          dirty: true,
        },
      };
      const toDate = {
        day: {
          value: '',
          dirty: true,
        },
        month: {
          value: '',
          dirty: true,
        },
        year: {
          value: '2008',
          dirty: true,
        },
      };
      expect(isValidDateRange(fromDate, toDate)).to.be.true;
    });
  });

  describe('isValidName', () => {
    it('correctly validates name', () => {
      expect(isValidName('Test')).to.be.true;
      expect(isValidName('abc')).to.be.true;
      expect(isValidName('Jean-Pierre')).to.be.true;
      expect(isValidName('Vigee Le Brun')).to.be.true;

      expect(isValidName('')).to.be.false;
      expect(isValidName('123')).to.be.false;
      expect(isValidName('#$%')).to.be.false;
      expect(isValidName('Test1')).to.be.false;
      expect(isValidName(' leadingspace')).to.be.false;
      expect(isValidName(' ')).to.be.false;
    });
  });

  describe('isBlank', () => {
    it('correctly validates blank values', () => {
      expect(isBlank('')).to.be.true;

      expect(isBlank('something')).to.be.false;
    });
  });

  describe('isNotBlank', () => {
    it('correctly validates blank values', () => {
      expect(isNotBlank('Test')).to.be.true;
      expect(isNotBlank('abc')).to.be.true;
      expect(isNotBlank('123')).to.be.true;
      expect(isNotBlank('#$%')).to.be.true;

      expect(isNotBlank('')).to.be.false;
    });
  });

  describe('isValidMonetaryValue', () => {
    it('validates monetary values', () => {
      expect(isValidMonetaryValue('100')).to.be.true;
      expect(isValidMonetaryValue('1.99')).to.be.true;
      expect(isValidMonetaryValue('1000')).to.be.true;

      expect(isValidMonetaryValue('')).to.be.false;
      expect(isValidMonetaryValue('1,000')).to.be.false;
      expect(isValidMonetaryValue('abc')).to.be.false;
      expect(isValidMonetaryValue('$100')).to.be.false;
    });
  });

  describe('validateCustomFormComponent', () => {
    it('should return object validation results', () => {
      const validation = {
        valid: false,
        message: 'Test',
      };

      expect(validateCustomFormComponent(validation)).to.equal(validation);
    });
    it('should return passing object validation results', () => {
      const validation = {
        valid: true,
        message: 'Test',
      };

      expect(validateCustomFormComponent(validation).valid).to.be.true;
      expect(validateCustomFormComponent(validation).message).to.be.null;
    });
    it('should return array validation results', () => {
      const validation = [
        {
          valid: true,
          message: 'DoNotShow',
        },
        {
          valid: false,
          message: 'Test',
        },
      ];

      expect(validateCustomFormComponent(validation)).to.equal(validation[1]);
    });
  });

  describe('validateLength', () => {
    it('should return a validation function', () => {
      expect(validateLength(10)).to.be.a('function');
    });

    it('should add an error if the input length is too large', () => {
      const errors = { addError: spy() };
      validateLength(4)(errors, 'More than four characters');
      expect(errors.addError.called).to.be.true;
    });

    it('should not add an error if the input length is not too large', () => {
      const errors = { addError: spy() };
      validateLength(40)(errors, 'Less than forty characters');
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('validateWhiteSpace', () => {
    it('should add an error if the input contains only whitespace', () => {
      const errors = { addError: spy() };
      validateWhiteSpace(errors, '    ');
      expect(errors.addError.called).to.be.true;
    });

    it('should not add an error if the input is valid', () => {
      const errors = { addError: spy() };
      validateWhiteSpace(errors, 'valid input');
      expect(errors.addError.called).to.be.false;
    });
  });
});
