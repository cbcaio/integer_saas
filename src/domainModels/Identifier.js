class Identifier {
  constructor(args = {}) {
    const { id = null, userId, currentIdentifier = 1 } = args;

    Identifier.validateIdentifier(currentIdentifier);

    this.id = id;
    this.userId = userId;
    this.currentIdentifier = currentIdentifier;
  }

  hasId() {
    return !!this.id;
  }

  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getCurrentIdentifier() {
    return this.currentIdentifier;
  }

  getNextIdentifier() {
    const nextIdentifier = this.currentIdentifier + 1;

    return nextIdentifier;
  }

  static validateIdentifier(value) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(
        'Invalid value for Identifier: Must be a positive integer'
      );
    }
  }
}

module.exports = Identifier;
