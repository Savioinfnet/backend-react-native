import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider } from 'expo-sqlite';
import { DATABASE_NAME, migrateDb } from '@/database/AppDatabase';
import UserProvider, { UserContext, UserDispatchContext } from '@/store/UserStore';
import { PaperProvider } from 'react-native-paper';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    Comfortaa: require('@/assets/fonts/Comfortaa-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  /* return (
    <UserContext.Provider>
      <UserDispatchContext.Provider>
        ...
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  ); */

  return (
    <UserProvider>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDb}>
        <PaperProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </PaperProvider>
      </SQLiteProvider>
    </UserProvider>
  );
}
