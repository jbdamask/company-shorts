module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)',
  ],
  testTimeout: 180000, // 3 minutes timeout
};