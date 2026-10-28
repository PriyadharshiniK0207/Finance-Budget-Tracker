import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';
import CustomHeader from '../components/CustomHeader';

const ProfileScreen = ({ navigation }) => {
  const { currentUser, isAdmin, isCustomer, switchRole, overallTotals } = useFinance();

  const handleEditPress = () => {
    navigation.navigate('EditProfile');
  };

  const initials = (currentUser?.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const budget = currentUser?.monthlyBudget || 50000;
  const spentThisMonth = overallTotals.totalExpense;
  const remainingBudget = Math.max(0, budget - spentThisMonth);
  const budgetUsedPercent = Math.min(100, Math.round((spentThisMonth / budget) * 100));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CustomHeader
        title="Profile & Budget"
        subtitle={isAdmin ? 'Administrator Overview' : 'Personal Profile & Budget'}
        navigation={navigation}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.userName}>{currentUser?.name || 'Priyadharshini K'}</Text>
          <Text style={styles.userEmail}>{currentUser?.email || 'priya@example.com'}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.accountBadge}>
              <Ionicons name="card-outline" size={12} color={colors.primary} />
              <Text style={styles.accountBadgeText}>
                {currentUser?.accountNumber || 'ACC-2026-8941'}
              </Text>
            </View>

            <View style={styles.roleBadge}>
              <Ionicons name="checkmark-circle" size={12} color={isAdmin ? colors.accentDark : colors.secondary} />
              <Text style={styles.roleBadgeText}>
                {isAdmin ? 'Administrator' : 'Verified Customer'}
              </Text>
            </View>
          </View>

          {/* Edit Profile CTA Button (Customer Only) */}
          {!isAdmin ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={16} color={colors.accent} style={{ marginRight: 6 }} />
              <Text style={styles.editButtonText}>Edit Profile Information</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.restrictedNoticeBox}>
              <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={styles.restrictedNoticeText}>Profile editing disabled for Administrator</Text>
            </View>
          )}
        </View>

        {/* Monthly Budget Performance Card (Customer only) */}
        {!isAdmin && (
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <View>
                <Text style={styles.budgetTitle}>Monthly Budget Allocation</Text>
                <Text style={styles.budgetSubtitle}>Personal treasury threshold</Text>
              </View>
              <Text style={styles.budgetAmount}>₹{budget.toLocaleString('en-IN')}</Text>
            </View>

            {/* Visual Budget Progress Bar */}
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${budgetUsedPercent}%`,
                    backgroundColor: budgetUsedPercent > 90 ? colors.expense : colors.secondary,
                  },
                ]}
              />
            </View>

            <View style={styles.budgetDetailsRow}>
              <View>
                <Text style={styles.budgetLabel}>Disbursed</Text>
                <Text style={[styles.budgetValue, { color: colors.expense }]}>
                  ₹{spentThisMonth.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.budgetLabel}>Utilization</Text>
                <Text style={[styles.budgetValue, { color: colors.primary }]}>
                  {budgetUsedPercent}%
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.budgetLabel}>Available Reserve</Text>
                <Text style={[styles.budgetValue, { color: colors.income }]}>
                  ₹{remainingBudget.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Profile Details List */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeader}>Personal & Account Credentials</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="person-outline" size={17} color={colors.textMuted} />
              <Text style={styles.detailLabel}>Full Legal Name</Text>
            </View>
            <Text style={styles.detailValue}>{currentUser?.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="mail-outline" size={17} color={colors.textMuted} />
              <Text style={styles.detailLabel}>Email Address</Text>
            </View>
            <Text style={styles.detailValue}>{currentUser?.email}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="call-outline" size={17} color={colors.textMuted} />
              <Text style={styles.detailLabel}>Registered Phone</Text>
            </View>
            <Text style={styles.detailValue}>+91 {currentUser?.phone}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar-outline" size={17} color={colors.textMuted} />
              <Text style={styles.detailLabel}>Charter Since</Text>
            </View>
            <Text style={styles.detailValue}>{currentUser?.joinedDate || 'October 2026'}</Text>
          </View>

          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <View style={styles.detailLeft}>
              <Ionicons name="cash-outline" size={17} color={colors.textMuted} />
              <Text style={styles.detailLabel}>Accounting Currency</Text>
            </View>
            <Text style={styles.detailValue}>INR (₹ Indian Rupee)</Text>
          </View>
        </View>

        {/* Additional Options */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeader}>Security & Notification Controls</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => Alert.alert('Notifications', 'Personalized transaction change alerts are ACTIVE.')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="notifications-outline" size={17} color={colors.primary} />
              <Text style={styles.actionText}>Personalized Alerts</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Active</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, { borderBottomWidth: 0 }]}
            onPress={() => Alert.alert('Data Privacy', 'All financial data is stored securely in local state.')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="lock-closed-outline" size={17} color={colors.primary} />
              <Text style={styles.actionText}>Encrypted Local Storage</Text>
            </View>
            <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
          </TouchableOpacity>
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondaryDark,
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accentDark,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  restrictedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restrictedNoticeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  budgetCard: {
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
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  budgetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  budgetSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
    fontWeight: '500',
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  barTrack: {
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.background,
    overflow: 'hidden',
    marginBottom: 12,
  },
  barFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  budgetDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  budgetValue: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 10,
  },
  statusPill: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.secondaryBorder,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondaryDark,
  },
});

export default ProfileScreen;
