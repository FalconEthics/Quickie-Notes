import React, { useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';

type AuthMode = 'login' | 'register';

type FormData = {
  email: string;
  password: string;
};

export default function AuthScreen() {
  const { login, register: registerUser, loginWithGoogle, loginWithGithub } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      if (mode === 'login') {
        await login(data.email, data.password);
      } else {
        await registerUser(data.email, data.password);
      }

      // Redirect to home
      router.replace('/');
    } catch (error) {
      console.error('Auth error:', error);
      alert(`Failed to ${mode === 'login' ? 'login' : 'register'}: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);

      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithGithub();
      }

      // Redirect to home
      router.replace('/');
    } catch (error) {
      console.error(`${provider} login error:`, error);
      alert(`Failed to login with ${provider}: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5F5F5' }
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>←</ThemedText>
          </Pressable>
          <ThemedText type="title">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </ThemedText>
          <View style={styles.spacer} />
        </View>

        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
          />
          <ThemedText type="title" style={styles.appName}>
            Quickie-Notes
          </ThemedText>
        </View>

        {/* Auth Form */}
        <BlurView
          intensity={20}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={styles.formContainer}
        >
          <ThemedText style={styles.formTitle}>
            {mode === 'login' ? 'Welcome Back!' : 'Join Us Today'}
          </ThemedText>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <Controller
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.email && styles.inputError,
                    { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
                  ]}
                  placeholder="your@email.com"
                  placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />
            {errors.email && (
              <ThemedText style={styles.errorText}>
                {errors.email.message}
              </ThemedText>
            )}
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <Controller
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors.password && styles.inputError,
                    { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="password"
            />
            {errors.password && (
              <ThemedText style={styles.errorText}>
                {errors.password.message}
              </ThemedText>
            )}
          </View>

          {/* Submit Button */}
          <Pressable
            style={[
              styles.submitButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <ThemedText style={styles.submitButtonText}>
                {mode === 'login' ? 'Login' : 'Create Account'}
              </ThemedText>
            )}
          </Pressable>

          {/* Mode Toggle */}
          <Pressable
            style={styles.toggleContainer}
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            <ThemedText>
              {mode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </ThemedText>
          </Pressable>

          {/* Social Login Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>OR</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtons}>
            <Pressable
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <ThemedText>🔍</ThemedText>
              <ThemedText style={styles.socialButtonText}>
                Continue with Google
              </ThemedText>
            </Pressable>

            <Pressable
              style={styles.socialButton}
              onPress={() => handleSocialLogin('github')}
            >
              <ThemedText>🐱</ThemedText>
              <ThemedText style={styles.socialButtonText}>
                Continue with GitHub
              </ThemedText>
            </Pressable>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    fontSize: 24,
    padding: 8,
  },
  spacer: {
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
  },
  formContainer: {
    padding: 20,
    borderRadius: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dividerText: {
    paddingHorizontal: 16,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  socialButtonText: {
    marginLeft: 8,
  },
});
