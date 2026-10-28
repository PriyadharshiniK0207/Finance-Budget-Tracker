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
import { validateProfile } from '../utils/validation';

const EditProfileScreen = ({ navigation }) => {
  const { currentUser, updateProfile, isAdmin } = useFinance();

  // If Admin somehow navigates here, strictly deny access (Screen 3: Customer Only)
  if (isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Access Denied</Text>
            <Text style={styles.headerSubtitle}>Customer Only Screen (Exam Req #3)</Text>
          </View>
        </View>

        <View style={styles.restrictedContainer}>
          <View style={styles.restrictedIconBox}>
            <Ionicons name="lock-closed" size={44} color={colors.expense} />
          </View>
          <Text style={styles.restrictedTitle}>Access Denied for Admin</Text>
          <Text style={styles.restrictedDesc}>
            Profile and Edit Profile features are reserved for Customer accounts only. Administrators do not have access to customer profile editing.
          </Text>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.saveBtnText}>Return to Previous Screen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [budget, setBudget] = useState(currentUser?.monthlyBudget?.toString() || '50000');
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const validation = validateProfile({ name, email, phone, budget });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      monthlyBudget: parseFloat(budget) || 50000,
    });

    Alert.alert(
      'Profile Updated',
      'Customer profile details have been updated successfully!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>Customer Account Parameters</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <Text style={styles.sectionSubtitle}>
              Update your account details and monthly spending limit
            </Text>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL LEGAL NAME *</Text>
              <View style={[styles.inputWrapper, errors.name && styles.inputWrapperError]}>
                <Ionicons name="person-outline" size={17} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS *</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
                <Ionicons name="mail-outline" size={17} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
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

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>MOBILE PHONE NUMBER *</Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputWrapperError]}>
                <Ionicons name="call-outline" size={17} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor={colors.textMuted}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                  }}
                  keyboardType="phone-pad"
                  maxLength={13}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Monthly Budget Target */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {isAdmin ? 'SYSTEM BUDGET ALLOCATION (₹) *' : 'MONTHLY BUDGET ALLOCATION (₹) *'}
              </Text>
              <View style={[styles.inputWrapper, errors.budget && styles.inputWrapperError]}>
                <Ionicons name="wallet-outline" size={17} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 50000"
                  placeholderTextColor={colors.textMuted}
                  value={budget}
                  onChangeText={(text) => {
                    setBudget(text);
                    if (errors.budget) setErrors((prev) => ({ ...prev, budget: null }));
                  }}
                  keyboardType="numeric"
                />
              </View>
              {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.accent} style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>
                {isAdmin ? 'Save Administrator Profile' : 'Save Profile Changes'}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Discard & Return</Text>
            </TouchableOpacity>
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
  header: {
    height: Platform.OS === 'ios' ? 56 : 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 18,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    paddingVertical: 11,
    fontSize: 14,
    color: colors.primary,
  },
  errorText: {
    fontSize: 11,
    color: colors.expense,
    marginTop: 4,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: colors.accentDark,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  restrictedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  restrictedIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.expenseLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.expenseBorder,
  },
  restrictedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  restrictedDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
});

export default EditProfileScreen;
