import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';
import { validateSignIn } from '../utils/validation';

const SignInScreen = ({ navigation }) => {
  const { login } = useFinance();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignIn = () => {
    const validation = validateSignIn({ email, password, role });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    login(email, password, role);
    navigation.reset({
      index: 0,
      routes: [{ name: 'DrawerRoot' }],
    });
  };

  // Quick Demo Login for Viva / Exam Evaluation
  const handleQuickDemo = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@financetracker.com');
      setPassword('admin123');
      setRole('admin');
      login('admin@financetracker.com', 'admin123', 'admin');
    } else {
      setEmail('priya@example.com');
      setPassword('password123');
      setRole('customer');
      login('priya@example.com', 'password123', 'customer');
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'DrawerRoot' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="wallet" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>Finance & Budget</Text>
            <Text style={styles.brandSubtitle}>Personal Wealth & Expense Tracker</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>Sign in to manage your budget and finances</Text>

            {/* Role Selection */}
            <Text style={styles.inputLabel}>Select Your Role</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'customer' && styles.roleButtonActiveCustomer,
                ]}
                onPress={() => setRole('customer')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={role === 'customer' ? '#FFFFFF' : colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    role === 'customer' && styles.roleButtonTextActive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'admin' && styles.roleButtonActiveAdmin,
                ]}
                onPress={() => setRole('admin')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={role === 'admin' ? '#FFFFFF' : colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    role === 'admin' && styles.roleButtonTextActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. priya@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Sign In Submit Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSignIn}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            {/* Switch to Sign Up */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.switchLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Demo Credentials Box for Exam Viva */}
          <View style={styles.demoBox}>
            <View style={styles.demoHeader}>
              <Ionicons name="flash" size={16} color={colors.warning} />
              <Text style={styles.demoTitle}>One-Tap Demo Credentials (Practical Exam)</Text>
            </View>
            <Text style={styles.demoSubtitle}>
              Tap either option to immediately test the application without manual typing:
            </Text>
            <View style={styles.demoActions}>
              <TouchableOpacity
                style={[styles.demoBtn, { borderColor: colors.incomeBorder, backgroundColor: colors.incomeLight }]}
                onPress={() => handleQuickDemo('customer')}
                activeOpacity={0.8}
              >
                <Ionicons name="person" size={14} color={colors.incomeDark} style={{ marginRight: 4 }} />
                <Text style={[styles.demoBtnText, { color: colors.incomeDark }]}>
                  Demo Customer (Priya)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoBtn, { borderColor: colors.primarySoft, backgroundColor: colors.primaryLight }]}
                onPress={() => handleQuickDemo('admin')}
                activeOpacity={0.8}
              >
                <Ionicons name="shield-checkmark" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.demoBtnText, { color: colors.primary }]}>
                  Demo Admin (Manager)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: 18,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  formSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
  },
  roleButtonActiveCustomer: {
    backgroundColor: colors.incomeDark,
    borderColor: colors.incomeDark,
  },
  roleButtonActiveAdmin: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputWrapperError: {
    borderColor: colors.expense,
    backgroundColor: colors.expenseLight,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  errorText: {
    fontSize: 11,
    color: colors.expense,
    marginTop: 4,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  switchText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  demoBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 6,
  },
  demoSubtitle: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
    marginBottom: 10,
  },
  demoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default SignInScreen;
