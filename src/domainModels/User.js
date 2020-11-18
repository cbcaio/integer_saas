class User {
  constructor(args) {
    if (!args.email) {
      throw new Error('User must have an email');
    }
    this.email = args.email;
    this.password = args.password;
  }

  getId() {
    return this.email;
  }
}

module.exports = User;
