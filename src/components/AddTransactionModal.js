import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';
import { validateTransaction } from '../utils/validation';

const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'];

const AddTransactionModal = ({ visible, onClose }) => {
  const { categories, addTransaction } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || 'Food & Dining');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setSelectedCategory(categories[0]?.name || 'Food & Dining');
    setPaymentMethod('UPI');
    setNotes('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const matchedCat = categories.find((c) => c.name === selectedCategory);
    const catId = matchedCat ? matchedCat.id : 'food';

    const validation = validateTransaction({
      title,
      amount,
      category: selectedCategory,
      type,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Call addTransaction which triggers Requirement 11 Personalized Alert!
    addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      category: selectedCategory,
      categoryId: catId,
      paymentMethod,
      notes,
      date: new Date().toISOString().split('T')[0],
    });

    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Add Transaction</Text>
              <Text style={styles.headerSubtitle}>Record new income or expense</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Type Switcher: Income / Expense */}
            <View style={styles.typeSwitcher}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'expense' && styles.typeBtnExpenseActive,
                ]}
                onPress={() => setType('expense')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={18}
                  color={type === 'expense' ? '#FFFFFF' : colors.expense}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    type === 'expense' && styles.typeBtnTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'income' && styles.typeBtnIncomeActive,
                ]}
                onPress={() => setType('income')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={18}
                  color={type === 'income' ? '#FFFFFF' : colors.income}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    type === 'income' && styles.typeBtnTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title / Description *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="e.g. Grocery restock, Client payment"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (₹) *</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                placeholder="e.g. 1250"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                }}
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            {/* Category Selector Chips */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Category *</Text>
              <View style={styles.chipsWrap}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.chip,
                        isSelected && {
                          backgroundColor: cat.color,
                          borderColor: cat.color,
                        },
                      ]}
                      onPress={() => setSelectedCategory(cat.name)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={14}
                        color={isSelected ? '#FFFFFF' : cat.color}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Payment Method Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payment Method</Text>
              <View style={styles.chipsWrap}>
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = paymentMethod === pm;
                  return (
                    <TouchableOpacity
                      key={pm}
                      style={[
                        styles.chip,
                        isSelected && styles.chipPrimaryActive,
                      ]}
                      onPress={() => setPaymentMethod(pm)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextActive,
                        ]}
                      >
                        {pm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Notes / Remarks */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes / Remarks (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add additional remarks"
                placeholderTextColor={colors.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitBtnText}>Save Transaction</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeBtnExpenseActive: {
    backgroundColor: colors.expense,
  },
  typeBtnIncomeActive: {
    backgroundColor: colors.incomeDark,
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.expense,
    backgroundColor: colors.expenseLight,
  },
  errorText: {
    color: colors.expense,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipPrimaryActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default AddTransactionModal;
