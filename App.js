import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaschainAPI from './src/MaschainAPI';
import BottomTabNavigator from './src/BottomTabNavigator';

const Stack = createNativeStackNavigator();

function WalletScreen({ navigation }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [wallet, setWallet] = useState(null);
  const [walletType, setWalletType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (wallet) {
      const address = wallet.result.address || wallet.result.wallet.wallet_address;
      navigation.replace('JomNFT', { walletAddress: address, walletType });
    }
  }, [wallet, walletType, navigation]);

  const handleCreateWallet = async () => {
    try {
      const createdWallet = await MaschainAPI.createWallet(name, email, phone);
      setWallet(createdWallet);
      const address = createdWallet.result.wallet.wallet_address;
      setWalletType('created');
      setModalVisible(false);  // Close the modal on success
      Alert.alert('Wallet Created', `Your wallet address: ${address}`);
    } catch (error) {
      console.error('Create Wallet Error:', error);
      Alert.alert('Error', 'Failed to create wallet.');
    }
  };

  const handleConnectWallet = async () => {
    if (!walletAddress) {
      Alert.alert('Error', 'Wallet address is required.');
      return;
    }

    try {
      const response = await MaschainAPI.getWallet(walletAddress);
      if (response && response.result) {
        setWallet(response);
        setWalletType('connected');
        Alert.alert('Wallet Connected', `Connected to wallet: ${response.result.address}`);
      } else {
        Alert.alert('Error', 'Wallet does not exist or invalid response.');
      }
    } catch (error) {
      console.error('Connect Wallet Error:', error);
      Alert.alert('Error', 'Failed to connect wallet.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}><Text style={{fontSize: 20}} > Welcome! </Text>{"\n"}Please create or connect your wallet to proceed.</Text>
      <Button title="Create Wallet" onPress={() => setModalVisible(true)} style={styles.button} />
      <Text style={styles.orText}>or</Text>
      <TextInput
        placeholder="Enter Wallet Address"
        value={walletAddress}
        onChangeText={setWalletAddress}
        style={styles.textInput}
      />
      <Button title="Connect Wallet" onPress={handleConnectWallet} style={styles.button} />

      {/* Modal for Creating Wallet */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Wallet</Text>
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.modalInput}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              style={styles.modalInput}
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCreateWallet}>
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    width: '80%',
    marginBottom: 10,
  },
  orText: {
    fontSize: 16,
    color: '#888',
    marginVertical: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  const handleDisconnectWallet = (navigation) => {
    setModalVisible(false);
    setWalletAddress('');
    navigation.navigate('Wallet');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen
          name="JomNFT"
          component={BottomTabNavigator}
          options={({ route, navigation }) => ({
            headerRight: () => (
              <>
                <Text style={{ marginRight: 10 }} onPress={() => setModalVisible(true)}>
                  {formatWalletAddress(route.params.walletAddress)}
                </Text>
                <Modal
                  visible={modalVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={disconnect.modalContainer}>
                    <View style={disconnect.modalContent}>
                      <Text style={disconnect.modalTitle}>Disconnect Wallet</Text>
                      <Text style={disconnect.modalText}>Are you sure you want to disconnect your wallet?</Text>
                      <View style={disconnect.modalButtonContainer}>
                        <TouchableOpacity
                          style={disconnect.modalButton}
                          onPress={() => handleDisconnectWallet(navigation)}
                        >
                          <Text style={disconnect.modalButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={disconnect.modalButton}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={disconnect.modalButtonText}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const disconnect = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});