const User = require('./User');

describe('Testing User', () => {
  it('should create a new user given a valid input', () => {
    const user = new User({
      username: 'username',
      password: 'password'
    });

    expect(user).toBeInstanceOf(User);
  });

  it('should fail creation of a new user if username is not given', () => {
    expect(() => new User({})).toThrow('User must have username');
  });

  it('should fail creation of a new user if password is not given', () => {
    expect(() => new User({ username: 'name' })).toThrow(
      'User must have password'
    );
  });

  it('should fail creation of a new user if password is not string', () => {
    expect(() => new User({ username: 'name', password: 123 })).toThrow(
      'Password must be a string'
    );
  });
});
