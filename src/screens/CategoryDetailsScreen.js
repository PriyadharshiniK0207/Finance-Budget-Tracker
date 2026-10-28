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
    color: colors.primary,
    bgColor: colors.primaryLight,
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
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentCat.name}
          </Text>
          <Text style={styles.headerSubtitle}>Category Detailed Breakdown</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Hero Banner */}
        <View style={styles.heroCard}>
          <View style={[styles.heroIconBox, { backgroundColor: currentCat.bgColor }]}>
            <Ionicons name={currentCat.icon} size={32} color={currentCat.color} />
          </View>

          <Text style={styles.heroCategoryName}>{currentCat.name}</Text>
          <Text style={styles.heroSubtitle}>Total Spent This Period</Text>
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
              <Text style={styles.statLabel}>Allocated Budget</Text>
              <Text style={styles.statVal}>₹{budget.toLocaleString('en-IN')}</Text>
            </View>
            <View style={[styles.statCol, { alignItems: 'center' }]}>
              <Text style={styles.statLabel}>Budget Used</Text>
              <Text style={styles.statVal}>{spentPercent}%</Text>
            </View>
            <View style={[styles.statCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={[styles.statVal, { color: colors.incomeDark }]}>
                ₹{remaining.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Transactions in this Category */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>
              Category Transactions ({catTransactions.length})
            </Text>
            <TouchableOpacity
              style={styles.addTxButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={14} color="#FFFFFF" />
              <Text style={styles.addTxButtonText}>Add in {currentCat.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          </View>

          {catTransactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Transactions In This Category</Text>
              <Text style={styles.emptyDesc}>
                Tap the "+ Add" button above to record your first expense in {currentCat.name}.
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
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
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
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroCategoryName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  heroSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  heroSpentAmount: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginVertical: 6,
  },
  trackWrap: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardAlt,
    overflow: 'hidden',
    marginVertical: 12,
  },
  fillBar: {
    height: '100%',
    borderRadius: 4,
  },
  heroStatsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.cardAlt,
    padding: 12,
    borderRadius: 12,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
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
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  addTxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addTxButtonText: {
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
    textAlign: 'center',
    marginTop: 4,
  },
});

export default CategoryDetailsScreen;
