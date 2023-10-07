import React, { Suspense } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
  const isViewer = window.location !==undefined && window.location.pathname.endsWith('/viewer')
  const Navigation = React.lazy(()=> import('./src/navigation'))
  const ChatViewer = React.lazy(()=> import('./src/navigation/ChatViewer'))
  if (!isLoadingComplete || !isAppearenceComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <MobileSafeAreaView>
          {!isViewer?<AuthProvider>
            <QueryClientProvider client={queryClient}>
              <IntlProvider>
                {/* devtools */}
                {/* <ReactQueryDevtools initialIsOpen={true} /> */}
                <Suspense fallback={<></>}>
                  <Navigation/>
                </Suspense>
                <StatusBar />
              </IntlProvider>
            </QueryClientProvider>
          </AuthProvider>:
          <QueryClientProvider client={queryClient}>
            <IntlProvider>
              <Suspense fallback={<></>}>
                <ChatViewer/>
              </Suspense>
            </IntlProvider>
          </QueryClientProvider>}
        </MobileSafeAreaView>
      </SafeAreaProvider>
    );
  }
}

(function(l) {  // for github-page
    if (l !== undefined && l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, '',
            l.pathname.slice(0, -1) + decoded + l.hash
        );
    }
}(window.location))