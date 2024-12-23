import { StyleSheet, Text, View } from 'react-native';
import Cidade from "@/models/Cidade";
import LocationsList from './LocationsList';

export default function CityInfo(props: { cidade: Cidade }) {
    const { cidade } = props;
    const { nome, pais, pontos } = cidade;
    return (
        <View style={styles.cityInfoContainer}>
            <Text>{nome}</Text>
            <Text>{pais}</Text>
            {pontos && <LocationsList pontos={cidade?.pontos} />}
        </View>
    );
};

const styles = StyleSheet.create({
    cityInfoContainer: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 15,
    },
    containerListPortaint: {
        width: "100%",
    },
    containerListLandscape: {
        width: "30%",
    }
});