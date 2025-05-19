import React from 'react';
import AuthProvider from './contexts/AuthProvider';
import Navigation from './Navigation';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
