import React from 'react';
import { View, Text, Button, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaschainAPI from './MaschainAPI';

// Import your images
import TicketImage1 from '../assets/Airline.jpg'; // Adjust the path as needed
import TicketImage2 from '../assets/Transport.jpg'; // Adjust the path as needed
import TicketImage3 from '../assets/KLTower.jpg'; // Adjust the path as needed

const DEFAULT_WALLET_ADDRESS = '0x22771f1d0Cf510aD2c8135234218548520D930A2'; // Default wallet address
const CONTRACT_ADDRESS = '0x2062d53231D1944C6E770a6daCa376733dD858b9';
const REBATE_PERCENTAGE = 500;

const tickets = [
    { id: 1, title: 'Flight to Malaysia', description: 'A one-way flight ticket to Malaysia.', price: 0.1, image: TicketImage1 },
    { id: 2, title: 'Car Rental for A Week', description: 'We got your transportation covered!', price: 0.15, image: TicketImage2 },
    { id: 3, title: 'KL Tower Admission Ticket', description: 'Look at the beautiful city from atop.', price: 1, image: TicketImage3 },
];

const HomePage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { walletAddress } = route.params; // Get wallet address from navigation params

    const handlePurchase = async (ticket) => {
        try {
            // Simulate transferring tokens (in reality, you would use MaschainAPI.transferTokens)
            const transferSuccess = true; // Simulate a successful transfer
            if (transferSuccess) {
                // Calculate rebate (5%)
                const rebate = ticket.price * REBATE_PERCENTAGE;
                
                // Define callback URL
                const callbackUrl = 'YOUR_CALLBACK_URL'; // Replace with your callback URL
    
                // Mint tokens
                try {
                    const mintResponse = await MaschainAPI.mintTokens(DEFAULT_WALLET_ADDRESS, walletAddress, rebate.toFixed(2), CONTRACT_ADDRESS, callbackUrl);
                    console.log('Mint Response:', mintResponse); // Log the response
                    Alert.alert('Purchase Successful', `Transaction completed. You have received ${rebate.toFixed(2)} tokens as a rebate.`);
                } catch (mintError) {
                    console.error('Minting Error:', mintError); // Log the error
                    Alert.alert('Error', 'Failed to mint tokens.');
                }
            } else {
                Alert.alert('Error', 'Failed to complete the purchase.');
            }
        } catch (error) {
            console.error('Purchase Error:', error); // Log the error
            Alert.alert('Error', 'Failed to complete the purchase.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            {tickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketContainer}>
                    <Image source={ticket.image} style={styles.ticketImage} />
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>{ticket.title}</Text>
                        <Text style={styles.description}>{ticket.description}</Text>
                        <Text style={styles.price}>Price: {ticket.price} ETH</Text>
                        <Button
                            title="Purchase Ticket"
                            onPress={() => handlePurchase(ticket)}
                            color="#007BFF"
                        />
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    ticketContainer: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        elevation: 1,
    },
    ticketImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    detailsContainer: {
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        marginVertical: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 8,
    },
});

export default HomePage;
