import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import TextField from '@/components/input/TextField';
import { useContext, useState } from 'react';
import { ColorsConstants, FontConstants } from '@/styles/Global.style';
import { UserActionType, UserContext, UserDispatchContext } from '@/store/UserStore';
import env from '@/constants/env';
import { router } from 'expo-router';

export default function LoginScreen() {

    const userAuth = useContext(UserContext);
    const userAuthDispatch = useContext(UserDispatchContext);

    const [isLoading, setLoading] = useState(false);
    const [inputUser, setInputUser] = useState<string>(userAuth?.email ?? "");
    const [inputPassword, setInputPassword] = useState<string>(userAuth?.password ?? "");
    const [inputUserFeedback, setInputUserFeedback] = useState<string>("");
    const [inputPasswordFeedback, setInputPasswordFeedback] = useState<string>("");

    const loginSubmit = async () => {
        setLoading(true);
        try {
            setInputUserFeedback("");
            setInputPasswordFeedback("");
            if (inputUser && inputPassword) {
                const apiKey = env.API_KEY;
                const apiUrl = env.API_URL;
                const response = await fetch(`${apiUrl}/v1/accounts:signInWithPassword?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: inputUser,
                        password: inputPassword,
                        returnSecureToken: true,
                    })
                });
                const { status } = response;
                if (status == 200) {
                    const body = await response.json();
                    // Alert.alert(`Usuário ${body.email}`);
                    userAuthDispatch({
                        type: UserActionType.LOGAR,
                        user: {
                            email: body.email,
                            password: inputPassword,
                            token: body.idToken,
                        }
                    });
                    router.push('/(private)');
                } else if (status == 400) {
                    const body = await response.json();
                    Alert.alert(`${body.error.message}`);
                } else {
                    Alert.alert(`Status ${status}`);
                }
            } else {
                if (!inputUser) setInputUserFeedback("Preencha este campo.");
                if (!inputPassword) setInputPasswordFeedback("Preencha este campo.");
            }
        } catch (error) {
            const err = error as { message: string };
            Alert.alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View testID='' style={styles.loginContainer}>
            <Image style={styles.loginImageIcon} resizeMode='contain' source={require('@/assets/images/login-logo.png')} />
            <Text style={styles.loginHeader}>Acesso</Text>
            <TextField
                testID='login-input-username'
                placeholder='Usuário'
                value={inputUser}
                onChangeText={setInputUser}
                feedback={inputUserFeedback}
                editable={!isLoading}
            />
            <TextField
                testID='login-input-password'
                placeholder='Senha'
                value={inputPassword}
                onChangeText={setInputPassword}
                feedback={inputPasswordFeedback}
                isPassword
                editable={!isLoading}
            />
            {!isLoading && <Pressable style={styles.loginBtnSubmit} onPress={loginSubmit}>
                <Text style={styles.loginBtnSubmitLabel}>Acessar</Text>
            </Pressable>}
            {isLoading && <ActivityIndicator size='large' />}
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
        alignItems: 'center',
        backgroundColor: ColorsConstants.backgroundColor
    },
    loginImageIcon: {
        height: 200,
    },
    loginHeader: {
        fontSize: FontConstants.sizeTitle,
        padding: 10,
        fontWeight: '700',
        color: FontConstants.color,
        fontFamily: FontConstants.familyRegular,
    },
    loginBtnSubmit: {
        padding: 10,
        marginVertical: 20,
        backgroundColor: "#aaf683",
        width: "50%",
        borderRadius: 10,
        shadowColor: "#343a40",
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 4,
    },
    loginBtnSubmitLabel: {
        fontSize: 20,
        textAlign: 'center',
    }
})