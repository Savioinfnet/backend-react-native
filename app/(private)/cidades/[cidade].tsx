import { ActivityIndicator, StyleSheet, View, Text, Pressable } from 'react-native';
import Cidade from "../../../models/Cidade";
import CityInfo from '../../../components/CityInfo';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import env from '../../../constants/env';

export default function CidadePage() {

    const { cidade: id } = useLocalSearchParams<{ cidade?: string }>();
    const navigation = useNavigation();
    navigation.setOptions({
        title: `Cidade`,
        headerRight: () => {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Pressable style={{ marginHorizontal: 10 }} onPress={deleteCityApi}>
                        <Text>Excluir</Text>
                    </Pressable>
                    <Pressable style={{ marginHorizontal: 10 }} onPress={() => {
                        router.push(`/(private)/formCity?id=${id}`);
                    }}>
                        <Text>Editar</Text>
                    </Pressable>
                </View>
            )
        }
    });

    const [cidade, setCidade] = useState<Cidade | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState<String | null>(null);
    const [isEditing, setEdiding] = useState(false);
    const apiUrl = env.DB_URL;
    const requestUri = `${apiUrl}/cities/${id}.json`;

    const getCityApi = async () => {
        setLoading(true);
        try {
            const response = await fetch(requestUri);
            const city = await response.json();
            setCidade(city);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    const deleteCityApi = async () => {
        setLoading(true);
        try {
            const response = await fetch(requestUri, { method: "DELETE" });
            setMessage(`${response.status}`);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCityApi();
    }, []);

    /* useEffect(() => {
        if (cidade?.nome) {
            navigation.setOptions({ title: `Cidade #${cidade.nome}` });
        }
    }, [cidade]); */

    return (
        <View style={styles.container}>
            {isLoading && <ActivityIndicator size='large' />}
            {!isLoading && message && <Text>{message}</Text>}
            {!isLoading && !isEditing && cidade && <CityInfo cidade={cidade} />}
            {/* {!isLoading && isEditing && cidade && ()} */}
            <View>


            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 15,
        flexDirection: 'row',
    }
});