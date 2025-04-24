import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to HomeTabs (Bottom Tab Navigator) after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('HomeTabs'); // Use replace to avoid going back to WelcomeScreen
    }, 3000); // 3 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Polish Pop 💅</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0f6', // light pink background
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#d63384', // Barbie pink
    fontFamily: 'Cochin', // Optional, we can change this later to a fancy font
  },
});

export default WelcomeScreen;
