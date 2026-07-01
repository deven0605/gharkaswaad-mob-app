import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { restoreTokens } from './src/store/authSlice';
import { loadTokens } from './src/utils/secureStorage';
import AuthNavigator from './src/navigation/AuthNavigator';
import { Colors } from './src/theme/colors';

function AppContent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadTokens().then(tokens => {
      if (tokens) {
        store.dispatch(restoreTokens(tokens));
      }
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FBF0E4' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
