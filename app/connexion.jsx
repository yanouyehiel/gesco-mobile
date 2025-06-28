import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { colors } from '@/utils/colors';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { login, storeData } from '@/services/MainService';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { showToast } from '@/utils/fonctions';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleSubmit() {
    setError(false);

    if (!email || !password) {
      setError(true);
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    if (!isEmailValid(email)) {
      setError(true);
      showToast("L'email est incorrect", 'error');
      return;
    }

    const data = { email, password };
    setLoading(true);

    try {
      const res = await login(data);

      if (res.status_code === 401) {
        showToast(res.message, 'error');
      } else {
        storeData('ecoleGesco', res.ecole);
        storeData('tokenGesco', res).then(() => {
          if (res.user.role_id === 2) router.push('(tabs_teacher)');
          else if (res.user.role_id === 3) router.push('(tabs_parent)');
          else showToast("Vous n'avez pas les accès.", 'error');
        });
      }
    } catch (err) {
      showToast(err.response?.data.message || 'Erreur inconnue', 'error');
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.Text
          entering={FadeInLeft.duration(800).springify()}
          style={styles.title}
        >
          Connexion
        </Animated.Text>

        <Text style={styles.subtitle}>
          Entrez votre email et mot de passe pour continuer
        </Text>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.inputGroup}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, error && !email && styles.inputError]}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.inputGroup}>
          <View style={[styles.input, styles.passwordInput, error && !password && styles.inputError]}>
            <TextInput
              placeholder="Mot de passe"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              style={styles.passwordText}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.BLANC} />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => router.push('password-forgot')}>
          <Text style={styles.link}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity onPress={() => router.push('register')}>
            <Text style={styles.link}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.BLANC,
  },
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Regular',
    color: colors.NOIR,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.NOIR,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.NOIR,
  },
  buttonWrapper: {
    marginTop: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.BLEU,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.BLANC,
    fontSize: 18,
    fontFamily: 'Regular',
  },
  link: {
    textAlign: 'center',
    color: colors.BLEU,
    fontSize: 16,
    fontFamily: 'Regular',
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Regular',
    marginBottom: 4,
  },
});

export default LoginScreen;
