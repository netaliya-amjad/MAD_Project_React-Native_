import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Unauthorized', 'Please login again.');
        return;
      }

      // Logging token to verify it's being sent correctly
      console.log('Token for updating profile:', token);

      const response = await axios.put(
        `http://192.168.18.26:5000/users/${user.id}`,
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Update response:', response.data); // Log the response for debugging
      Alert.alert('Updated', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                Alert.alert('Unauthorized', 'Please login again.');
                return;
              }

              // Logging token to verify it's being sent correctly for deletion
              console.log('Token for deleting profile:', token);

              // Send request to backend to delete profile
              const response = await axios.delete(
                `http://192.168.18.26:5000/delete-profile`, // This is your correct backend endpoint for deletion
                { headers: { Authorization: `Bearer ${token}` } }
              );

              console.log('Delete response:', response.data); // Log the response for debugging

              // Remove the token from AsyncStorage and navigate to login screen
              await AsyncStorage.removeItem('token');
              Alert.alert('Deleted', 'Your profile has been deleted.');
              navigation.navigate('LoginSignupChoice'); // Navigate back to the login/signup screen
            } catch (error) {
              console.error('Delete error:', error.response?.data || error.message);
              Alert.alert('Error', 'Failed to delete profile');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <Button title="Update" onPress={handleUpdate} />
      <View style={{ height: 10 }} />
      <Button title="Delete Profile" color="red" onPress={handleDelete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default EditProfileScreen;
