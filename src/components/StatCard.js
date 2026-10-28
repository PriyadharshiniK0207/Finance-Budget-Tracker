import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const StatCard = ({
  title,
  amount,
  type = 'balance', // 'balance' | 'income' | 'expense'
  subtitle = null,
  style = {},
}) => {
  const getTheme = () => {
    switch (type) {
      case 'income':
        return {
          icon: 'arrow-down-circle',
          iconColor: colors.income,
          bgColor: colors.incomeLight,
          textColor: colors.incomeDark,
          prefix: '+₹',
        };
      case 'expense':
        return {
          icon: 'arrow-up-circle',
          iconColor: colors.expense,
          bgColor: colors.expenseLight,
          textColor: colors.expenseDark,
          prefix: '-₹',
        };
      default:
        return {
          icon: 'wallet',
          iconColor: colors.primary,
          bgColor: colors.primaryLight,
          textColor: colors.primaryDark,
          prefix: '₹',
        };
    }
  };

  const theme = getTheme();
  const formattedAmount = Number(amount || 0).toLocaleString('en-IN');

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: theme.bgColor }]}>
          <Ionicons name={theme.icon} size={20} color={theme.iconColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={[styles.amount, { color: theme.textColor }]} numberOfLines={1}>
        {theme.prefix}
        {formattedAmount}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default StatCard;
