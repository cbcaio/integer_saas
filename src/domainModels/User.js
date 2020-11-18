class User {
  constructor(args) {
    const { id = null, username, password = null } = args;

    User.isValidUser(args);

    this.id = id;
    this.username = username;
    this.password = password;
  }

  static isValidUser(args) {
    if (!args.username) throw new Error('User must have username');
  }

  getId() {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      password: this.password
    };
  }
}

module.exports = User;
