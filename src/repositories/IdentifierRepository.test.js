const Identifier = require('../domainModels/Identifier');
const User = require('../domainModels/User');
const IdentifierRepository = require('./IdentifierRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('IdentifierRepository', () => {
  const mockQueryBuilder = {
    findIdentifierByUser: jest.fn(),
    updateIdenfitier: jest.fn(),
    insertIdentifier: jest.fn()
  };

  it('should be possible to instantiate the repository with a query builder', () => {
    expect(() => new IdentifierRepository({ queryBuilder: {} })).not.toThrow();
  });

  it('should NOT be possible to instantiate the repository without a query builder', () => {
    expect(() => new IdentifierRepository()).toThrow(
      'Repository requires a queryBuilder to work'
    );
  });

  describe('testing getIdentifierByUser', () => {
    const repositoryInstance = new IdentifierRepository({
      queryBuilder: mockQueryBuilder
    });

    const userExample = new User({
      username: 'username'
    });

    it('should return a promise if called with correct args', () => {
      expect(
        repositoryInstance.getIdentifierByUser(userExample)
      ).toBeInstanceOf(Promise);
    });

    it('should throw if invalid user was provided', async () => {
      await expect(async () => {
        await repositoryInstance.getIdentifierByUser({});
      }).rejects.toThrow();
    });

    it('should return an Identifier instance with queried user', async () => {
      const rawIdentifierProperties = {
        id: 10,
        currentIdentifier: 10
      };

      mockQueryBuilder.findIdentifierByUser.mockResolvedValueOnce(
        rawIdentifierProperties
      );

      const result = await repositoryInstance.getIdentifierByUser(userExample);

      expect(result).toBeInstanceOf(Identifier);
      expect(result.toJSON()).toEqual(rawIdentifierProperties);
    });
  });

  describe('testing saveIdentifier', () => {
    const repositoryInstance = new IdentifierRepository({
      queryBuilder: mockQueryBuilder
    });

    it('should return a promise if called with correct args', () => {
      const identifierExample = new Identifier({
        currentIdentifier: 2
      });
      expect(
        repositoryInstance.saveIdentifier(identifierExample)
      ).toBeInstanceOf(Promise);
    });

    describe('if identifier has id', () => {
      const identifierExample = new Identifier({
        id: 100,
        currentIdentifier: 2
      });

      it('should save identifier using update and not insert', async () => {
        await repositoryInstance.saveIdentifier(identifierExample);

        expect(mockQueryBuilder.updateIdenfitier).toHaveBeenCalledTimes(1);
        expect(mockQueryBuilder.insertIdentifier).toHaveBeenCalledTimes(0);
      });
    });

    describe('if identifier does NOT have an id (new identifier)', () => {
      const identifierExample = new Identifier({
        id: null,
        currentIdentifier: 2
      });

      it('should save identifier using insert and not update', async () => {
        await repositoryInstance.saveIdentifier(identifierExample);

        expect(mockQueryBuilder.updateIdenfitier).toHaveBeenCalledTimes(0);
        expect(mockQueryBuilder.insertIdentifier).toHaveBeenCalledTimes(1);
      });
    });
  });
});
