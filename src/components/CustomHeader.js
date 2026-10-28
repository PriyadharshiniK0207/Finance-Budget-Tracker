import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useFinance } from '../context/FinanceContext';

const CustomHeader = ({
  title,
  subtitle,
  navigation,
  showBack = false,
  showRoleBadge = true,
  onAddPress = null,
}) => {
  const { role, switchRole, isAdmin } = useFinance();

  const handleRoleToggle = () => {
    const nextRole = role === 'admin' ? 'customer' : 'admin';
    switchRole(nextRole);
  };

  return (
    <View style={styles.header}>
      {/* Left button: Hamburger Drawer toggle or Stack Back */}
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              if (navigation && navigation.openDrawer) {
                navigation.openDrawer();
              } else if (navigation && navigation.getParent) {
                const parent = navigation.getParent('Drawer');
                if (parent && parent.openDrawer) {
                  parent.openDrawer();
                } else {
                  navigation.navigate('DrawerRoot');
                }
              }
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={26} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center Title and Subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right Controls: Role Badge & Add Button */}
      <View style={styles.rightContainer}>
        {onAddPress && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onAddPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {showRoleBadge && (
          <TouchableOpacity
            style={[
              styles.roleBadge,
              isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeCustomer,
            ]}
            onPress={handleRoleToggle}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isAdmin ? 'shield-checkmark' : 'person-circle'}
              size={13}
              color={isAdmin ? colors.primary : colors.incomeDark}
              style={{ marginRight: 3 }}
            />
            <Text
              style={[
                styles.roleText,
                isAdmin ? styles.roleTextAdmin : styles.roleTextCustomer,
              ]}
            >
              {isAdmin ? 'Admin' : 'Customer'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 56 : 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardAlt,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 44,
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleBadgeCustomer: {
    backgroundColor: colors.incomeLight,
    borderColor: colors.incomeBorder,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primarySoft,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  roleTextCustomer: {
    color: colors.incomeDark,
  },
  roleTextAdmin: {
    color: colors.primary,
  },
});

export default CustomHeader;
