const User = require('./User');

describe('Testing User', () => {
  it('should create a new user given a valid input', () => {
    const user = new User({
      username: 'username'
    });

    expect(user).toBeInstanceOf(User);
  });

  it('should fail creation of a new user if username is not given', () => {
    expect(() => new User({})).toThrow('User must have username');
  });

  it('should return the models`s JSON representation if toJSON is called, id null if not given', () => {
    const id = new User({ username: 'caio' });

    expect(id.toJSON()).toEqual({
      id: null,
      username: 'caio',
      password: null
    });
  });

  it('should return the models`s JSON representation if toJSON is called, id not null if given', () => {
    const id = new User({ id: '123', username: 'caio', randomProperty: 10 });

    expect(id.toJSON()).toEqual({
      id: '123',
      username: 'caio',
      password: null
    });
  });
});
