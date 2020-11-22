const IdentifierRepositoryKnex = require('./IdentifierRepositoryKnex');
const User = require('../../domainModels/User');
const Identifier = require('../../domainModels/Identifier');

const mockKnexInstance = require('./mock/knexInstance');
const knexInstance = require('./mock/knexInstance');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('IdentifierRepositoryKnex', () => {
  const repositoryInstance = new IdentifierRepositoryKnex({
    ...mockKnexInstance,
    transaction: jest.fn((fn) => fn(mockKnexInstance))
  });

  it('should be possible to instantiate the repository with a knex instance', () => {
    expect(() => new IdentifierRepositoryKnex({})).not.toThrow();
  });

  it('should NOT be possible to instantiate the repository without a query builder', () => {
    expect(() => new IdentifierRepositoryKnex()).toThrow(
      'Knex instance is not defined'
    );
  });

  describe('testing getIdentifierByUser', () => {
    const userExample = new User({
      username: 'username',
      password: 'password'
    });

    mockKnexInstance.mockFirst.first.mockResolvedValue({
      id: 123,
      user_id: 12,
      current: 90
    });

    it('should return a promise if called with correct args', () => {
      expect(
        repositoryInstance.getIdentifierByUser(userExample)
      ).toBeInstanceOf(Promise);
    });

    it('should query from identifierTable', async () => {
      await repositoryInstance.getIdentifierByUser(userExample);

      expect(mockKnexInstance.mockFrom.from).toHaveBeenLastCalledWith(
        repositoryInstance.identifierTable
      );
    });

    it('should define where clause using user_id and received input', async () => {
      await repositoryInstance.getIdentifierByUser(100);

      expect(mockKnexInstance.mockWhere.where).toHaveBeenLastCalledWith(
        'user_id',
        100
      );
    });

    it('should return formatted identifier', async () => {
      const result = await repositoryInstance.getIdentifierByUser(100);

      expect(result).toEqual({
        id: 123,
        userId: 12,
        currentIdentifier: 90
      });
    });
  });

  describe('testing updateIdentifier', () => {
    const identifierExample = new Identifier({
      id: 100,
      currentIdentifier: 2
    });

    describe('if exactly one item is updated', () => {
      it('should save in the identifierTable', async () => {
        mockKnexInstance.mockUpdate.update.mockResolvedValueOnce(1);
        mockKnexInstance.mockFirst.first.mockResolvedValueOnce({
          id: 123,
          user_id: 12,
          current: 90
        });

        await repositoryInstance.updateIdentifier(identifierExample);

        expect(mockKnexInstance.mockTable.table).toHaveBeenCalledTimes(2);
        expect(mockKnexInstance.mockTable.table).toHaveBeenCalledWith(
          repositoryInstance.identifierTable
        );
      });

      it('should update identifier with same id', async () => {
        mockKnexInstance.mockUpdate.update.mockResolvedValueOnce(1);
        await repositoryInstance.updateIdentifier(identifierExample);

        expect(mockKnexInstance.mockWhere.where).toHaveBeenCalledTimes(2);
        expect(mockKnexInstance.mockWhere.where).toHaveBeenCalledWith(
          'id',
          identifierExample.getId()
        );
      });
    });

    describe('if NOT exactly one item is updated', () => {
      it('should save in the identifierTable', async () => {
        mockKnexInstance.mockUpdate.update.mockResolvedValue(10);

        await expect(
          repositoryInstance.updateIdentifier(identifierExample)
        ).rejects.toThrow('updateIdentifier failed updating');
      });
    });
  });

  describe('testing insertIdentifier', () => {
    const identifierExample = new Identifier({
      id: 123,
      currentIdentifier: 2
    });

    knexInstance.mockInto.into.mockResolvedValue([1]);

    it('should save in the identifierTable', async () => {
      await repositoryInstance.insertIdentifier(identifierExample);

      expect(mockKnexInstance.mockInto.into).toHaveBeenCalledTimes(1);
      expect(mockKnexInstance.mockInto.into).toHaveBeenLastCalledWith(
        repositoryInstance.identifierTable
      );
    });

    it('should save identifier using insert and not update', async () => {
      await repositoryInstance.insertIdentifier(identifierExample);

      expect(mockKnexInstance.mockInsert.insert).toHaveBeenCalledTimes(1);
      expect(mockKnexInstance.mockInsert.insert).toHaveBeenLastCalledWith({
        user_id: identifierExample.getUserId(),
        current: identifierExample.getCurrentIdentifier()
      });
    });
  });
});
