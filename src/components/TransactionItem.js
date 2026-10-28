import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

const getCategoryMeta = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('food') || cat.includes('dining')) return { name: 'restaurant', color: colors.catFood, bg: colors.catFoodBg };
  if (cat.includes('travel') || cat.includes('transport')) return { name: 'car-sport', color: colors.catTravel, bg: colors.catTravelBg };
  if (cat.includes('shopping') || cat.includes('retail')) return { name: 'bag-handle', color: colors.catShopping, bg: colors.catShoppingBg };
  if (cat.includes('bills') || cat.includes('util')) return { name: 'flash', color: colors.catBills, bg: colors.catBillsBg };
  if (cat.includes('health') || cat.includes('medical')) return { name: 'medkit', color: colors.catHealth, bg: colors.catHealthBg };
  if (cat.includes('entertain')) return { name: 'film', color: colors.catEntertainment, bg: colors.catEntertainmentBg };
  if (cat.includes('edu')) return { name: 'book', color: colors.catEducation, bg: colors.catEducationBg };
  return { name: 'trending-up', color: colors.catInvestment, bg: colors.catInvestmentBg };
};

const TransactionItem = ({ transaction, onPress = null, showDelete = true }) => {
  const { deleteTransaction } = useFinance();
  const isIncome = transaction.type === 'income';
  const meta = getCategoryMeta(transaction.category);
  const formattedAmount = Number(transaction.amount || 0).toLocaleString('en-IN');

  const handleDelete = () => {
    Alert.alert(
      'Remove Transaction Record',
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
      <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.name} size={18} color={meta.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.categoryBadge, { color: meta.color }]}>
            {transaction.category}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>{transaction.date}</Text>
          {transaction.paymentMethod ? (
            <>
              <Text style={styles.dot}>•</Text>
              <View style={styles.paymentPill}>
                <Text style={styles.paymentText}>{transaction.paymentMethod}</Text>
              </View>
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
            <Ionicons name="trash-outline" size={13} color={colors.textMuted} />
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
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
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
    color: colors.primary,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  dot: {
    fontSize: 10,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  paymentPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  paymentText: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.2,
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
    color: colors.income,
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
