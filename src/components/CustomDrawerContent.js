import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

const CustomDrawerContent = (props) => {
  const { navigation } = props;
  const { currentUser, role, switchRole, isAdmin, isCustomer, logout } = useFinance();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out Confirmation',
      'Are you sure you want to sign out from Finance & Budget Tracker?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.closeDrawer();
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          },
        },
      ]
    );
  };

  const handleRoleToggle = () => {
    const nextRole = role === 'admin' ? 'customer' : 'admin';
    switchRole(nextRole);
  };

  const navigateTo = (screenName, params = {}) => {
    navigation.closeDrawer();
    navigation.navigate(screenName, params);
  };

  const initials = (currentUser?.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Drawer User Header Section */}
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, isAdmin && styles.avatarAdmin]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {currentUser?.name || 'Priyadharshini K'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {currentUser?.email || 'priya@example.com'}
            </Text>
            <View
              style={[
                styles.rolePill,
                isAdmin ? styles.rolePillAdmin : styles.rolePillCustomer,
              ]}
            >
              <Ionicons
                name={isAdmin ? 'shield-checkmark' : 'person'}
                size={11}
                color={isAdmin ? colors.primaryDark : colors.incomeDark}
              />
              <Text
                style={[
                  styles.rolePillText,
                  isAdmin ? styles.rolePillTextAdmin : styles.rolePillTextCustomer,
                ]}
              >
                {isAdmin ? 'Administrator' : 'Customer Account'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Drawer Nav Items List */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuScroll}
      >
        <Text style={styles.sectionHeader}>MAIN NAVIGATION</Text>

        {/* Dashboard */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('MainTabs', { screen: 'Home' })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="grid-outline" size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>Dashboard & Reports</Text>
        </TouchableOpacity>

        {/* Analysis (Admin and Customer) */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('MainTabs', { screen: 'Analysis' })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#EDE9FE' }]}>
            <Ionicons name="pie-chart-outline" size={20} color={colors.purple} />
          </View>
          <Text style={styles.menuItemText}>Financial Analysis</Text>
        </TouchableOpacity>

        {/* Customer-Only Screens */}
        {isCustomer && (
          <>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('MainTabs', { screen: 'Transactions' })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.incomeLight }]}>
                <Ionicons name="receipt-outline" size={20} color={colors.incomeDark} />
              </View>
              <Text style={styles.menuItemText}>Month-wise Transactions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('MainTabs', { screen: 'Categories' })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="folder-open-outline" size={20} color="#D97706" />
              </View>
              <Text style={styles.menuItemText}>Spending Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('MainTabs', { screen: 'Profile' })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="person-outline" size={20} color={colors.info} />
              </View>
              <Text style={styles.menuItemText}>Profile & Budget</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Admin-Only Screens */}
        {isAdmin && (
          <View style={styles.adminSection}>
            <Text style={styles.sectionHeader}>ADMINISTRATIVE CONTROLS</Text>
            <View style={styles.adminInfoCard}>
              <Ionicons name="shield-outline" size={20} color={colors.primary} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.adminInfoTitle}>Admin Mode Active</Text>
                <Text style={styles.adminInfoDesc}>
                  Customer-only screens (Transactions, Categories, Profile editing) are securely restricted.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Role Switcher Action */}
        <View style={styles.roleSwitchCard}>
          <Text style={styles.roleSwitchTitle}>Role Switcher (Viva Demo)</Text>
          <Text style={styles.roleSwitchSubtitle}>
            Current Role: <Text style={{ fontWeight: '700' }}>{isAdmin ? 'Admin' : 'Customer'}</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.switchBtn,
              isAdmin ? styles.switchBtnToCustomer : styles.switchBtnToAdmin,
            ]}
            onPress={handleRoleToggle}
            activeOpacity={0.8}
          >
            <Ionicons
              name="swap-horizontal"
              size={16}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.switchBtnText}>
              {isAdmin ? 'Switch to Customer Role' : 'Switch to Admin Role'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Drawer Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.expense} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          MCA Sem III EoS Practical Exam • 75 Marks
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardAlt,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarAdmin: {
    backgroundColor: '#312E81',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  rolePillCustomer: {
    backgroundColor: colors.incomeLight,
  },
  rolePillAdmin: {
    backgroundColor: colors.primaryLight,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  rolePillTextCustomer: {
    color: colors.incomeDark,
  },
  rolePillTextAdmin: {
    color: colors.primaryDark,
  },
  menuContainer: {
    flex: 1,
  },
  menuScroll: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 6,
    paddingHorizontal: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  adminSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  adminInfoCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    alignItems: 'center',
  },
  adminInfoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  adminInfoDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  roleSwitchCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleSwitchTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  roleSwitchSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
  },
  switchBtnToCustomer: {
    backgroundColor: colors.incomeDark,
  },
  switchBtnToAdmin: {
    backgroundColor: colors.primary,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.expense,
    marginLeft: 10,
  },
  versionText: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CustomDrawerContent;
