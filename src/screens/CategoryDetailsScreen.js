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
import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';

const CategoryDetailsScreen = ({ route, navigation }) => {
  const { categoryId = 'food', categoryName = 'Food & Dining' } = route.params || {};
  const { categoryStats, transactions } = useFinance();

  const [modalVisible, setModalVisible] = useState(false);

  // Find dynamic category data from context
  const currentCat = categoryStats.find((c) => c.id === categoryId) || {
    id: categoryId,
    name: categoryName,
    icon: 'restaurant',
    color: colors.catFood,
    bgColor: colors.catFoodBg,
    budget: 15000,
    totalSpent: 0,
    remainingBudget: 15000,
  };

  // Find all transactions dynamically belonging to this category
  const catTransactions = transactions.filter(
    (t) =>
      t.categoryId === categoryId ||
      (t.category && t.category.toLowerCase().includes(categoryId.toLowerCase())) ||
      (t.category && t.category === currentCat.name)
  );

  const totalSpent = catTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const budget = currentCat.budget || 15000;
  const remaining = Math.max(0, budget - totalSpent);
  const spentPercent = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentCat.name}
          </Text>
          <Text style={styles.headerSubtitle}>Department Breakdown & History</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Hero Banner */}
        <View style={styles.heroCard}>
          <View style={[styles.heroIconBox, { backgroundColor: currentCat.bgColor }]}>
            <Ionicons name={currentCat.icon} size={28} color={currentCat.color} />
          </View>

          <Text style={styles.heroCategoryName}>{currentCat.name}</Text>
          <Text style={styles.heroSubtitle}>Total Disbursed This Cycle</Text>
          <Text style={[styles.heroSpentAmount, { color: currentCat.color }]}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </Text>

          {/* Budget Track */}
          <View style={styles.trackWrap}>
            <View
              style={[
                styles.fillBar,
                {
                  width: `${Math.min(100, Math.max(4, spentPercent))}%`,
                  backgroundColor: spentPercent > 90 ? colors.expense : currentCat.color,
                },
              ]}
            />
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Allocated Ceiling</Text>
              <Text style={styles.statVal}>₹{budget.toLocaleString('en-IN')}</Text>
            </View>
            <View style={[styles.statCol, { alignItems: 'center' }]}>
              <Text style={styles.statLabel}>Ceiling Consumed</Text>
              <Text style={styles.statVal}>{spentPercent}%</Text>
            </View>
            <View style={[styles.statCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.statLabel}>Available Reserve</Text>
              <Text style={[styles.statVal, { color: colors.income }]}>
                ₹{remaining.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Transactions in this Category */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>
              Journal Records ({catTransactions.length})
            </Text>
            <TouchableOpacity
              style={styles.addTxButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={13} color="#FFFFFF" />
              <Text style={styles.addTxButtonText}>Post in {currentCat.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          </View>

          {catTransactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={36} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Entries Recorded</Text>
              <Text style={styles.emptyDesc}>
                Tap "+ Post" above to record your first entry in {currentCat.name}.
              </Text>
            </View>
          ) : (
            catTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Transaction Modal targeting this category */}
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
  header: {
    height: Platform.OS === 'ios' ? 56 : 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  heroIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroCategoryName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroSpentAmount: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginVertical: 6,
  },
  trackWrap: {
    width: '100%',
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.background,
    overflow: 'hidden',
    marginVertical: 12,
  },
  fillBar: {
    height: '100%',
    borderRadius: 3.5,
  },
  heroStatsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  listSection: {
    marginTop: 4,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  addTxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentDark,
  },
  addTxButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
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

export default CategoryDetailsScreen;
