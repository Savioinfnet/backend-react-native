import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import * as Location from 'expo-location';
import MapView, { Marker, MapPressEvent, LatLng } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LocationScreen() {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [markers, setMarkers] = useState<Array<LatLng>>([]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let locationPermission = await Location.requestForegroundPermissionsAsync();
            let { status } = locationPermission;
            // let status = locationPermission.status;
            if (status !== 'granted') {
                setMessage('A permissão foi negada!');
            } else {
                let location = await Location.getCurrentPositionAsync();
                setLocation(location);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const markersStorage = await AsyncStorage.getItem('markers');
            let markersList: Array<LatLng> = [];
            if (markersStorage) {
                markersList = JSON.parse(markersStorage);
                setMarkers(markersList);
            }
        })();
    }, []);

    return (
        <View>
            <Text>Localização</Text>
            <Text>Longitude: {location?.coords.longitude}</Text>
            <Text>Latitude: {location?.coords.latitude}</Text>
            <Text>Marcadores: {markers.length}</Text>
            <MapView
                style={styles.locationMapView}
                initialRegion={{
                    latitude: location?.coords.latitude ?? 0,
                    longitude: location?.coords.longitude ?? 0,
                    latitudeDelta: 0,
                    longitudeDelta: 0,
                }}
                showsUserLocation
                // showsPointsOfInterest={false}
                onPress={async (mapPress: MapPressEvent) => {
                    const { coordinate } = mapPress.nativeEvent;
                    const markersStorage = await AsyncStorage.getItem('markers');
                    let markersList: Array<LatLng> = [];
                    if (markersStorage) 
                        markersList = JSON.parse(markersStorage);
                    markersList.push(coordinate);
                    AsyncStorage.setItem('markers', JSON.stringify(markersList));
                    setMarkers(markersList);
                }}
            >

                {markers.map(marker => (
                    <Marker
                        draggable
                        coordinate={marker}
                    // title="Local A"
                    // description="Descrição Local A"
                    // pinColor="indigo"
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    locationMapView: {
        width: "100%",
        height: "100%",
    }
});