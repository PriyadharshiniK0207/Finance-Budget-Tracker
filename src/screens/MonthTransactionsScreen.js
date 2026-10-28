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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CustomHeader
        title="Monthly Ledger"
        subtitle="Month-wise Transaction Records"
        navigation={navigation}
        onAddPress={() => setModalVisible(true)}
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
                This transaction ledger belongs to customer Priya. Admin has read-only auditing privilege.
              </Text>
            </View>
          </View>
        )}

        {/* Month Selector Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Select Month</Text>
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
                    name="calendar"
                    size={14}
                    color={isSelected ? '#FFFFFF' : colors.textSecondary}
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
            style={{ marginBottom: 10 }}
          />

          <View style={styles.row}>
            <StatCard
              title="Month Income"
              amount={monthData.income}
              type="income"
              style={styles.halfWidth}
            />
            <StatCard
              title="Month Expenses"
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
              name="arrow-up-circle"
              size={14}
              color={typeFilter === 'expense' ? '#FFFFFF' : colors.expense}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.typeBtnText, typeFilter === 'expense' && styles.typeBtnTextActive]}>
              Expenses
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, typeFilter === 'income' && styles.typeBtnActiveIncome]}
            onPress={() => setTypeFilter('income')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-down-circle"
              size={14}
              color={typeFilter === 'income' ? '#FFFFFF' : colors.incomeDark}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.typeBtnText, typeFilter === 'income' && styles.typeBtnTextActive]}>
              Income
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
              <Ionicons name="add" size={14} color="#FFFFFF" />
              <Text style={styles.addBtnSmallText}>New Transaction</Text>
            </TouchableOpacity>
          </View>

          {monthData.transactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="folder-open-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Transactions Found</Text>
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
  filterSection: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
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
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
    backgroundColor: colors.surface,
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
    paddingVertical: 9,
    borderRadius: 9,
  },
  typeBtnActive: {
    backgroundColor: colors.primary,
  },
  typeBtnActiveExpense: {
    backgroundColor: colors.expense,
  },
  typeBtnActiveIncome: {
    backgroundColor: colors.incomeDark,
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  addBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnSmallText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
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
    color: colors.text,
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default MonthTransactionsScreen;
