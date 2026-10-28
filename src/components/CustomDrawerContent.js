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
      'Are you sure you want to sign out from Finance & Budget?',
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
          <View style={styles.avatar}>
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
                color={isAdmin ? colors.accent : colors.secondary}
              />
              <Text
                style={[
                  styles.rolePillText,
                  isAdmin ? styles.rolePillTextAdmin : styles.rolePillTextCustomer,
                ]}
              >
                {isAdmin ? 'Administrator' : 'Verified Customer'}
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
        <Text style={styles.sectionHeader}>FINANCE & BUDGET MENU</Text>

        {/* Dashboard */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('MainTabs', { screen: 'Home' })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="grid-outline" size={18} color={colors.accentDark} />
          </View>
          <Text style={styles.menuItemText}>Dashboard & Reports</Text>
        </TouchableOpacity>

        {/* Analysis (Admin and Customer) */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo('MainTabs', { screen: 'Analysis' })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.secondaryLight }]}>
            <Ionicons name="pie-chart-outline" size={18} color={colors.secondary} />
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
              <View style={[styles.iconBox, { backgroundColor: '#EAF3F8' }]}>
                <Ionicons name="receipt-outline" size={18} color={colors.catTravel} />
              </View>
              <Text style={styles.menuItemText}>Month-wise Ledger</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('MainTabs', { screen: 'Categories' })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.catFoodBg }]}>
                <Ionicons name="folder-open-outline" size={18} color={colors.catFood} />
              </View>
              <Text style={styles.menuItemText}>Spending Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('MainTabs', { screen: 'Profile' })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.catShoppingBg }]}>
                <Ionicons name="person-outline" size={18} color={colors.catShopping} />
              </View>
              <Text style={styles.menuItemText}>Profile & Budget</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Admin-Only Screens */}
        {isAdmin && (
          <View style={styles.adminSection}>
            <Text style={styles.sectionHeader}>ADMINISTRATIVE CONTROLS</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('MainTabs', { screen: 'Profile' })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="person-circle-outline" size={18} color={colors.accentDark} />
              </View>
              <Text style={styles.menuItemText}>Admin Profile Settings</Text>
            </TouchableOpacity>

            <View style={styles.adminInfoCard}>
              <Ionicons name="shield-outline" size={18} color={colors.accentDark} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.adminInfoTitle}>Audit Mode Active</Text>
                <Text style={styles.adminInfoDesc}>
                  Global wealth tracking and institutional reconciliation enabled.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Role Switcher Action */}
        <View style={styles.roleSwitchCard}>
          <Text style={styles.roleSwitchTitle}>Quick Role Switcher</Text>
          <Text style={styles.roleSwitchSubtitle}>
            Active Role: <Text style={{ fontWeight: '800', color: colors.primary }}>{isAdmin ? 'Admin' : 'Customer'}</Text>
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
              size={15}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.switchBtnText}>
              {isAdmin ? 'Switch to Customer Account' : 'Switch to Admin Account'}
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
          <Ionicons name="log-out-outline" size={18} color={colors.expense} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Finance & Budget • MCA Sem III EoS
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
    paddingTop: 18,
    paddingBottom: 20,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryDark,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  userEmail: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
  },
  rolePillCustomer: {
    backgroundColor: 'rgba(8, 127, 104, 0.2)',
    borderColor: colors.secondary,
  },
  rolePillAdmin: {
    backgroundColor: 'rgba(217, 182, 111, 0.2)',
    borderColor: colors.accent,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  rolePillTextCustomer: {
    color: '#A7D9CD',
  },
  rolePillTextAdmin: {
    color: colors.accent,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  menuScroll: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 6,
    paddingHorizontal: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  adminSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  adminInfoCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    marginTop: 6,
  },
  adminInfoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  adminInfoDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  roleSwitchCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleSwitchTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
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
    paddingVertical: 10,
    borderRadius: 10,
  },
  switchBtnToCustomer: {
    backgroundColor: colors.secondary,
  },
  switchBtnToAdmin: {
    backgroundColor: colors.primary,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.expense,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
});

export default CustomDrawerContent;
