import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AppStackNavigation } from './src/navigation';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { sqliteService } from './src/service/sqliteService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    sqliteService.init();
  }, []);
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppStackNavigation />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
