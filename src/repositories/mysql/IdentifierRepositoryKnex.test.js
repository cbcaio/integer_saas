const IdentifierRepositoryKnex = require('./IdentifierRepositoryKnex');
const User = require('../../domainModels/User');
const Identifier = require('../../domainModels/Identifier');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('IdentifierRepositoryKnex', () => {
  it('should be possible to instantiate the repository with a knex instance', () => {
    expect(() => new IdentifierRepositoryKnex({})).not.toThrow();
  });

  it('should NOT be possible to instantiate the repository without a query builder', () => {
    expect(() => new IdentifierRepositoryKnex()).toThrow(
      'Knex instance is not defined'
    );
  });

  describe('testing findIdentifierByUser', () => {
    const mockWhere = { where: jest.fn() };
    const mockFrom = { from: jest.fn(() => mockWhere) };
    const mockSelect = { select: jest.fn(() => mockFrom) };

    const mockKnexInstance = {
      ...mockSelect
    };

    const repositoryInstance = new IdentifierRepositoryKnex(mockKnexInstance);

    const userExample = new User({
      username: 'username',
      password: 'password'
    });

    it('should return a promise if called with correct args', () => {
      expect(
        repositoryInstance.findIdentifierByUser(userExample)
      ).toBeInstanceOf(Promise);
    });

    it('should throw if invalid user was provided', async () => {
      await expect(async () => {
        await repositoryInstance.findIdentifierByUser({});
      }).rejects.toThrow();
    });

    it('should query from identifierTable', async () => {
      await repositoryInstance.findIdentifierByUser(userExample);

      expect(mockFrom.from).toHaveBeenLastCalledWith(
        repositoryInstance.identifierTable
      );
    });

    it('should create where clause using userForeignKey and user.getId', async () => {
      await repositoryInstance.findIdentifierByUser(userExample);

      expect(mockWhere.where).toHaveBeenLastCalledWith(
        repositoryInstance.userForeignKey,
        userExample.getId()
      );
    });
  });

  describe('testing updateIdenfitier', () => {
    const mockUpdate = { update: jest.fn() };
    const mockWhere = { where: jest.fn(() => mockUpdate) };
    const mockTable = { table: jest.fn(() => mockWhere) };

    const mockKnexInstance = {
      ...mockTable
    };

    const repositoryInstance = new IdentifierRepositoryKnex(mockKnexInstance);

    const identifierExample = new Identifier({
      id: 100,
      currentIdentifier: 2
    });

    it('should save in the identifierTable', async () => {
      await repositoryInstance.updateIdenfitier(identifierExample);

      expect(mockTable.table).toHaveBeenCalledTimes(1);
      expect(mockTable.table).toHaveBeenLastCalledWith(
        repositoryInstance.identifierTable
      );
    });

    it('should update identifier with same id', async () => {
      await repositoryInstance.updateIdenfitier(identifierExample);

      expect(mockWhere.where).toHaveBeenCalledTimes(1);
      expect(mockWhere.where).toHaveBeenLastCalledWith(
        repositoryInstance.primaryKey,
        identifierExample.getId()
      );
    });
  });

  describe('testing insertIdentifier', () => {
    const mockInto = { into: jest.fn() };
    const mockInsert = { insert: jest.fn(() => mockInto) };

    const mockKnexInstance = {
      ...mockInsert
    };

    const repositoryInstance = new IdentifierRepositoryKnex(mockKnexInstance);

    const identifierExample = new Identifier({
      id: null,
      currentIdentifier: 2
    });

    it('should save in the identifierTable', async () => {
      await repositoryInstance.insertIdentifier(identifierExample);

      expect(mockInto.into).toHaveBeenCalledTimes(1);
      expect(mockInto.into).toHaveBeenLastCalledWith(
        repositoryInstance.identifierTable
      );
    });

    it('should save identifier using insert and not update', async () => {
      await repositoryInstance.insertIdentifier(identifierExample);

      expect(mockInsert.insert).toHaveBeenCalledTimes(1);
      expect(mockInsert.insert).toHaveBeenLastCalledWith(identifierExample);
    });
  });
});
