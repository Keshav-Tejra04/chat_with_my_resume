import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Layout>
          <ChatInterface />
        </Layout>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;