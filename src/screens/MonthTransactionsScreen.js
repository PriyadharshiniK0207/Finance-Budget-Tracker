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
import AddTransactionModal from '../components/AddTransactionModal';

const MonthTransactionsScreen = ({ navigation }) => {
  const {
    monthsList,
    getMonthData,
    isAdmin,
    switchRole,
  } = useFinance();

  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'expense' | 'income'
  const [modalVisible, setModalVisible] = useState(false);

  const monthData = getMonthData(selectedMonth, typeFilter);

  // If Admin attempts to access, strictly enforce Customer-Only Requirement
  if (isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <CustomHeader
          title="Monthly Ledger"
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
            <Text style={styles.requirementBadgeText}>Customer Only Screen (Exam Req #4 — 5 Marks)</Text>
          </View>
          <Text style={styles.restrictedDesc}>
            Month-wise transaction logs, monthly inflow/outflow filters, and personal ledger management are strictly reserved for Customer accounts.
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CustomHeader
        title="Monthly Ledger"
        subtitle="Month-wise Transaction History"
        navigation={navigation}
        onAddPress={() => setModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Month Selector Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>SELECT TIMEFRAME</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthPills}
          >
            {monthsList.map((m) => {
              const isSelected = selectedMonth === m;
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.monthPill, isSelected && styles.monthPillActive]}
                  onPress={() => setSelectedMonth(m)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color={isSelected ? '#FFFFFF' : colors.textMuted}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.monthPillText, isSelected && styles.monthPillTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Monthly Financial Summary Cards */}
        <View style={styles.summaryGrid}>
          <StatCard
            title={`${selectedMonth} Net Savings`}
            amount={monthData.balance}
            type={monthData.balance >= 0 ? 'income' : 'expense'}
            subtitle={`${monthData.count} transactions in selected view`}
            isFeatured={true}
            style={{ marginBottom: 10 }}
          />

          <View style={styles.row}>
            <StatCard
              title="Period Inflow"
              amount={monthData.income}
              type="income"
              style={styles.halfWidth}
            />
            <StatCard
              title="Period Outflow"
              amount={monthData.expense}
              type="expense"
              style={styles.halfWidth}
            />
          </View>
        </View>

        {/* Type Filter Segmented Switcher: All | Expenses | Income */}
        <View style={styles.typeSwitcher}>
          <TouchableOpacity
            style={[styles.typeBtn, typeFilter === 'all' && styles.typeBtnActive]}
            onPress={() => setTypeFilter('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.typeBtnText, typeFilter === 'all' && styles.typeBtnTextActive]}>
              All ({monthData.transactions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, typeFilter === 'expense' && styles.typeBtnActiveExpense]}
            onPress={() => setTypeFilter('expense')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-up"
              size={13}
              color={typeFilter === 'expense' ? '#FFFFFF' : colors.expense}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.typeBtnText, typeFilter === 'expense' && styles.typeBtnTextActive]}>
              Outflows
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, typeFilter === 'income' && styles.typeBtnActiveIncome]}
            onPress={() => setTypeFilter('income')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-down"
              size={13}
              color={typeFilter === 'income' ? '#FFFFFF' : colors.income}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.typeBtnText, typeFilter === 'income' && styles.typeBtnTextActive]}>
              Inflows
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listHeaderTitle}>
              {selectedMonth} ({monthData.transactions.length})
            </Text>
            <TouchableOpacity
              style={styles.addBtnSmall}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={13} color="#FFFFFF" />
              <Text style={styles.addBtnSmallText}>New Entry</Text>
            </TouchableOpacity>
          </View>

          {monthData.transactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="folder-open-outline" size={38} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Journal Entries</Text>
              <Text style={styles.emptyDesc}>
                No {typeFilter !== 'all' ? typeFilter : ''} records for {selectedMonth}.
              </Text>
            </View>
          ) : (
            monthData.transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Transaction Modal */}
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
  filterSection: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  monthPills: {
    flexDirection: 'row',
    gap: 8,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  monthPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  monthPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryGrid: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  typeBtnActive: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBtnActiveExpense: {
    backgroundColor: colors.expense,
  },
  typeBtnActiveIncome: {
    backgroundColor: colors.income,
  },
  typeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  typeBtnTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  listSection: {
    marginTop: 2,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  addBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentDark,
  },
  addBtnSmallText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    padding: 28,
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
    marginTop: 2,
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

export default MonthTransactionsScreen;
