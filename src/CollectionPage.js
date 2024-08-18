import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert, Button } from 'react-native';
import MaschainAPI from './MaschainAPI';
import * as Location from 'expo-location';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';

const CONTRACT_ADDRESS = '0xE131891861E87634267fC319C360E7ddF2d66A09';
const DEFAULT_FILE = new Blob(['NFT Placeholder Content'], { type: 'text/plain' }); // Replace with valid file content or method
const CALLBACK_URL = 'https://your.callback.url';

const CollectionPage = ({ route }) => {
    const { walletAddress } = route.params;
    const [nfts, setNfts] = useState([]);
    const [location, setLocation] = useState(null);
    const [minting, setMinting] = useState(false);
    const [mintedNFTs, setMintedNFTs] = useState([]);
    const [shouldMint, setShouldMint] = useState(false);  // State to trigger minting

    const [fontsLoaded] = useFonts({
        BebasNeue_400Regular,
    });

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                const response = await MaschainAPI.getNFTCollection(walletAddress, CONTRACT_ADDRESS);
                setNfts([...response.result, ...mintedNFTs] || []);
            } catch (error) {
                console.error('Fetch NFTs Error:', error);
                Alert.alert('Error', 'Failed to fetch NFT collection.');
            }
        };

        fetchNFTs();
    }, [mintedNFTs]);

    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLocation({ latitude: 3.1579, longitude: 101.7123 }); // Static coordinates for testing
        };

        getLocation();
    }, []);

    const DEFAULT_WALLET_ADDRESS = '0x22771f1d0Cf510aD2c8135234218548520D930A2';

    useEffect(() => {
        const checkLocationAndMintNFT = async () => {
            if (shouldMint && location && !minting) {
                setMinting(true);
                try {
                    console.log('Minting NFT...');
                    console.log('Wallet Address:', DEFAULT_WALLET_ADDRESS);
                    console.log('Contract Address:', CONTRACT_ADDRESS);

                    const response = await MaschainAPI.mintNFT(
                        DEFAULT_WALLET_ADDRESS, 
                        walletAddress, 
                        CONTRACT_ADDRESS, 
                        'KLCC', 
                        'NFT rewarded for visiting KLCC', 
                        CALLBACK_URL
                    );
                    console.log('Minting Response:', response);

                    const mintedNFT = {
                        name: 'KLCC',
                        image_url: 'https://maschain-staging.obs.ap-southeast-3.myhuaweicloud.com/eb21ed4dfea24df59f9c62937d729b1f/logo/eaf4eb0b352f45738ff6d900a4ee3dbd20240818095042.jpg',
                        tokenId: response.result.nft_token_id,
                        status: response.result.status,
                        certificateUrl: response.result.certificate,
                    };

                    setMintedNFTs(prev => [...prev, mintedNFT]);
                    Alert.alert('Success', 'NFT minted successfully!');
                } catch (error) {
                    console.error('Minting Error:', error.message);
                    Alert.alert('Error', error.message);
                } finally {
                    setMinting(false);
                    setShouldMint(false); // Reset the trigger state
                }
            }
        };

        checkLocationAndMintNFT();
    }, [shouldMint, location, minting]);

    if (!fontsLoaded || minting) {
        return null;
    }

    return (
        <ScrollView style={styles.container}>
            {nfts.length === 0 ? (
                <View style={styles.centeredContainer}>
                    <Text style={styles.noNftsText}>No NFTs Found</Text>
                    <Button
                        title="Mint NFT"
                        onPress={() => {
                            if (!location) {
                                Alert.alert('Error', 'Location not available.');
                                return;
                            }
                            setShouldMint(true);
                        }}
                        disabled={minting}
                    />
                </View>
            ) : (
                nfts.map((nft, index) => (
                    <View key={index} style={styles.nftContainer}>
                        <Image source={{ uri: "https://maschain-staging.obs.ap-southeast-3.myhuaweicloud.com/eb21ed4dfea24df59f9c62937d729b1f/logo/eaf4eb0b352f45738ff6d900a4ee3dbd20240818095042.jpg" }} style={styles.nftImage} />
                        <Text style={styles.nftName}>KLCC</Text>
                        <Text style={styles.nftDesc}>NFT rewarded for visiting KLCC!</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noNftsText: { fontSize: 24, fontFamily: 'BebasNeue_400Regular', color: '#333' },
    nftContainer: { marginBottom: 20, padding: 16, backgroundColor: '#FFF', borderRadius: 8, elevation: 1 },
    nftImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
    nftName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
    nftDesc: { fontSize: 14, fontWeight: '400', marginBottom: 4 },
});

export default CollectionPage;
