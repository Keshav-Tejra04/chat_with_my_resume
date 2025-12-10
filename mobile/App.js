import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatProvider } from './src/context/ChatContext';
import HomeScreen from './src/screens/HomeScreen';
import "./global.css";

// Import this to make Tailwind work
import "./global.css";

export default function App() {
    return (
        <SafeAreaProvider>
            <ChatProvider>
                <HomeScreen />
            </ChatProvider>
        </SafeAreaProvider>
    );
}