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
    daily: 'Today (28 Oct 2026)',
    weekly: 'Last 7 Days (22 - 28 Oct)',
    monthly: 'Current Month (October 2026)',
  };

  const totalPeriodVolume = report.income + report.expense;
  const incomePercent = totalPeriodVolume > 0 ? Math.round((report.income / totalPeriodVolume) * 100) : 50;
  const expensePercent = totalPeriodVolume > 0 ? Math.round((report.expense / totalPeriodVolume) * 100) : 50;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Header with Drawer Hamburger & Quick Add */}
      <CustomHeader
        title="Finance & Budget"
        subtitle="Dashboard & Analytics"
        navigation={navigation}
        onAddPress={() => setModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextWrap}>
            <Text style={styles.greetingText}>
              Welcome back,{' '}
              <Text style={{ fontWeight: '800' }}>
                {currentUser?.name || 'Priyadharshini K'}
              </Text>
            </Text>
            <Text style={styles.welcomeSubtext}>
              {isAdmin ? 'System Administrator Portal' : 'Smart Personal Budget Tracker'}
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
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.adminBannerTitle}>Administrator Mode</Text>
              <Text style={styles.adminBannerText}>
                You have global auditing view. You can view all financial reports and analytics. Customer profile editing and customer wallet management are restricted.
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
              <Text style={styles.sectionTitle}>Period Reports</Text>
              <Text style={styles.sectionSubtitle}>{periodLabels[reportPeriod]}</Text>
            </View>

            {/* Quick Add Button */}
            <TouchableOpacity
              style={styles.addTxButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addTxButtonText}>Add Tx</Text>
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
                size={14}
                color={reportPeriod === 'daily' ? '#FFFFFF' : colors.textSecondary}
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
                size={14}
                color={reportPeriod === 'weekly' ? '#FFFFFF' : colors.textSecondary}
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
                size={14}
                color={reportPeriod === 'monthly' ? '#FFFFFF' : colors.textSecondary}
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
              title={`${reportPeriod} Net Balance`}
              amount={report.balance}
              type={report.balance >= 0 ? 'income' : 'expense'}
              subtitle={`${report.savingsRate}% savings rate`}
              style={styles.fullWidthStat}
            />

            <View style={styles.statRow}>
              <StatCard
                title={`${reportPeriod} Income`}
                amount={report.income}
                type="income"
                style={styles.halfWidthStat}
              />
              <StatCard
                title={`${reportPeriod} Expense`}
                amount={report.expense}
                type="expense"
                style={styles.halfWidthStat}
              />
            </View>
          </View>

          {/* Visual Indicator: Comparative Income vs Expense Bar */}
          <View style={styles.visualBarCard}>
            <View style={styles.visualBarHeader}>
              <Text style={styles.visualBarTitle}>Cashflow Ratio</Text>
              <Text style={styles.visualBarStats}>
                Income {incomePercent}% • Expense {expensePercent}%
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barIncome, { width: `${incomePercent}%` }]} />
              <View style={[styles.barExpense, { width: `${expensePercent}%` }]} />
            </View>
            <View style={styles.barLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.incomeDark }]} />
                <Text style={styles.legendText}>Income (+₹{report.income.toLocaleString('en-IN')})</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
                <Text style={styles.legendText}>Expense (-₹{report.expense.toLocaleString('en-IN')})</Text>
              </View>
            </View>
          </View>

          {/* Top Spending Category Callout */}
          {report.topCategory.amount > 0 && (
            <View style={styles.topCatCard}>
              <View style={styles.topCatIconBox}>
                <Ionicons name="flame" size={18} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.topCatTitle}>Highest Spending Category</Text>
                <Text style={styles.topCatDesc}>
                  {report.topCategory.name} (₹{report.topCategory.amount.toLocaleString('en-IN')})
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Nav Shortcuts */}
        <View style={styles.quickNavSection}>
          <Text style={styles.sectionTitle}>Feature Navigation</Text>
          <View style={styles.quickNavGrid}>
            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => navigation.navigate('Analysis')}
              activeOpacity={0.8}
            >
              <View style={[styles.quickNavIcon, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="pie-chart" size={20} color={colors.purple} />
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
              <View style={[styles.quickNavIcon, { backgroundColor: colors.incomeLight }]}>
                <Ionicons name="receipt" size={20} color={colors.incomeDark} />
              </View>
              <Text style={styles.quickNavLabel}>Month Tx</Text>
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
              <View style={[styles.quickNavIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="grid" size={20} color="#D97706" />
              </View>
              <Text style={styles.quickNavLabel}>Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => {
                if (isAdmin) {
                  navigation.navigate('Analysis');
                } else {
                  navigation.navigate('Profile');
                }
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.quickNavIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="person" size={20} color={colors.info} />
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
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {report.transactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Transactions Recorded</Text>
              <Text style={styles.emptyDesc}>
                Tap "+ Add Tx" above to record a new income or expense for this period.
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
  },
  welcomeTextWrap: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: colors.text,
  },
  welcomeSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeCustomer: {
    backgroundColor: colors.incomeLight,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.primaryLight,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  roleBadgeTextCustomer: {
    color: colors.incomeDark,
  },
  roleBadgeTextAdmin: {
    color: colors.primary,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    marginBottom: 14,
  },
  adminBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  adminBannerText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  addTxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  addTxButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  periodTabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
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
    paddingVertical: 9,
    borderRadius: 9,
  },
  periodTabActive: {
    backgroundColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  periodTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  visualBarStats: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.cardAlt,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barIncome: {
    height: '100%',
    backgroundColor: colors.incomeDark,
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
    width: 8,
    height: 8,
    borderRadius: 4,
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
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  topCatIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  topCatTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  topCatDesc: {
    fontSize: 13,
    fontWeight: '800',
    color: '#78350F',
    marginTop: 2,
  },
  quickNavSection: {
    marginBottom: 18,
  },
  quickNavGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  quickNavBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickNavIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickNavLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
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
    color: colors.primary,
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
    color: colors.text,
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
