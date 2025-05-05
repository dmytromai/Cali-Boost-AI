# Calorie Tracker App

A React Native mobile application for tracking calories and maintaining a healthy lifestyle.

## Features

- Personalized onboarding experience
- Goal setting (weight loss, maintenance, or gain)
- Daily calorie and macro tracking
- Activity level tracking
- Profile customization
- Dark mode UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calorie-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Follow the Expo CLI instructions to run the app on your desired platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app for running on a physical device

## Project Structure

```
src/
  ├── components/        # Reusable UI components
  ├── navigation/        # Navigation configuration
  ├── screens/          # Screen components
  │   ├── onboarding/  # Onboarding flow screens
  │   └── main/        # Main app screens
  └── utils/           # Helper functions and utilities
```

## Technologies Used

- React Native
- Expo
- React Navigation
- AsyncStorage
- Expo Vector Icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
