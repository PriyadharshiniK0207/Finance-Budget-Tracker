import React, { useState } from 'react';
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
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';

const AnalysisScreen = ({ navigation }) => {
  const {
    isAdmin,
    categoryStats,
    overallTotals,
    transactions,
    monthsList,
    getMonthData,
  } = useFinance();

  const [selectedMonth, setSelectedMonth] = useState('All Months');

  // Calculate stats based on selected filter
  const monthData = getMonthData(selectedMonth, 'all');

  const totalIncome = selectedMonth === 'All Months' ? overallTotals.totalIncome : monthData.income;
  const totalExpense = selectedMonth === 'All Months' ? overallTotals.totalExpense : monthData.expense;
  const netBalance = selectedMonth === 'All Months' ? overallTotals.balance : monthData.balance;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;
  const displayTransactions = selectedMonth === 'All Months' ? transactions.slice(0, 6) : monthData.transactions;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CustomHeader
        title="Financial Analysis"
        subtitle={isAdmin ? 'Institutional Audit' : 'Capital Allocation & Trends'}
        navigation={navigation}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Role Identity Banner */}
        {isAdmin ? (
          <View style={styles.adminBanner}>
            <View style={styles.adminHeaderRow}>
              <Ionicons name="shield-checkmark" size={18} color={colors.accentDark} />
              <Text style={styles.adminTitle}>Institutional Financial Oversight</Text>
            </View>
            <Text style={styles.adminDesc}>
              System-wide transaction reconciliation and capital liquidity compliance audit.
            </Text>
            <View style={styles.adminMetricsRow}>
              <View style={styles.adminMetric}>
                <Text style={styles.adminMetricVal}>{transactions.length}</Text>
                <Text style={styles.adminMetricLabel}>Total Entries</Text>
              </View>
              <View style={styles.adminMetric}>
                <Text style={styles.adminMetricVal}>₹{(overallTotals.totalIncome + overallTotals.totalExpense).toLocaleString('en-IN')}</Text>
                <Text style={styles.adminMetricLabel}>System Turnover</Text>
              </View>
              <View style={styles.adminMetric}>
                <Text style={styles.adminMetricVal}>99.9%</Text>
                <Text style={styles.adminMetricLabel}>Reconciliation</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Date Filter Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionLabel}>ANALYSIS CYCLE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPills}
          >
            {monthsList.map((m) => {
              const isSelected = selectedMonth === m;
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setSelectedMonth(m)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Key Metrics Cards */}
        <View style={styles.statGrid}>
          <StatCard
            title={`${selectedMonth} Net Position`}
            amount={netBalance}
            type={netBalance >= 0 ? 'income' : 'expense'}
            subtitle={`Capital Retention Efficiency: ${savingsRate}%`}
            isFeatured={true}
            style={styles.fullWidthStat}
          />
          <View style={styles.row}>
            <StatCard
              title="Total Inflow"
              amount={totalIncome}
              type="income"
              style={styles.halfWidthStat}
            />
            <StatCard
              title="Total Outflow"
              amount={totalExpense}
              type="expense"
              style={styles.halfWidthStat}
            />
          </View>
        </View>

        {/* Visual Summary: Category Spending Breakdown */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Category Spending Breakdown</Text>
              <Text style={styles.chartSubtitle}>Department-wise capital deployment</Text>
            </View>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>{categoryStats.length} Categories</Text>
            </View>
          </View>

          {categoryStats.map((cat) => {
            const hasSpend = cat.totalSpent > 0;
            return (
              <View key={cat.id} style={styles.categoryBarRow}>
                <View style={styles.catMetaRow}>
                  <View style={styles.catNameWrap}>
                    <View style={[styles.catIconWrap, { backgroundColor: cat.bgColor }]}>
                      <Ionicons name={cat.icon} size={13} color={cat.color} />
                    </View>
                    <Text style={styles.catName}>{cat.name}</Text>
                  </View>
                  <Text style={styles.catAmount}>
                    ₹{cat.totalSpent.toLocaleString('en-IN')}{' '}
                    <Text style={styles.catPercent}>({cat.percentage}%)</Text>
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.max(hasSpend ? 4 : 0, Math.min(100, cat.percentage))}%`,
                        backgroundColor: cat.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Cashflow Ratio Comparison */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Cashflow Ratio (Inflow vs Outflow)</Text>
          <Text style={styles.chartSubtitle}>Proportion of earnings deployed into expenditure</Text>

          <View style={styles.ratioBarWrap}>
            <View style={[styles.ratioBarIncome, { flex: Math.max(1, totalIncome) }]} />
            <View style={[styles.ratioBarExpense, { flex: Math.max(1, totalExpense) }]} />
          </View>

          <View style={styles.ratioLabelsRow}>
            <View style={styles.ratioLabelItem}>
              <View style={[styles.dot, { backgroundColor: colors.income }]} />
              <Text style={styles.ratioLabelText}>
                Inflow: ₹{totalIncome.toLocaleString('en-IN')} (
                {totalIncome + totalExpense > 0
                  ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100)
                  : 50}
                %)
              </Text>
            </View>

            <View style={styles.ratioLabelItem}>
              <View style={[styles.dot, { backgroundColor: colors.expense }]} />
              <Text style={styles.ratioLabelText}>
                Outflow: ₹{totalExpense.toLocaleString('en-IN')} (
                {totalIncome + totalExpense > 0
                  ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100)
                  : 50}
                %)
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Audit Transactions */}
        <View style={styles.txSection}>
          <Text style={styles.chartTitle}>Recent Journal Entries</Text>
          <Text style={styles.chartSubtitle}>
            Transactions for {selectedMonth} ({displayTransactions.length} items)
          </Text>

          <View style={{ marginTop: 10 }}>
            {displayTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </View>
        </View>
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
    backgroundColor: colors.accentLight,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    marginBottom: 14,
  },
  adminHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  adminTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    marginLeft: 6,
  },
  adminDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 15,
  },
  adminMetricsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  adminMetric: {
    flex: 1,
    alignItems: 'center',
  },
  adminMetricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  adminMetricLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statGrid: {
    marginBottom: 14,
  },
  fullWidthStat: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfWidthStat: {
    flex: 1,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  chartSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  chartBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  categoryBarRow: {
    marginBottom: 12,
  },
  catMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  catNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  catName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  catAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  catPercent: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  ratioBarWrap: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 14,
    marginBottom: 10,
  },
  ratioBarIncome: {
    backgroundColor: colors.income,
  },
  ratioBarExpense: {
    backgroundColor: colors.expense,
  },
  ratioLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratioLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  ratioLabelText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  txSection: {
    marginTop: 6,
  },
});

export default AnalysisScreen;
