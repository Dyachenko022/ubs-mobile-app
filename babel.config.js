module.exports = {
  env: {
    development: {
      presets: ['module:metro-react-native-babel-preset']
    },
    production: {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [["transform-remove-console", { "exclude": ["error"] }]],
    }
  }
}
