import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nextrep.workout',
  appName: 'NextRep',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    StatusBar: {
      overlaysWebView: true
    }
  }
};

export default config;
