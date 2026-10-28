import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';
import CustomHeader from '../components/CustomHeader';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';

const HomeScreen = ({ navigation }) => {
  const {
    currentUser,
    role,
    isAdmin,
    isCustomer,
    getReportData,
    overallTotals,
    switchRole,
  } = useFinance();

  const [reportPeriod, setReportPeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [modalVisible, setModalVisible] = useState(false);

  // Requirement 12: Dynamically calculate period reports
  const report = getReportData(reportPeriod);

  // Period display titles
  const periodLabels = {
    daily: 'Today • 28 Oct 2026',
    weekly: 'Last 7 Days • 22 - 28 Oct',
    monthly: 'Current Cycle • October 2026',
  };

  const totalPeriodVolume = report.income + report.expense;
  const incomePercent = totalPeriodVolume > 0 ? Math.round((report.income / totalPeriodVolume) * 100) : 50;
  const expensePercent = totalPeriodVolume > 0 ? Math.round((report.expense / totalPeriodVolume) * 100) : 50;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Header with Drawer Hamburger & Quick Add */}
      <CustomHeader
        title="Finance & Budget"
        subtitle="Personal Wealth & Expense Tracker"
        navigation={navigation}
        onAddPress={() => setModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Editorial Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextWrap}>
            <Text style={styles.welcomePre}>FINANCIAL OVERVIEW</Text>
            <Text style={styles.greetingText}>
              Welcome,{' '}
              <Text style={{ fontWeight: '800', color: colors.primary }}>
                {currentUser?.name || 'Priyadharshini K'}
              </Text>
            </Text>
            <Text style={styles.welcomeSubtext}>
              {isAdmin ? 'System Audit & Capital Oversight' : 'Personal Budget & Expense Plan'}
            </Text>
          </View>
          <View style={[styles.roleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeCustomer]}>
            <Text style={[styles.roleBadgeText, isAdmin ? styles.roleBadgeTextAdmin : styles.roleBadgeTextCustomer]}>
              {isAdmin ? 'ADMIN' : 'CUSTOMER'}
            </Text>
          </View>
        </View>

        {/* Admin Overview Notice (if Admin) */}
        {isAdmin && (
          <View style={styles.adminBanner}>
            <Ionicons name="shield-checkmark" size={18} color={colors.accentDark} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.adminBannerTitle}>Institutional Auditing Enabled</Text>
              <Text style={styles.adminBannerText}>
                Cross-account volume and reserve allocations are visible. Real-time ledger reconciliation in progress.
              </Text>
            </View>
          </View>
        )}

        {/* -------------------------------------------------------------
            Requirement 12: Daily, Weekly, and Monthly Reports (5 Marks)
            ------------------------------------------------------------- */}
        <View style={styles.reportSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Period Financial Reports</Text>
              <Text style={styles.sectionSubtitle}>{periodLabels[reportPeriod]}</Text>
            </View>

            {/* Quick Add Button */}
            <TouchableOpacity
              style={styles.addTxButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={15} color="#FFFFFF" />
              <Text style={styles.addTxButtonText}>Post Tx</Text>
            </TouchableOpacity>
          </View>

          {/* Segmented Period Tabs: Daily | Weekly | Monthly */}
          <View style={styles.periodTabsContainer}>
            <TouchableOpacity
              style={[
                styles.periodTab,
                reportPeriod === 'daily' && styles.periodTabActive,
              ]}
              onPress={() => setReportPeriod('daily')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="today-outline"
                size={13}
                color={reportPeriod === 'daily' ? colors.primary : colors.textMuted}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.periodTabText,
                  reportPeriod === 'daily' && styles.periodTabTextActive,
                ]}
              >
                Daily
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodTab,
                reportPeriod === 'weekly' && styles.periodTabActive,
              ]}
              onPress={() => setReportPeriod('weekly')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="calendar-outline"
                size={13}
                color={reportPeriod === 'weekly' ? colors.primary : colors.textMuted}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.periodTabText,
                  reportPeriod === 'weekly' && styles.periodTabTextActive,
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodTab,
                reportPeriod === 'monthly' && styles.periodTabActive,
              ]}
              onPress={() => setReportPeriod('monthly')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="stats-chart-outline"
                size={13}
                color={reportPeriod === 'monthly' ? colors.primary : colors.textMuted}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.periodTabText,
                  reportPeriod === 'monthly' && styles.periodTabTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Period Financial Metrics */}
          <View style={styles.statsGrid}>
            <StatCard
              title={`${reportPeriod} Net Liquidity`}
              amount={report.balance}
              type={report.balance >= 0 ? 'income' : 'expense'}
              subtitle={`Capital Retention Efficiency: ${report.savingsRate}%`}
              isFeatured={true}
              style={styles.fullWidthStat}
            />

            <View style={styles.statRow}>
              <StatCard
                title="Total Inflow"
                amount={report.income}
                type="income"
                style={styles.halfWidthStat}
              />
              <StatCard
                title="Total Outflow"
                amount={report.expense}
                type="expense"
                style={styles.halfWidthStat}
              />
            </View>
          </View>

          {/* Visual Indicator: Comparative Inflow vs Outflow Cashflow Bar */}
          <View style={styles.visualBarCard}>
            <View style={styles.visualBarHeader}>
              <Text style={styles.visualBarTitle}>Cashflow Ratio</Text>
              <Text style={styles.visualBarStats}>
                Inflow {incomePercent}% • Outflow {expensePercent}%
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barIncome, { width: `${incomePercent}%` }]} />
              <View style={[styles.barExpense, { width: `${expensePercent}%` }]} />
            </View>
            <View style={styles.barLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
                <Text style={styles.legendText}>Inflow (+₹{report.income.toLocaleString('en-IN')})</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
                <Text style={styles.legendText}>Outflow (-₹{report.expense.toLocaleString('en-IN')})</Text>
              </View>
            </View>
          </View>

          {/* Top Spending Category Callout */}
          {report.topCategory.amount > 0 && (
            <View style={styles.topCatCard}>
              <View style={styles.topCatIconBox}>
                <Ionicons name="flame" size={17} color={colors.accentDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.topCatTitle}>Highest Allocation Department</Text>
                <Text style={styles.topCatDesc}>
                  {report.topCategory.name} (₹{report.topCategory.amount.toLocaleString('en-IN')})
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Nav Shortcuts */}
        <View style={styles.quickNavSection}>
          <Text style={styles.sectionTitle}>Quick Modules</Text>
          <View style={styles.quickNavGrid}>
            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => navigation.navigate('Analysis')}
              activeOpacity={0.8}
            >
              <View style={[styles.quickNavIcon, { backgroundColor: colors.secondaryLight }]}>
                <Ionicons name="pie-chart" size={18} color={colors.secondary} />
              </View>
              <Text style={styles.quickNavLabel}>Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => {
                if (isAdmin) {
                  navigation.navigate('Analysis');
                } else {
                  navigation.navigate('Transactions');
                }
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.quickNavIcon, { backgroundColor: '#EAF3F8' }]}>
                <Ionicons name="receipt" size={18} color={colors.catTravel} />
              </View>
              <Text style={styles.quickNavLabel}>Ledger</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => {
                if (isAdmin) {
                  navigation.navigate('Analysis');
                } else {
                  navigation.navigate('Categories');
                }
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.quickNavIcon, { backgroundColor: colors.catFoodBg }]}>
                <Ionicons name="grid" size={18} color={colors.catFood} />
              </View>
              <Text style={styles.quickNavLabel}>Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => {
                navigation.navigate('Profile');
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.quickNavIcon, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="person" size={18} color={colors.accentDark} />
              </View>
              <Text style={styles.quickNavLabel}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions for Current Period */}
        <View style={styles.txSection}>
          <View style={styles.txHeaderRow}>
            <Text style={styles.sectionTitle}>
              {reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Transactions ({report.transactions.length})
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (isCustomer) {
                  navigation.navigate('Transactions');
                } else {
                  navigation.navigate('Analysis');
                }
              }}
            >
              <Text style={styles.seeAllText}>View Ledger</Text>
            </TouchableOpacity>
          </View>

          {report.transactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Journal Entries</Text>
              <Text style={styles.emptyDesc}>
                Tap "+ Post Tx" above to record an inflow or outflow entry.
              </Text>
            </View>
          ) : (
            report.transactions.map((item) => (
              <TransactionItem key={item.id} transaction={item} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal for adding transaction (Triggers Requirement 11) */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  welcomeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  welcomeTextWrap: {
    flex: 1,
  },
  welcomePre: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accentDark,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  greetingText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  welcomeSubtext: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBadgeCustomer: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondaryBorder,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accentBorder,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  roleBadgeTextCustomer: {
    color: colors.secondaryDark,
  },
  roleBadgeTextAdmin: {
    color: colors.accentDark,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    marginBottom: 14,
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
    lineHeight: 15,
  },
  reportSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  addTxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.accentDark,
  },
  addTxButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  periodTabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardAlt,
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  periodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  periodTabActive: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  periodTabTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  statsGrid: {
    marginBottom: 12,
  },
  fullWidthStat: {
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfWidthStat: {
    flex: 1,
  },
  visualBarCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  visualBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visualBarTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  visualBarStats: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barIncome: {
    height: '100%',
    backgroundColor: colors.income,
  },
  barExpense: {
    height: '100%',
    backgroundColor: colors.expense,
  },
  barLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  topCatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.catFoodBg,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  topCatIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  topCatTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.catFood,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topCatDesc: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  quickNavSection: {
    marginBottom: 18,
  },
  quickNavGrid: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 10,
  },
  quickNavBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickNavIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickNavLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.1,
  },
  txSection: {
    marginTop: 4,
  },
  txHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondaryDark,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default HomeScreen;
