module.exports = {
  dependencies: {
    '@react-native-community/netinfo': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    '@react-native-community/geolocation': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};