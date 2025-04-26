module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    'react-native-reanimated/plugin',
    [
      "module:react-native-dotenv",
      {
        moduleName: "react-native-dotenv",
        path: ".env",
        blacklist: null,
        whitelist: ["OPENAI_API_KEY", "GOOGLE_PLACES_API_KEY", "FIREBASE_API_KEY"],
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
