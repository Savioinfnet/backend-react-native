import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, Pressable } from 'react-native';
import Cidade from "@/models/Cidade";
import CitiesList from '@/components/CitiesList';
import CityInfo from '@/components/CityInfo';
import { router } from 'expo-router';
import { CitiesContext, CitiesContextState } from '@/context/CitiesContext';
import { useSQLiteContext } from 'expo-sqlite';
import { SELECT_ALL_CITIES } from '@/database/AppDatabase';
import { UserContext } from '@/store/UserStore';
import env from '@/constants/env';
import { ActivityIndicator, FAB, Text } from 'react-native-paper';

export default function PrivateScreen() {

    // const userAuth = useContext(UserContext);
    // const { cities: cidades } = useContext(CitiesContext) as CitiesContextState;

    const { width, height } = useWindowDimensions();
    const isPortrait = width < height;

    const [cidades, setCidades] = useState<Array<Cidade> | null>(null);
    const [cidade, setCidade] = useState<Cidade | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState<String | null>(null);

    const exemplo = {
        query: `
            query: { 
                city(id: '4', nome: 'null') { nome  pais } 
                pointsOfCity(cityId: '4') { 
                    id nome preco 
                } 
            }`
    };

    const getCitiesApi = async () => {
        setLoading(true);
        try {
            const apiGqlUrl = env.API_GQL_URL;
            const response = await fetch(apiGqlUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `query {
                        cities {
                          id
                          nome
                          pais
                          atualizado
                        }
                      }`,
                })
            }); // POST
            const { data } = await response.json();
            setCidades(data.cities);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCitiesApi();
    }, []);

    const selecionarCidade = (cidade: Cidade) => {
        if (isPortrait)
            router.push(`/cidades/${cidade.id}`);
        else
            setCidade(cidade);
    }

    return (
        <View style={styles.container}>
            <View style={isPortrait ? styles.containerListPortaint : styles.containerListLandscape}>
                <Text variant='displaySmall'>Cidades</Text>

                {isLoading && <ActivityIndicator size={100} />}

                {message && <Text variant='titleSmall'>{message}</Text>}

                {!isLoading && cidades &&
                    <CitiesList
                        cidades={cidades}
                        onSelected={selecionarCidade}
                        refreshingAction={getCitiesApi}
                    />
                }

                <FAB style={{ width: 50, position: 'absolute', bottom: 80, right: 16, backgroundColor: '#219ebc' }}
                    icon="plus"
                    onPress={() => {
                        router.push('/(private)/formCity');
                    }} />
                <FAB style={{ width: 50, position: 'absolute', bottom: 16, right: 16, 
                backgroundColor: '#80ed99' }} icon="map-marker" onPress={() => {
                    router.push('/(private)/location');
                }} />
            </View>
            {!isPortrait && cidade && <CityInfo cidade={cidade} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 15,
        flexDirection: 'row',
    },
    containerListPortaint: {
        width: "100%",
    },
    containerListLandscape: {
        width: "30%",
    },
    fabToLocation: {
        position: 'absolute',
        right: 10,
        bottom: 20,
        backgroundColor: "#7cb518",
        padding: 10,
        borderRadius: 50,
    },
    fabToForm: {
        position: 'absolute',
        right: 10,
        bottom: 80,
        backgroundColor: "#023047",
        padding: 10,
        borderRadius: 50,
    },
    fabToLocationLabel: {
        fontSize: 20,
    }
});