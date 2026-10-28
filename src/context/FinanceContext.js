import React, { createContext, useContext, useState, useMemo } from 'react';
import { Alert } from 'react-native';
import {
  initialCategories,
  initialTransactions,
  defaultCustomer,
  defaultAdmin,
} from '../data/mockData';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('customer'); // 'customer' | 'admin'
  const [currentUser, setCurrentUser] = useState(defaultCustomer);

  // Core Finance State
  const [transactions, setTransactions] = useState(initialTransactions);
  const [categories, setCategories] = useState(initialCategories);

  // In-app Toast / Notification banner
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to show floating in-app notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper to get first name for personalized greetings
  const getFirstName = () => {
    if (!currentUser || !currentUser.name) return 'User';
    return currentUser.name.split(' ')[0];
  };

  // -------------------------------------------------------------
  // Requirement 11: Personalized Transaction Change Alerts (5 Marks)
  // -------------------------------------------------------------
  const notifyTransactionChange = (action, transaction) => {
    const firstName = getFirstName();
    const amountStr = `₹${Number(transaction.amount || 0).toLocaleString('en-IN')}`;
    const categoryName = transaction.category || 'Transaction';
    const typeLabel = transaction.type === 'income' ? 'income' : 'expense';

    let alertTitle = 'Transaction Notification';
    let alertMsg = '';

    if (action === 'added') {
      alertMsg = `Hi ${firstName}, your ${amountStr} ${categoryName} ${typeLabel} has been added successfully.`;
    } else if (action === 'updated') {
      alertMsg = `Hi ${firstName}, your ${amountStr} ${categoryName} ${typeLabel} has been updated successfully.`;
    } else if (action === 'deleted') {
      alertMsg = `Hi ${firstName}, your ${amountStr} ${categoryName} ${typeLabel} has been removed.`;
    } else {
      alertMsg = `Hi ${firstName}, your transaction has been updated.`;
    }

    // Trigger Native Alert
    Alert.alert(alertTitle, alertMsg, [{ text: 'OK' }]);

    // Also display floating toast notification
    showToast(alertMsg);
  };

  // -------------------------------------------------------------
  // Transaction CRUD Operations
  // -------------------------------------------------------------
  const addTransaction = (newTx) => {
    const dateObj = newTx.date ? new Date(newTx.date) : new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthStr = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    const formattedTx = {
      id: `tx-${Date.now()}`,
      title: newTx.title.trim(),
      amount: Number(newTx.amount),
      type: newTx.type || 'expense',
      category: newTx.category,
      categoryId: newTx.categoryId || newTx.category.toLowerCase().split(' ')[0],
      date: newTx.date || new Date().toISOString().split('T')[0],
      month: newTx.month || monthStr,
      paymentMethod: newTx.paymentMethod || 'UPI',
      notes: newTx.notes || '',
    };

    setTransactions((prev) => [formattedTx, ...prev]);
    notifyTransactionChange('added', formattedTx);
    return formattedTx;
  };

  const updateTransaction = (id, updatedFields) => {
    let updatedTx = null;
    setTransactions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedTx = { ...item, ...updatedFields, amount: Number(updatedFields.amount || item.amount) };
          return updatedTx;
        }
        return item;
      })
    );

    if (updatedTx) {
      notifyTransactionChange('updated', updatedTx);
    }
  };

  const deleteTransaction = (id) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    setTransactions((prev) => prev.filter((item) => item.id !== id));
    notifyTransactionChange('deleted', target);
  };

  // -------------------------------------------------------------
  // Profile Management (Customer Only)
  // -------------------------------------------------------------
  const updateProfile = (updatedData) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedData,
      monthlyBudget: updatedData.monthlyBudget !== undefined
        ? Number(updatedData.monthlyBudget)
        : prev.monthlyBudget,
    }));

    const firstName = (updatedData.name || currentUser.name).split(' ')[0];
    const successMsg = `Hi ${firstName}, your profile has been updated successfully.`;
    Alert.alert('Profile Updated', successMsg, [{ text: 'Great!' }]);
    showToast(successMsg);
  };

  // -------------------------------------------------------------
  // Role & Authentication Handling
  // -------------------------------------------------------------
  const login = (email, password, selectedRole) => {
    const activeRole = selectedRole || 'customer';
    setRole(activeRole);
    if (activeRole === 'admin') {
      setCurrentUser(defaultAdmin);
    } else {
      setCurrentUser(defaultCustomer);
    }
    setIsAuthenticated(true);
    showToast(`Welcome back, ${activeRole === 'admin' ? 'Administrator' : defaultCustomer.name}!`);
  };

  const signup = (userData) => {
    const activeRole = userData.role || 'customer';
    setRole(activeRole);
    const newUser = {
      ...defaultCustomer,
      ...userData,
      accountNumber: `ACC-${Date.now().toString().slice(-6)}`,
      joinedDate: 'October 2026',
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    const firstName = newUser.name.split(' ')[0];
    Alert.alert('Account Created', `Welcome to Finance & Budget Tracker, ${firstName}!`);
    showToast(`Account successfully created for ${firstName}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out successfully.');
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setCurrentUser(defaultAdmin);
      showToast('Switched to Admin Role');
    } else {
      setCurrentUser(defaultCustomer);
      showToast('Switched to Customer Role');
    }
  };

  // -------------------------------------------------------------
  // Requirement 12: Daily, Weekly, and Monthly Reports (5 Marks)
  // -------------------------------------------------------------
  const getReportData = (period = 'daily') => {
    // Current reference date is October 28, 2026
    const todayStr = '2026-10-28';
    const today = new Date(todayStr);

    let filtered = [];

    if (period === 'daily') {
      // Transactions on today's date
      filtered = transactions.filter((t) => t.date === todayStr);
      // Fallback if today's list is empty
      if (filtered.length === 0) {
        filtered = transactions.slice(0, 3);
      }
    } else if (period === 'weekly') {
      // Transactions in the last 7 days (Oct 22 - Oct 28, 2026)
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 7);
      filtered = transactions.filter((t) => {
        const txDate = new Date(t.date);
        return txDate >= weekStart && txDate <= today;
      });
    } else if (period === 'monthly') {
      // Transactions for current month (October 2026)
      filtered = transactions.filter((t) => t.month === 'October 2026');
    }

    const income = filtered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filtered
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;
    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

    // Calculate highest spending category for this period
    const expenseByCat = {};
    filtered
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expenseByCat[t.category] = (expenseByCat[t.category] || 0) + t.amount;
      });

    let topCategory = { name: 'None', amount: 0 };
    Object.keys(expenseByCat).forEach((cat) => {
      if (expenseByCat[cat] > topCategory.amount) {
        topCategory = { name: cat, amount: expenseByCat[cat] };
      }
    });

    return {
      period,
      income,
      expense,
      balance,
      savingsRate,
      transactionCount: filtered.length,
      topCategory,
      transactions: filtered,
    };
  };

  // -------------------------------------------------------------
  // Overall Totals & Statistics
  // -------------------------------------------------------------
  const overallTotals = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });

    const balance = income - expense;
    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

    return {
      totalIncome: income,
      totalExpense: expense,
      balance,
      savingsRate,
      totalCount: transactions.length,
    };
  }, [transactions]);

  // -------------------------------------------------------------
  // Category Breakdown & Details
  // -------------------------------------------------------------
  const categoryStats = useMemo(() => {
    const stats = {};
    categories.forEach((cat) => {
      stats[cat.id] = {
        ...cat,
        totalSpent: 0,
        txCount: 0,
        transactions: [],
      };
    });

    let totalExpenseAll = 0;

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        totalExpenseAll += t.amount;
        const catId = t.categoryId || (t.category ? t.category.toLowerCase().split(' ')[0] : 'food');
        if (stats[catId]) {
          stats[catId].totalSpent += t.amount;
          stats[catId].txCount += 1;
          stats[catId].transactions.push(t);
        }
      }
    });

    // Add percentage calculations
    return Object.values(stats).map((cat) => ({
      ...cat,
      percentage: totalExpenseAll > 0 ? Math.round((cat.totalSpent / totalExpenseAll) * 100) : 0,
      remainingBudget: Math.max(0, cat.budget - cat.totalSpent),
      isOverBudget: cat.totalSpent > cat.budget,
    }));
  }, [transactions, categories]);

  // -------------------------------------------------------------
  // Month-wise Filtering
  // -------------------------------------------------------------
  const monthsList = ['All Months', 'October 2026', 'September 2026', 'August 2026'];

  const getMonthData = (selectedMonth = 'October 2026', typeFilter = 'all') => {
    let filtered = transactions;

    if (selectedMonth !== 'All Months') {
      filtered = filtered.filter((t) => t.month === selectedMonth);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    const monthIncome = filtered
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthExpense = filtered
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthBalance = monthIncome - monthExpense;

    return {
      transactions: filtered,
      income: monthIncome,
      expense: monthExpense,
      balance: monthBalance,
      count: filtered.length,
    };
  };

  const value = {
    // Auth & User
    isAuthenticated,
    setIsAuthenticated,
    role,
    setRole,
    currentUser,
    setCurrentUser,
    login,
    signup,
    logout,
    switchRole,
    isAdmin: role === 'admin',
    isCustomer: role === 'customer',

    // Core Data
    transactions,
    categories,
    categoryStats,
    overallTotals,
    monthsList,

    // Operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateProfile,

    // Selectors / Helpers
    getReportData,
    getMonthData,
    showToast,
    toastMessage,
    notifyTransactionChange,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
