const crypto = require('crypto');

class User {
  constructor(args) {
    const { id = null, username, password = null } = args;

    User.isValidUser(args);

    this.id = id;
    this.username = username;

    this.password = crypto.createHash('sha256').update(password).digest('hex');
  }

  static isValidUser(args) {
    if (!args.username) throw new Error('User must have username');
    if (!args.password) throw new Error('User must have password');
    if (args.password && typeof args.password !== 'string') {
      throw new Error('Password must be a string');
    }
  }

  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }
}

module.exports = User;
