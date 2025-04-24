
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Booking your glam session 💖</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3e5f5',
  },
  text: {
    fontSize: 24,
    color: '#6a1b9a',
    fontWeight: 'bold',
  },
});

export default BookingScreen;
