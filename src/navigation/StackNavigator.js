import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import MonthTransactionsScreen from '../screens/MonthTransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Authentication Gateway */}
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Main Integrated Shell (Drawer -> Tabs -> Screens) */}
      <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />

      {/* Stack Navigation Screens (Back buttons & Route Params) */}
      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetailsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
      <Stack.Screen name="Transactions" component={MonthTransactionsScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
