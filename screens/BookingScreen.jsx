import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingScreen = ({ route, navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { design } = route.params || {};

  const [artist, setArtist] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [editingBookingId, setEditingBookingId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        let currentUser = route.params?.user;
        if (!currentUser) {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            currentUser = JSON.parse(storedUser);
          }
        }

        if (currentUser && currentUser.id) {
          setUser(currentUser);
        } else {
          Alert.alert('Please log in first');
          navigation.replace('LoginSignupChoiceScreen');
        }
      } catch (error) {
        console.error('Error loading user from AsyncStorage:', error);
        Alert.alert('Error', 'Unable to load user data. Please login again.');
        navigation.replace('LoginSignupChoiceScreen');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = () => {
    axios
      .get(`http://192.168.18.26:5000/user-bookings/${user.id}`)
      .then((res) => {
        setBookingHistory(res.data);
      })
      .catch((err) => {
        console.log('Error fetching bookings:', err);
      });
  };

  const confirmBooking = () => {
    if (!artist || !date || !timeSlot) {
      Alert.alert('Please select all fields');
      return;
    }

    const bookingData = {
      user_id: user.id,
      nailart_id: design.id,
      artist_name: artist,
      booking_date: date,
      time_slot: timeSlot,
    };

    const apiUrl = editingBookingId
      ? `http://192.168.18.26:5000/bookings/${editingBookingId}`
      : 'http://192.168.18.26:5000/bookings';
    const method = editingBookingId ? 'put' : 'post';

    axios[method](apiUrl, bookingData)
      .then(() => {
        Alert.alert(`Booking ${editingBookingId ? 'updated' : 'confirmed'}!`);
        fetchBookings();
        setEditingBookingId(null);
        resetForm();
        setTimeout(() => {
          navigation.navigate('ThankyouScreen');
        }, 3000);
      })
      .catch((err) => {
        console.log(`Error ${editingBookingId ? 'updating' : 'confirming'} booking:`, err);
        Alert.alert('Error', `Failed to ${editingBookingId ? 'update' : 'book'}`);
      });
  };

  const resetForm = () => {
    setArtist('');
    setDate('');
    setTimeSlot('');
  };

  const handleEdit = (booking) => {
    setArtist(booking.artist_name);
    setDate(booking.booking_date);
    setTimeSlot(booking.time_slot);
    setEditingBookingId(booking.booking_id);
  };

  const handleCancel = (bookingId) => {
    Alert.alert('Confirm Cancel', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          axios
            .delete(`http://192.168.18.26:5000/bookings/${bookingId}`)
            .then((res) => {
              Alert.alert(res.data?.message || 'Booking cancelled!');
              fetchBookings();
            })
            .catch((err) => {
              console.log('Error cancelling booking:', err);
              Alert.alert('Error', 'Failed to cancel booking');
            });
        },
      },
    ]);
  };

  const renderOptionButtons = (options, selected, setSelected) => (
    <View style={styles.optionRow}>
      {options.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.optionButton,
            selected === item && styles.selectedOption,
          ]}
          onPress={() => setSelected(item)}
        >
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBookingItem = ({ item }) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyText}>Design: {item.design_name}</Text>
      <Text style={styles.historyText}>Price: Rs. {item.design_price}</Text>
      <Text style={styles.historyText}>Artist: {item.artist_name}</Text>
      <Text style={styles.historyText}>Date: {item.booking_date}</Text>
      <Text style={styles.historyText}>Time: {item.time_slot}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancel(item.booking_id)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const artists = ['Ayesha', 'Zara', 'Nimra'];
  const dates = ['2025-05-14', '2025-05-15', '2025-05-16'];
  const timeSlots = ['11:00 AM', '1:00 PM', '3:00 PM'];

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#D63384" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookingHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBookingItem}
        ListEmptyComponent={<Text>No bookings found.</Text>}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>
              {editingBookingId ? 'Edit Booking' : 'Book Nail Art'}
            </Text>

            <Text style={styles.label}>Design: {design?.name}</Text>
            <Text style={styles.label}>Price: Rs. {design?.price}</Text>

            <Text style={styles.label}>Select Artist</Text>
            {renderOptionButtons(artists, artist, setArtist)}

            <Text style={styles.label}>Select Date</Text>
            {renderOptionButtons(dates, date, setDate)}

            <Text style={styles.label}>Select Time Slot</Text>
            {renderOptionButtons(timeSlots, timeSlot, setTimeSlot)}

            <Button
              title={editingBookingId ? 'Update Booking' : 'Confirm Booking'}
              onPress={confirmBooking}
            />

            <Text style={styles.title}>Your Booking History</Text>
          </>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#FFF5F9',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
    color: '#D63384',
    fontFamily: 'Cochin',
  },
  label: {
    fontSize: 16,
    marginVertical: 6,
    color: '#333',
    fontFamily: 'Georgia',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'center',
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#FFB6C1',
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: '#FFDDEE',
    borderColor: '#FF69B4',
  },
  historyCard: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFF0F5',
    borderColor: '#FFC0CB',
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  historyText: {
    fontSize: 14,
    color: '#5A5A5A',
    fontFamily: 'Verdana',
    marginVertical: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#FFB6C1',
    padding: 8,
    borderRadius: 8,
    flex: 0.48,
  },
  cancelButton: {
    backgroundColor: '#FF6F91',
    padding: 8,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default BookingScreen;
