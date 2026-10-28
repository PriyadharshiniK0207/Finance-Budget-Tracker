import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import TabNavigator from './TabNavigator';
import AnalysisScreen from '../screens/AnalysisScreen';
import MonthTransactionsScreen from '../screens/MonthTransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useFinance } from '../context/FinanceContext';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isCustomer } = useFinance();

  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '82%',
          maxWidth: 340,
        },
        drawerType: 'front',
        overlayColor: 'rgba(15, 23, 42, 0.5)',
      }}
    >
      {/* Root Tabs */}
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Home Dashboard',
        }}
      />

      {/* Direct Drawer Screens */}
      <Drawer.Screen
        name="AnalysisDrawer"
        component={AnalysisScreen}
        options={{
          drawerLabel: 'Financial Analysis',
        }}
      />

      {isCustomer && (
        <>
          <Drawer.Screen
            name="TransactionsDrawer"
            component={MonthTransactionsScreen}
            options={{
              drawerLabel: 'Month-wise Transactions',
            }}
          />

          <Drawer.Screen
            name="CategoriesDrawer"
            component={CategoriesScreen}
            options={{
              drawerLabel: 'Spending Categories',
            }}
          />

          <Drawer.Screen
            name="ProfileDrawer"
            component={ProfileScreen}
            options={{
              drawerLabel: 'My Profile',
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
