import { INSERT_TB_CITIES, TB_CITIES_NAME } from "@/database/AppDatabase";
import { router, useLocalSearchParams } from "expo-router";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Alert, Pressable, View } from "react-native";
import { Text, FAB } from 'react-native-paper';
import env from '@/constants/env';

export default function FormCityConfirmScreen() {

    const { nome, pais, data, passaporte } = useLocalSearchParams();

    // <SQLiteProvider>
    // const db = useSQLiteContext();
    // </SQLiteProvider>

    const query = `mutation($newCity: addCityInput) { 
        addCity(newCity: $newCity) { 
            id 
        }
    }`;

    const variables = {
        newCity: { nome, pais },
    };

    const fabAction = async () => {
        try {
            const apiGqlUrl = env.API_GQL_URL;
            const response = await fetch(apiGqlUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query, variables }),
            });
            const { data } = await response.json();
            const { addCity } = data;
            Alert.alert(`Cidade salva. ${addCity.id}`);
            router.push('/(private)');
        } catch (error) {
            const err = error as { message: string };
            Alert.alert(err.message);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Text variant="displaySmall" >Confirmar Dados</Text>
            <View style={{ flexDirection: 'row' }}>
                <Text variant="headlineSmall">Nome:</Text>
                <Text variant="headlineMedium">{nome}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text variant="headlineSmall">Pais:</Text>
                <Text variant="headlineMedium">{pais}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text variant="headlineSmall">Data:</Text>
                <Text variant="headlineMedium">{data}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text variant="headlineSmall">Passaporte:</Text>
                <Text variant="headlineMedium">{passaporte ? 'Sim' : 'Não'}</Text>
            </View>
            <FAB style={{ width: 50, position: 'absolute', bottom: 16, right: 16  }} icon="content-save" onPress={fabAction} />
        </View>
    );
}