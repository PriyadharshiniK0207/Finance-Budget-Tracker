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
        title="My Profile"
        subtitle="Account & Budget Settings"
        navigation={navigation}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Admin Identity Card */}
        {isAdmin && (
          <View style={styles.adminBannerCard}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.adminBannerTitle}>Administrator Account</Text>
              <Text style={styles.adminBannerDesc}>
                Full management privileges. You can edit your administrator name, contact, and system parameters below.
              </Text>
            </View>
          </View>
        )}

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
              <Ionicons name="checkmark-circle" size={12} color={colors.incomeDark} />
              <Text style={styles.roleBadgeText}>
                {isAdmin ? 'Administrator' : 'Verified Customer'}
              </Text>
            </View>
          </View>

          {/* Edit Profile CTA Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditPress}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.editButtonText}>
              {isAdmin ? 'Edit Admin Profile' : 'Edit Profile Information'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Budget Performance Card (Customer only) */}
        {!isAdmin && (
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <View>
                <Text style={styles.budgetTitle}>Monthly Budget Limit</Text>
                <Text style={styles.budgetSubtitle}>Personal spending threshold</Text>
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
                    backgroundColor: budgetUsedPercent > 90 ? colors.expense : colors.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.budgetDetailsRow}>
              <View>
                <Text style={styles.budgetLabel}>Spent</Text>
                <Text style={[styles.budgetValue, { color: colors.expense }]}>
                  ₹{spentThisMonth.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.budgetLabel}>Utilization</Text>
                <Text style={[styles.budgetValue, { color: colors.text }]}>
                  {budgetUsedPercent}%
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.budgetLabel}>Remaining</Text>
                <Text style={[styles.budgetValue, { color: colors.incomeDark }]}>
                  ₹{remainingBudget.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Profile Details List */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeader}>Personal & Account Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Full Name</Text>
            </View>
            <Text style={styles.detailValue}>{currentUser?.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Email Address</Text>
            </View>
            <Text style={styles.detailValue}>{currentUser?.email}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Mobile Number</Text>
            </View>
            <Text style={styles.detailValue}>+91 {currentUser?.phone}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Member Since</Text>
            </View>
            <Text style={styles.detailValue}>{currentUser?.joinedDate || 'October 2026'}</Text>
          </View>

          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <View style={styles.detailLeft}>
              <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.detailLabel}>Currency Format</Text>
            </View>
            <Text style={styles.detailValue}>INR (₹ Indian Rupee)</Text>
          </View>
        </View>

        {/* Additional Options */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeader}>Security & Preferences</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => Alert.alert('Notifications', 'Personalized transaction change alerts are ACTIVE.')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="notifications-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>Personalized Alert Notifications</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Enabled</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, { borderBottomWidth: 0 }]}
            onPress={() => Alert.alert('Data Privacy', 'All financial data is stored securely in local state.')}
            activeOpacity={0.7}
          >
            <View style={styles.actionLeft}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>Data Privacy & Local Storage</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
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
  adminBannerCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    marginBottom: 14,
    alignItems: 'center',
  },
  adminBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  adminBannerDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  restrictedCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  restrictedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  restrictedDesc: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
    lineHeight: 16,
  },
  switchBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
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
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  accountBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.incomeLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.incomeDark,
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  budgetCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  budgetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  budgetSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardAlt,
    overflow: 'hidden',
    marginBottom: 12,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  budgetValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 10,
  },
  statusPill: {
    backgroundColor: colors.incomeLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.incomeDark,
  },
});

export default ProfileScreen;
