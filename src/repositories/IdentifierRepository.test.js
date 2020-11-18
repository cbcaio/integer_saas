const Identifier = require('../domainModels/Identifier');
const User = require('../domainModels/User');
const IdentifierRepository = require('./IdentifierRepository');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('IdentifierRepository', () => {
  it('should be possible to instantiate the repository with a query builder', () => {
    expect(() => new IdentifierRepository({ queryBuilder: {} })).not.toThrow();
  });

  it('should NOT be possible to instantiate the repository without a query builder', () => {
    expect(() => new IdentifierRepository()).toThrow(
      'Repository requires a queryBuilder to work'
    );
  });

  describe('testing getIdentifierByUser', () => {
    const mockWhere = { where: jest.fn() };
    const mockFrom = { from: jest.fn(() => mockWhere) };
    const mockSelect = { select: jest.fn(() => mockFrom) };

    const mockQueryBuilder = {
      ...mockSelect
    };

    const repositoryInstance = new IdentifierRepository({
      queryBuilder: mockQueryBuilder
    });

    const userExample = new User({
      id: 'someone@somewhere.com'
    });

    it('should return a promise if called with correct args', () => {
      expect(
        repositoryInstance.getIdentifierByUser(userExample)
      ).toBeInstanceOf(Promise);
    });

    it('should throw if invalid user was provided', async () => {
      await expect(async () => {
        await repositoryInstance.getIdentifierByUser({});
      }).rejects.toThrow('User must have an unique id');
    });

    it('should query from identifierTable', async () => {
      await repositoryInstance.getIdentifierByUser(userExample);

      expect(mockFrom.from).toHaveBeenLastCalledWith(
        repositoryInstance.identifierTable
      );
    });

    it('should create where clause using userForeignKey and user.getId', async () => {
      await repositoryInstance.getIdentifierByUser(userExample);

      expect(mockWhere.where).toHaveBeenLastCalledWith(
        repositoryInstance.userForeignKey,
        userExample.getId()
      );
    });

    it('should return an Identifier instance with queried user', async () => {
      const rawIdentifierProperties = {
        id: 10,
        currentIdentifier: 10
      };

      mockWhere.where.mockResolvedValueOnce(rawIdentifierProperties);

      const result = await repositoryInstance.getIdentifierByUser(userExample);

      expect(result).toBeInstanceOf(Identifier);
      expect(result.toJSON()).toEqual(rawIdentifierProperties);
    });
  });

  describe('testing saveIdentifier', () => {
    const mockUpdate = { update: jest.fn() };
    const mockWhere = { where: jest.fn(() => mockUpdate) };
    const mockTable = { table: jest.fn(() => mockWhere) };
    const mockInto = { into: jest.fn() };
    const mockInsert = { insert: jest.fn(() => mockInto) };

    const mockQueryBuilder = {
      ...mockTable,
      ...mockInsert
    };

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

      it('should save in the identifierTable', async () => {
        await repositoryInstance.saveIdentifier(identifierExample);

        expect(mockTable.table).toHaveBeenCalledTimes(1);
        expect(mockTable.table).toHaveBeenLastCalledWith(
          repositoryInstance.identifierTable
        );
      });

      it('should save identifier using update and not insert', async () => {
        await repositoryInstance.saveIdentifier(identifierExample);

        expect(mockUpdate.update).toHaveBeenCalledTimes(1);
        expect(mockInsert.insert).toHaveBeenCalledTimes(0);
        expect(mockUpdate.update).toHaveBeenLastCalledWith(
          repositoryInstance.identifierCurrentValueColumn,
          identifierExample.getCurrentIdentifier()
        );
      });

      it('should update identifier with same id', async () => {
        await repositoryInstance.saveIdentifier(identifierExample);

        expect(mockWhere.where).toHaveBeenCalledTimes(1);
        expect(mockWhere.where).toHaveBeenLastCalledWith(
          repositoryInstance.identifierPrimaryKey,
          identifierExample.getId()
        );
      });
    });

    describe('if identifier does NOT have an id (new identifier)', () => {
      const identifierExample = new Identifier({
        id: null,
        currentIdentifier: 2
      });

      it('should save in the identifierTable', async () => {
        await repositoryInstance.saveIdentifier(identifierExample);

        expect(mockInto.into).toHaveBeenCalledTimes(1);
        expect(mockInto.into).toHaveBeenLastCalledWith(
          repositoryInstance.identifierTable
        );
      });

      it('should save identifier using insert and not update', async () => {
        await repositoryInstance.saveIdentifier(identifierExample);

        expect(mockUpdate.update).toHaveBeenCalledTimes(0);
        expect(mockInsert.insert).toHaveBeenCalledTimes(1);
        expect(mockInsert.insert).toHaveBeenLastCalledWith(identifierExample);
      });
    });
  });
});
