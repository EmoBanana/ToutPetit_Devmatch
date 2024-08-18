import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MaschainAPI from './MaschainAPI';

// Import your images
import RedemptionImage1 from '../assets/Hotel.jpg'; // Adjust the path as needed
import RedemptionImage2 from '../assets/Restaurant.jpg'; // Adjust the path as needed
import RedemptionImage3 from '../assets/Souvenir.jpg'; // Adjust the path as needed

const CONTRACT_ADDRESS = '0x2062d53231D1944C6E770a6daCa376733dD858b9';
const CALLBACK_URL = 'YOUR_CALLBACK_URL'; // Replace with your actual callback URL

const redemptions = [
    { id: 1, title: 'Discount on Hotel Stay', description: 'Get a 40% discount on your hotel stay.', price: 800, image: RedemptionImage1 },
    { id: 2, title: 'Free Meal Voucher', description: 'Redeem a free meal at a participating restaurant.', price: 500, image: RedemptionImage2 },
    { id: 3, title: 'Souvenir Bundle', description: 'Get a bundle of handpicked souvernir.', price: 300, image: RedemptionImage3 },
];

const RedemptionPage = () => {
    const [tokens, setTokens] = useState(0);
    const route = useRoute();
    const { walletAddress } = route.params;

    useEffect(() => {
        // Fetch user's token balance and update state
        const fetchTokenBalance = async () => {
            try {
                const response = await MaschainAPI.checkTokenBalance(walletAddress, CONTRACT_ADDRESS);
                setTokens(response.result);  // Update this based on actual API response structure
            } catch (error) {
                console.error('Fetch Token Balance Error:', error);
                Alert.alert('Error', 'Failed to fetch token balance.');
            }
        };

        fetchTokenBalance();
        const intervalId = setInterval(fetchTokenBalance, 10000); // 10000ms = 10 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [walletAddress]);

    const handleRedemption = async (redemption) => {
        try {
            const transferResponse = await MaschainAPI.transferTokens(
                walletAddress,
                '0x22771f1d0Cf510aD2c8135234218548520D930A2', // Default address to transfer tokens to
                redemption.price.toString(),
                CONTRACT_ADDRESS,
                CALLBACK_URL
            );
            console.log('Transfer Response:', transferResponse);
            Alert.alert('Redemption Successful', `You have redeemed ${redemption.title}.`);
        } catch (error) {
            console.error('Redemption Error:', error);
            Alert.alert('Error', `Failed to redeem ${redemption.title}.`);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.balanceText}>Your Jom Tokens: {tokens}</Text>
            {redemptions.map((redemption) => (
                <View key={redemption.id} style={styles.redemptionContainer}>
                    <Image source={redemption.image} style={styles.redemptionImage} />
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>{redemption.title}</Text>
                        <Text style={styles.description}>{redemption.description}</Text>
                        <Text style={styles.price}>Price: {redemption.price} Tokens</Text>
                        <Button
                            title="Redeem Now"
                            onPress={() => handleRedemption(redemption)}
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
    balanceText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    redemptionContainer: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        elevation: 1,
    },
    redemptionImage: {
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

export default RedemptionPage;
