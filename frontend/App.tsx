import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import useCachedResources from './src/hooks/useCachedResources';
import { useInitColorScheme } from './src/hooks/useColorScheme';
import MobileSafeAreaView from './src/components/MobileSafeAreaView';
import { AuthProvider } from './src/hooks/useAuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { IntlProvider } from './src/hooks/useLangContext';

const queryClient = new QueryClient();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const isAppearenceComplete = useInitColorScheme()
  if (!isLoadingComplete || !isAppearenceComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <MobileSafeAreaView>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <IntlProvider>
                {/* devtools */}
                {/* <ReactQueryDevtools initialIsOpen={true} /> */}
                <Navigation/>
                <StatusBar />
              </IntlProvider>
            </QueryClientProvider>
          </AuthProvider>
        </MobileSafeAreaView>
      </SafeAreaProvider>
    );
  }
}
