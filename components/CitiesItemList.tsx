import { View, Text, StyleSheet, Pressable } from "react-native";
import Cidade from "@/models/Cidade";
import { List } from "react-native-paper";

export default function CitiesItemList(props: {
    item: Cidade | null,
    onSelected: (cidade: Cidade) => void
}) {
    const { item, onSelected } = props;
    const { nome, pais, atualizado } = item as Cidade;
    const atualizadoFormat = new Date(atualizado).toLocaleDateString("pt-BR");
    return (
        <List.Item
            style={styles.itemListContainer}
            title={nome}
            description={pais}
            right={_ => (<Pressable
                onPress={() => onSelected(item as Cidade)}>
                <List.Icon icon="arrow-right-bold-circle" />
            </Pressable>)} />
    );
}

const styles = StyleSheet.create({
    itemListContainer: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5,
    },
    itemListHeader: {
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemListHeaderText: {
        fontSize: 20,
    },
    itemListContent: {
        alignItems: 'flex-end',
    }
})