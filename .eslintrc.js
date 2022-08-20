module.exports = {
  env: {
    node: true
  },
  extends: ['prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': ['error', 'never']
  }
}
