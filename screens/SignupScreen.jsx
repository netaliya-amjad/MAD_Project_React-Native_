import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthContext from '../contexts/AuthContext'; // Make sure path correct ho
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  // Token verify karne wali function (backend pe /verify-token endpoint hona chahiye)
  const verifyToken = async (token) => {
    try {
      const response = await axios.get('http://192.168.18.26:5000/verify-token', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.success === true;
    } catch (error) {
      return false;
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Signup request (axios better hai kyunki headers easily set kar sakte hain)
      const response = await axios.post('http://192.168.18.26:5000/signup', {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Token verify karo backend se
        const isValid = await verifyToken(token);

        if (isValid) {
          // Context me login function call karo jo AsyncStorage bhi handle karega
          await login(token, user);
          navigation.navigate('HomeTabs', { user });
        } else {
          setMessage('Token verification failed');
        }
      } else {
        setMessage(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.log(error);
      setMessage('Network request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading ? styles.buttonDisabled : null]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Signup'}</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#7cb87c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: '#d9534f',
  },
  loginLink: {
    marginTop: 20,
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
