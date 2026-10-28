import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';
import CustomHeader from '../components/CustomHeader';

const CategoriesScreen = ({ navigation }) => {
  const { categoryStats, overallTotals, isAdmin } = useFinance();

  const totalExpense = overallTotals.totalExpense;
  const totalCategoryBudget = categoryStats.reduce((sum, c) => sum + c.budget, 0);
  const overallUsedPercent = totalCategoryBudget > 0 ? Math.round((totalExpense / totalCategoryBudget) * 100) : 0;

  const handleSelectCategory = (category) => {
    navigation.navigate('CategoryDetails', {
      categoryId: category.id,
      categoryName: category.name,
      categoryColor: category.color,
      categoryIcon: category.icon,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CustomHeader
        title="Spending Categories"
        subtitle="Department Budgets & Allocation"
        navigation={navigation}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Admin Restriction Notice */}
        {isAdmin && (
          <View style={styles.adminBanner}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.adminBannerTitle}>Customer-Only Screen (Admin Preview)</Text>
              <Text style={styles.adminBannerText}>
                Categories and department limits configured by customer. Admin auditing access enabled.
              </Text>
            </View>
          </View>
        )}

        {/* Overall Category Budget Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>Total Category Expenditure</Text>
              <Text style={styles.summaryValue}>₹{totalExpense.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.budgetPill}>
              <Text style={styles.budgetPillText}>{overallUsedPercent}% of Total Budget</Text>
            </View>
          </View>

          {/* Overall Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(100, overallUsedPercent)}%`,
                  backgroundColor: overallUsedPercent > 90 ? colors.expense : colors.primary,
                },
              ]}
            />
          </View>

          <View style={styles.summaryFooterRow}>
            <Text style={styles.footerSubtext}>
              Combined Budget Limit: ₹{totalCategoryBudget.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.footerCount}>
              {categoryStats.length} Active Categories
            </Text>
          </View>
        </View>

        {/* Categories List Title */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>Select Category for Details</Text>
          <Text style={styles.listSubtitle}>Tap any category to view full transaction logs</Text>
        </View>

        {/* Category Cards */}
        {categoryStats.map((cat) => {
          const budgetPercent = cat.budget > 0 ? Math.round((cat.totalSpent / cat.budget) * 100) : 0;
          const isWarning = budgetPercent >= 80;
          const isDanger = budgetPercent >= 100;

          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => handleSelectCategory(cat)}
              activeOpacity={0.7}
            >
              {/* Top Row: Icon + Name + Chevron */}
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: cat.bgColor }]}>
                  <Ionicons name={cat.icon} size={22} color={cat.color} />
                </View>

                <View style={styles.headerInfo}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryDesc} numberOfLines={1}>
                    {cat.description}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </View>

              {/* Middle Row: Spending vs Budget */}
              <View style={styles.spendingRow}>
                <View>
                  <Text style={styles.metricLabel}>Spent</Text>
                  <Text style={[styles.metricValue, { color: cat.color }]}>
                    ₹{cat.totalSpent.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.metricLabel}>Budget Limit</Text>
                  <Text style={styles.metricValue}>
                    ₹{cat.budget.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.metricLabel}>Transactions</Text>
                  <Text style={styles.metricValue}>{cat.txCount} items</Text>
                </View>
              </View>

              {/* Progress Indicator */}
              <View style={styles.cardProgressTrack}>
                <View
                  style={[
                    styles.cardProgressBar,
                    {
                      width: `${Math.min(100, Math.max(3, budgetPercent))}%`,
                      backgroundColor: isDanger ? colors.expense : cat.color,
                    },
                  ]}
                />
              </View>

              {/* Bottom Row: Status Badge */}
              <View style={styles.cardFooter}>
                <Text style={styles.budgetStatusText}>
                  {budgetPercent}% used • ₹{cat.remainingBudget.toLocaleString('en-IN')} remaining
                </Text>
                {isDanger ? (
                  <View style={[styles.alertPill, { backgroundColor: colors.expenseLight }]}>
                    <Text style={[styles.alertPillText, { color: colors.expense }]}>Over Budget</Text>
                  </View>
                ) : isWarning ? (
                  <View style={[styles.alertPill, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.alertPillText, { color: '#B45309' }]}>Near Limit</Text>
                  </View>
                ) : (
                  <View style={[styles.alertPill, { backgroundColor: colors.incomeLight }]}>
                    <Text style={[styles.alertPillText, { color: colors.incomeDark }]}>On Track</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    marginBottom: 12,
  },
  adminBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  adminBannerText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  budgetPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  budgetPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardAlt,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  summaryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerSubtext: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  footerCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  listHeaderRow: {
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  listSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  categoryDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: colors.cardAlt,
    padding: 10,
    borderRadius: 10,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  cardProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cardAlt,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetStatusText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  alertPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  alertPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default CategoriesScreen;
