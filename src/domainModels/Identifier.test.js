const Identifier = require('./Identifier');

describe('Testing Identifier', () => {
  it('should create a new identifier given a valid input', () => {
    const identifier = new Identifier({ currentIdentifier: 1 });

    expect(identifier).toBeInstanceOf(Identifier);
  });

  it('should fail creation of a new identifier if input is not a positive integer', () => {
    const values = [null, '1', 'a string', -1];

    values.forEach((v) => {
      expect(() => new Identifier({ currentIdentifier: v })).toThrow(
        'Invalid value for Identifier'
      );
    });
  });

  it('should return 1 if getCurrentIdentifier is called on default Identifier instance', () => {
    const id = new Identifier();

    expect(id.getCurrentIdentifier()).toEqual(1);
  });

  it('should return 2 if getNextIdentifier is called on default Identifier instance', () => {
    const id = new Identifier();

    expect(id.getNextIdentifier()).toEqual(2);
  });

  it('should return 11 if getNextIdentifier is called on Identifier instantiated with 10', () => {
    const id = new Identifier({ currentIdentifier: 10 });

    expect(id.getNextIdentifier()).toEqual(11);
  });
});
