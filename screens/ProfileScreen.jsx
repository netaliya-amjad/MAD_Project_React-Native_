import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // to handle loading state

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          // If no token, user not authorized, send to login/signup
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginSignupChoice' }],
          });
          return;
        }

        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.log('Error fetching user or token from AsyncStorage', e);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchUser();

    const unsubscribe = navigation.addListener('focus', checkAuthAndFetchUser);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found.</Text>
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('EditProfile', { user });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Profile',
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
                Alert.alert('Unauthorized', 'Please log in again.');
                return;
              }

              const response = await fetch(`http://192.168.18.26:5000/delete-profile`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.ok) {
                Alert.alert('Deleted', 'Your profile has been deleted.');
                await AsyncStorage.removeItem('user');
                await AsyncStorage.removeItem('token');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'LoginSignupChoice' }],
                });
              } else {
                Alert.alert('Error', 'Failed to delete profile.');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Something went wrong.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.username}!</Text>
      <Text style={styles.label}>Email: {user.email}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Edit Profile" onPress={handleEdit} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Delete Profile" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
