import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function CidadeScreen() {

    const { cidadeId } = useLocalSearchParams();

    return (
        <View>
            <Text>{cidadeId}</Text>
        </View>
    );
}