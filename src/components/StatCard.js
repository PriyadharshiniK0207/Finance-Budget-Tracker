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
  isFeatured = false,
}) => {
  const getTheme = () => {
    switch (type) {
      case 'income':
        return {
          icon: 'arrow-down',
          iconColor: colors.income,
          bgColor: colors.incomeLight,
          textColor: colors.incomeDark,
          prefix: '+₹',
          accentBorder: colors.incomeBorder,
        };
      case 'expense':
        return {
          icon: 'arrow-up',
          iconColor: colors.expense,
          bgColor: colors.expenseLight,
          textColor: colors.expense,
          prefix: '-₹',
          accentBorder: colors.expenseBorder,
        };
      default:
        return {
          icon: 'shield-checkmark',
          iconColor: colors.accentDark,
          bgColor: colors.accentLight,
          textColor: colors.primary,
          prefix: '₹',
          accentBorder: colors.accentBorder,
        };
    }
  };

  const theme = getTheme();
  const formattedAmount = Number(amount || 0).toLocaleString('en-IN');

  return (
    <View
      style={[
        styles.card,
        isFeatured && styles.cardFeatured,
        style,
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: isFeatured ? 'rgba(217, 182, 111, 0.2)' : theme.bgColor }]}>
          <Ionicons
            name={theme.icon}
            size={16}
            color={isFeatured ? colors.accent : theme.iconColor}
          />
        </View>
        <Text
          style={[styles.title, isFeatured && styles.titleFeatured]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: isFeatured ? '#FFFFFF' : theme.textColor },
        ]}
        numberOfLines={1}
      >
        {theme.prefix}
        {formattedAmount}
      </Text>

      {subtitle ? (
        <View style={styles.subtitleRow}>
          <Text
            style={[styles.subtitle, isFeatured && styles.subtitleFeatured]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardFeatured: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    flex: 1,
  },
  titleFeatured: {
    color: colors.accent,
  },
  amount: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitleRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  subtitleFeatured: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
});

export default StatCard;
