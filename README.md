# PoolPocket 🎱

PoolPocket is a mobile application built with React native that is designed to help billiards fans find nearby pool halls, save their favorite locations and improve their game through an AI chatbot.

## Features

### 🗺️ Find Pool Tables
- Locate nearby pool halls and billiards venues
- View details about each location such as the name, address and google ratings

### ❤️ Favorites System
- Save your favorite pool halls for quick access
- Easily manage your list of favorite venues

### 🤖 PoolAI 
- Chat with our AI chatbot
- Get advice on anything billiards related such as rules, equipment etc.
- Learn from scrath or improve your game

### 👤 User Profile
- Personalized user accounts
- Secure authentication system
- Profile management options

## Tech Stack
[![Expo][expo-logo]][expo-url]
[![React Native][react-native-logo]][react-native-url]
[![TypeScript][typescript-logo]][typescript-url]
[![Google Cloud][google-cloud-logo]][google-cloud-url]
[![Visual Studio Code][vs-code-logo]][vs-code-url]
[![Firebase][firebase-logo]][firebase-url]
[![OpenAI][openai-logo]][openai-url]
[![GitHub][github-logo]][github-url]

<!-- TECHNOLOGY LINKS & IMAGES -->
[react-native-logo]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-native-url]: https://reactnative.dev/
[expo-logo]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white
[expo-url]: https://expo.dev/
[firebase-logo]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[firebase-url]: https://firebase.google.com/
[google-cloud-logo]: https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white
[google-cloud-url]: https://cloud.google.com/
[openai-logo]: https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white
[openai-url]: https://openai.com/
[typescript-logo]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[vs-code-logo]: https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual-studio-code&logoColor=white
[vs-code-url]: https://code.visualstudio.com/
[github-logo]: https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white
[github-url]: https://github.com/

## Project Structure

```
poolpocket/
├── App.js                 # Main application entry point
├── components/            # UI components
│   ├── Chatbot.tsx        # AI assistant interface
│   ├── Favorites.tsx      # Saved locations management
│   ├── Home.tsx           # Main welcome screen
│   ├── Login.tsx          # User authentication
│   ├── Maps.tsx           # Location finder
│   ├── PoolHelperAI.tsx   # AI assistant logic
│   ├── Profile.tsx        # User profile management
│   └── Register.tsx       # New user registration
├── configuration/         # App configuration
│   ├── defaultUser.tsx    # Default user template
│   ├── firebaseConfig.js  # Firebase initialization
│   └── useCurrentUser.tsx # User authentication hook
└── ...
```

## Screenshots

<img src="https://github.com/Arttuaarnio/PoolPocket/blob/main/images/login.png?raw=true" width="300" />
<img src="https://github.com/Arttuaarnio/PoolPocket/blob/main/images/register.png?raw=true" width="300" />
<img src="https://github.com/Arttuaarnio/PoolPocket/blob/main/images/home.png?raw=true" width="300" />
<img src="https://github.com/Arttuaarnio/PoolPocket/blob/main/images/maps.png?raw=true" width="300" />
<img src="https://github.com/Arttuaarnio/PoolPocket/blob/main/images/favorites.png?raw=true" width="300" />
<img src="https://github.com/Arttuaarnio/PoolPocket/blob/main/images/chatbot.png?raw=true" width="300" />
<img src="https://github.com/Arttuaarnio/PoolPocket/blob/main/images/profile.png?raw=true" width="300" />

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Arttuaarnio/poolpocket.git
   cd poolpocket
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   FIREBASE_API_KEY=your_firebase_api_key
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   ```

4. Start the Expo developement server:
   ```
   npx expo start
   ```

5. Run on a device or emulator:
   ```
   # Using Expo Go app on your device
   # Scan the QR code from terminal

   # Or run on emulator
   # While Expo is running press i for iOS or a for android
   ```

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication with Email/Password
3. Set up Realtime Database
4. Add your app to the Firebase project
5. Copy the configuration details to `firebaseConfig.js`

## API Setup

### OpenAI API Setup

1. Create an account at [openai.com](https://openai.com)
2. Generate an API key
3. Add the key to your `.env` file

### Google Places API Setup

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Places API and Maps SDK for your project
3. Create an API key with appropriate restrictions
4. Add the key to your `.env` file

## Contributing

Share your improvements/new ideas and feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
___

## Made by Arttu Aarnio