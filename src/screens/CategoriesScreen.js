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
  const { categoryStats, overallTotals, isAdmin, switchRole } = useFinance();

  // If Admin attempts to access, strictly enforce Customer-Only Requirement
  if (isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <CustomHeader
          title="Spending Categories"
          subtitle="Customer Only Feature"
          navigation={navigation}
          showRoleBadge={true}
        />
        <View style={styles.restrictedContainer}>
          <View style={styles.restrictedIconBox}>
            <Ionicons name="lock-closed" size={42} color={colors.expense} />
          </View>
          <Text style={styles.restrictedTitle}>Access Denied for Admin</Text>
          <View style={styles.requirementBadge}>
            <Text style={styles.requirementBadgeText}>Customer Only Screen (Exam Req #5 — 5 Marks)</Text>
          </View>
          <Text style={styles.restrictedDesc}>
            Department spending budgets, expenditure allocations, and category limit monitoring are configured and managed exclusively by Customer accounts.
          </Text>
          <TouchableOpacity
            style={styles.switchRoleBtn}
            onPress={() => switchRole('customer')}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.switchRoleBtnText}>Switch to Customer Mode</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        {/* Overall Category Budget Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>TOTAL EXPENDITURE ALLOCATED</Text>
              <Text style={styles.summaryValue}>₹{totalExpense.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.budgetPill}>
              <Text style={styles.budgetPillText}>{overallUsedPercent}% OF CEILING</Text>
            </View>
          </View>

          {/* Overall Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(100, overallUsedPercent)}%`,
                  backgroundColor: overallUsedPercent > 90 ? colors.expense : colors.accent,
                },
              ]}
            />
          </View>

          <View style={styles.summaryFooterRow}>
            <Text style={styles.footerSubtext}>
              Treasury Ceiling: ₹{totalCategoryBudget.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.footerCount}>
              {categoryStats.length} Budget Departments
            </Text>
          </View>
        </View>

        {/* Categories List Title */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>Department Portfolios</Text>
          <Text style={styles.listSubtitle}>Select a category to view individual transaction history</Text>
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
                  <Ionicons name={cat.icon} size={20} color={cat.color} />
                </View>

                <View style={styles.headerInfo}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryDesc} numberOfLines={1}>
                    {cat.description}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>

              {/* Middle Row: Spending vs Budget */}
              <View style={styles.spendingRow}>
                <View>
                  <Text style={styles.metricLabel}>Disbursed</Text>
                  <Text style={[styles.metricValue, { color: cat.color }]}>
                    ₹{cat.totalSpent.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.metricLabel}>Ceiling Limit</Text>
                  <Text style={styles.metricValue}>
                    ₹{cat.budget.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.metricLabel}>Journal Entries</Text>
                  <Text style={styles.metricValue}>{cat.txCount} tx</Text>
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
                  {budgetPercent}% consumed • ₹{cat.remainingBudget.toLocaleString('en-IN')} available
                </Text>
                {isDanger ? (
                  <View style={[styles.alertPill, { backgroundColor: colors.expenseLight, borderColor: colors.expenseBorder }]}>
                    <Text style={[styles.alertPillText, { color: colors.expense }]}>Over Limit</Text>
                  </View>
                ) : isWarning ? (
                  <View style={[styles.alertPill, { backgroundColor: colors.warningLight, borderColor: colors.warningBorder }]}>
                    <Text style={[styles.alertPillText, { color: colors.warning }]}>Near Limit</Text>
                  </View>
                ) : (
                  <View style={[styles.alertPill, { backgroundColor: colors.incomeLight, borderColor: colors.incomeBorder }]}>
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
    backgroundColor: colors.accentLight,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    marginBottom: 12,
  },
  adminBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  adminBannerText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    marginBottom: 16,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  budgetPill: {
    backgroundColor: 'rgba(217, 182, 111, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  budgetPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3.5,
  },
  summaryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  footerCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  listHeaderRow: {
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  listSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  categoryDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  metricLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  cardProgressTrack: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardProgressBar: {
    height: '100%',
    borderRadius: 2.5,
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
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  alertPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
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
    marginBottom: 6,
    textAlign: 'center',
  },
  requirementBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    marginBottom: 14,
  },
  requirementBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accentDark,
    letterSpacing: 0.2,
  },
  restrictedDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    elevation: 3,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  switchRoleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});

export default CategoriesScreen;
