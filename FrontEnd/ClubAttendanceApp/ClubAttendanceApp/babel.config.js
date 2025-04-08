module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [

    [
      'module:react-native-dotenv', // Dotenv 플러그인
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin', 
  ],
};