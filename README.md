# Smart Task Journal

A comprehensive React Native Expo application for tracking tasks, mood, and productivity insights with beautiful data visualizations and analytics.

## 🏗️ Architecture

### Project Structure

```
smart-task-journal/
|__src
    |-- components
    |-- hooks
    |-- navigation
    |-- screens
    |-- service
    |-- storage
    |-- store
    |-- types
    |-- utils
```

### Architecture Decisions

**State Management**: Redux Toolkit with Redux Persist

- Centralized state management for tasks and mood entries
- Automatic persistence to AsyncStorage
- Async thunks for database operations

**Data Storage**: SQLite with expo-sqlite

- Local-first approach for offline functionality
- Structured relational data with proper indexing
- Automatic database initialization and migration

**Navigation**: React Navigation

- Tab navigation as primary interface
- Stack navigation within tabs for detailed views

**Charts**: Custom SVG-based components

- Built with react-native-svg for performance
- No external charting dependencies

**Styling**: StyleSheet with dynamic theming

- Consistent design system with 8px spacing
- Light/dark mode support using useColorScheme - TODO
- Responsive layouts for different screen sizes

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation Steps

1. **Clone and install dependencies**

```bash
git clone <repository-url>
cd smart-task-journal
npm install
```

2. **Start the development server**

```bash
npm run dev
```

3. **Open the app**

- Scan QR code with Expo Go app (iOS/Android)
- Press 'i' for iOS Simulator
- Press 'a' for Android Emulator
- Press 'w' for web browser

### Environment Setup

No additional environment variables required. The app uses local SQLite storage and doesn't require external services.

## 📱 Features

### Core Functionality

- **Task Management**: Create, edit, delete, and complete tasks with categories and time tracking
- **Mood Logging**: Daily mood entries with 1-5 scale and optional notes
- **Calendar View**: Browse historical entries by date with visual indicators
- **Analytics Dashboard**: Custom charts showing productivity trends and insights
- **Summary Reports**: Weekly and monthly summaries with key metrics
- **Data Export**: Export all data as JSON file for backup

### Technical Features

- **Offline-first**: All data stored locally with SQLite
- **Responsive Design**: Optimized for phones and tablets
- **Type Safety**: Full TypeScript implementation

## 🧪 Testing

Run the test suite:

## 📊 Data Structure

### Tasks

```typescript
interface Task {
  id: string;
  title: string;
  category: string;
  timeSpent: number; // minutes
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Mood Entries

```typescript
interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-5 scale
  notes?: string;
  createdAt: string;
}
```

## 🎨 Design System

### Colors

- **Primary**: #007AFF (iOS Blue)
- **Secondary**: #34C759 (Green)
- **Accent**: #FF9500 (Orange)
- **Error**: #FF3B30 (Red)
- **Warning**: #FFCC00 (Yellow)
- **Purple**: #AF52DE

### Typography

- **Large Title**: 32px, Bold
- **Title**: 20px, Semibold
- **Body**: 16px, Regular
- **Caption**: 14px, Medium
- **Small**: 12px, Regular

### Spacing

- Base unit: 8px
- Common values: 8, 12, 16, 20, 24, 32px

## 🔧 Known Limitations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

For major changes, please open an issue first to discuss the proposed changes.
