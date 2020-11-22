const mockFirst = { first: jest.fn() };
const mockUpdate = { update: jest.fn() };
const mockInto = { into: jest.fn() };
const mockInsert = { insert: jest.fn(() => mockInto) };
const mockAndWhere = {
  andWhere: jest.fn(() => mockUpdate),
  first: jest.fn()
};
const mockWhere = {
  where: jest.fn(() => ({ ...mockUpdate, ...mockAndWhere, ...mockFirst }))
};
const mockFrom = { from: jest.fn(() => mockWhere) };
const mockSelect = { select: jest.fn(() => mockFrom) };
const mockTable = { table: jest.fn(() => mockWhere) };

module.exports = {
  mockFirst,
  mockUpdate,
  mockInto,
  mockInsert,
  mockAndWhere,
  mockWhere,
  mockFrom,
  mockSelect,
  mockTable,
  ...mockSelect,
  ...mockTable,
  ...mockInsert
};
