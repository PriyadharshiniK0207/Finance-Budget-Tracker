import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return { name: 'restaurant', color: '#F59E0B', bg: '#FEF3C7' };
  if (cat.includes('travel') || cat.includes('transport')) return { name: 'car-sport', color: '#3B82F6', bg: '#DBEAFE' };
  if (cat.includes('shopping') || cat.includes('retail')) return { name: 'bag-handle', color: '#EC4899', bg: '#FCE7F3' };
  if (cat.includes('bills') || cat.includes('util')) return { name: 'flash', color: '#8B5CF6', bg: '#EDE9FE' };
  if (cat.includes('health') || cat.includes('medical')) return { name: 'medkit', color: '#EF4444', bg: '#FEE2E2' };
  if (cat.includes('entertain')) return { name: 'film', color: '#10B981', bg: '#D1FAE5' };
  if (cat.includes('edu')) return { name: 'book', color: '#6366F1', bg: '#EEF2FF' };
  return { name: 'trending-up', color: '#0D9488', bg: '#CCFBF1' };
};

const TransactionItem = ({ transaction, onPress = null, showDelete = true }) => {
  const { deleteTransaction } = useFinance();
  const isIncome = transaction.type === 'income';
  const iconMeta = getCategoryIcon(transaction.category);
  const formattedAmount = Number(transaction.amount || 0).toLocaleString('en-IN');

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.title}" (₹${formattedAmount})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconBox, { backgroundColor: iconMeta.bg }]}>
        <Ionicons name={iconMeta.name} size={20} color={iconMeta.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.categoryBadge}>{transaction.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>{transaction.date}</Text>
          {transaction.paymentMethod ? (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.paymentMethod}>{transaction.paymentMethod}</Text>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amountText,
            isIncome ? styles.incomeText : styles.expenseText,
          ]}
        >
          {isIncome ? `+₹${formattedAmount}` : `-₹${formattedAmount}`}
        </Text>

        {showDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dot: {
    fontSize: 10,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
  },
  paymentMethod: {
    fontSize: 10,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  incomeText: {
    color: colors.incomeDark,
  },
  expenseText: {
    color: colors.expense,
  },
  deleteBtn: {
    marginTop: 4,
    padding: 2,
  },
});

export default TransactionItem;
