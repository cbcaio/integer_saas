const Identifier = require('../domainModels/Identifier');
const IdentifierRepository = require('./IdentifierRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('IdentifierRepository', () => {
  const mockQueryBuilder = {
    getIdentifierByUser: jest.fn(),
    saveNextIdentifier: jest.fn(),
    updateIdentifier: jest.fn(),
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
      queryBuilder: mockQueryBuilder,
      IdentifierModel: Identifier
    });

    it('should return a promise if called', () => {
      expect(repositoryInstance.getIdentifierByUser(1)).toBeInstanceOf(Promise);
    });

    it('should return false if invalid user was provided', async () => {
      mockQueryBuilder.getIdentifierByUser.mockResolvedValueOnce(undefined);
      const result = await repositoryInstance.getIdentifierByUser(1);

      expect(result).toEqual(false);
    });

    it('should return an Identifier instance', async () => {
      const rawIdentifierProperties = {
        id: 10,
        currentIdentifier: 10
      };

      mockQueryBuilder.getIdentifierByUser.mockResolvedValueOnce(
        rawIdentifierProperties
      );

      const result = await repositoryInstance.getIdentifierByUser(1);

      expect(result).toBeInstanceOf(Identifier);
      expect(result).toEqual(rawIdentifierProperties);
    });
  });

  describe('testing saveIdentifier', () => {
    const repositoryInstance = new IdentifierRepository({
      queryBuilder: mockQueryBuilder,
      IdentifierModel: Identifier
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
      it('should save identifier using update and not insert', async () => {
        const identifierExample = new Identifier({
          id: 100,
          currentIdentifier: 2
        });
        await repositoryInstance.saveIdentifier(identifierExample);

        expect(mockQueryBuilder.updateIdentifier).toHaveBeenCalledTimes(1);
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

        expect(mockQueryBuilder.updateIdentifier).toHaveBeenCalledTimes(0);
        expect(mockQueryBuilder.insertIdentifier).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('testing saveNextIdentifier', () => {
    const repositoryInstance = new IdentifierRepository({
      queryBuilder: mockQueryBuilder,
      IdentifierModel: Identifier
    });

    it('should return a promise if called', () => {
      expect(repositoryInstance.saveNextIdentifier()).toBeInstanceOf(Promise);
    });

    it('should return an Identifier instance', async () => {
      const mockedCallResult = {
        id: 1,
        userId: 2,
        currentIdentifier: 3
      };

      mockQueryBuilder.saveNextIdentifier.mockResolvedValueOnce(
        mockedCallResult
      );

      const result = await repositoryInstance.saveNextIdentifier(1);

      expect(result).toBeInstanceOf(Identifier);
      expect(result).toEqual(mockedCallResult);
    });
  });
});
