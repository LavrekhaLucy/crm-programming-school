export const mockConfigService = {
  get: jest.fn().mockImplementation((key) => {
    if (key === 'JWT_ACCESS_EXPIRES_IN') return 3600;
    if (key === 'JWT_REFRESH_EXPIRES_IN') return 86400;
    return null;
  }),
};
