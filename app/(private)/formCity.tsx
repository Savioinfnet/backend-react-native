import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { TextInput, Switch, Button, Modal, Portal } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import env from '../../constants/env';
import ModalCityConfirm from "@/components/ModalCityConfirm";

export default function FormCityScreen() {

    const { id } = useLocalSearchParams();

    const [inputNome, setInputNome] = useState("");
    const [inputPais, setInputPais] = useState("Brasil");
    const [inputData, setInputData] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [inputPassaporte, setInputPassaporte] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const listaPais = [
        { label: "Brasil", value: "BR" },
        { label: "Estados Unidos", value: "EUA" },
        { label: "França", value: "FR" },
        { label: "Espanha", value: "ES" },
        { label: "Portugal", value: "PT" },
        { label: "Itália", value: "IT" },
    ];

    useEffect(() => {
        const getCity = async () => {
            if (id) {
                const apiUrl = env.DB_URL;
                const requestUri = `${apiUrl}/cities/${id}.json`;
                // setLoading(true);
                try {
                    const response = await fetch(requestUri);
                    const city = await response.json();
                    setInputNome(city.nome);
                } catch (error) {
                    // setMessage(error.message);
                } finally {
                    // setLoading(false);
                }
            }
        }
        getCity();
    }, [id]);

    return (
        <View style={styles.formContainer}>
            <TextInput
                mode="flat"
                label="Nome da Cidade"
                placeholder="Informe o Nome da cidade"
                // style={styles.formTextInput}
                value={inputNome}
                onChangeText={setInputNome}
                right={<TextInput.Icon icon="eye" />}
            />
            <View style={styles.formPickerContainer}>
                <Text>Pais: </Text>
                <Picker
                    style={styles.formPicker}
                    selectedValue={inputPais}
                    onValueChange={setInputPais}
                >
                    {listaPais.map(pais => <Picker.Item {...pais} />)}
                </Picker>
            </View>
            <Pressable
                style={styles.formDateTimePicker}
                onPress={() => setShowDatePicker(true)}>
                <Text style={styles.formDateTimePickerLabel}>Data</Text>
                <Text>{inputData.toLocaleDateString("pt-BR")}</Text>
            </Pressable>
            {showDatePicker && <DateTimePicker
                // mode="time"
                // display="clock"
                value={inputData}
                onChange={(_, date) => {
                    setShowDatePicker(false);
                    if (date)
                        setInputData(date);
                }}
            // maximumDate={new Date()}
            // minimumDate={new Date()}
            />}
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Passaporte:</Text>
                <View style={styles.switchOption}>
                    <Text>Não</Text>
                    <Switch
                        value={inputPassaporte}
                        onValueChange={setInputPassaporte}
                    />
                    <Text>Sim</Text>
                </View>
            </View>

            <Button
                mode="contained"
                // buttonColor="blue"
                // textColor="orange"
                icon="content-save"
                onPress={() => { setShowModal(true) }}
            >
                Salvar
            </Button>
            {/* <Pressable style={styles.formPressableSubmit} onPress={() => {
                router.push(`/(private)/formCityConfirm?nome=${inputNome}&pais=${inputPais}&data=${inputData.toLocaleString("pt-BR")}&passaporte=${inputPassaporte}`);
            }}>
                <Text style={styles.formPressableSubmitLabel}>Salvar</Text>
            </Pressable> */}

            <Portal>
                <Modal
                    visible={showModal}
                    onDismiss={() => { setShowModal(false) }}
                >
                    <ModalCityConfirm
                        nome={inputNome}
                        pais={inputPais}
                        data={inputData}
                        passaporte={inputPassaporte}
                    />
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    formDateTimePicker: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    formDateTimePickerLabel: {
        flex: 1,
    },
    formContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    formTextInput: {
        margin: 4,
        padding: 8,
        borderRadius: 5,
        backgroundColor: "#caf0f8"
    },
    formPickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    formPicker: {
        flex: 1,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    switchLabel: {
        flex: 1,
    },
    switchOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    formPressableSubmit: {
        backgroundColor: "#8cd867",
        margin: 20,
        padding: 5,
        borderRadius: 5,
    },
    formPressableSubmitLabel: {
        textAlign: "center",
    }
});