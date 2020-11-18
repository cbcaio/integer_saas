class Identifier {
  constructor(args = {}) {
    const { id = null, currentIdentifier = 1 } = args;

    Identifier.validateIdentifier(currentIdentifier);

    this.id = id;
    this.currentIdentifier = currentIdentifier;
  }

  hasId() {
    return !!this.id;
  }

  getId() {
    return this.id;
  }

  getCurrentIdentifier() {
    return this.currentIdentifier;
  }

  getNextIdentifier() {
    const nextIdentifier = this.currentIdentifier + 1;

    return nextIdentifier;
  }

  setCurrentIdentifier(id) {
    Identifier.validateIdentifier(id);

    this.currentIdentifier = Number(id, 10);
  }

  static isIdentifierValid(id) {
    return Number.isInteger(id) && id > 0;
  }

  static validateIdentifier(id) {
    if (!Identifier.isIdentifierValid(id)) {
      throw new Error('Invalid value for Identifier');
    }
  }

  toJSON() {
    return {
      id: this.id,
      currentIdentifier: this.currentIdentifier
    };
  }
}

module.exports = Identifier;
