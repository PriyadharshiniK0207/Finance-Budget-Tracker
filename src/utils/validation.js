/**
 * Comprehensive Validation Utilities for Finance & Budget Tracker
 * MCA Sem III End-of-Semester Practical Exam
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Clean spaces, hyphens, and parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  // Matches 10-digit number with optional +91 or leading 0
  const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

export const isValidAmount = (amount) => {
  if (amount === undefined || amount === null || amount === '') return false;
  const num = Number(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
};

export const validateSignIn = ({ email, password, role }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || !password.trim()) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!role) {
    errors.role = 'Please select a role (Admin or Customer)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignUp = ({ name, email, phone, password, confirmPassword, role }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!phone || !phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number';
  }

  if (!password || !password.trim()) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!confirmPassword || !confirmPassword.trim()) {
    errors.confirmPassword = 'Confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!role) {
    errors.role = 'Please select a role';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProfile = ({ name, email, phone, budget }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Name cannot be empty';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email cannot be empty';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!phone || !phone.trim()) {
    errors.phone = 'Phone number cannot be empty';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number';
  }

  if (budget !== undefined && budget !== '') {
    const budgetNum = Number(budget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      errors.budget = 'Monthly budget must be a positive number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTransaction = ({ title, amount, category, type }) => {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Transaction title is required';
  }

  if (!amount || !isValidAmount(amount)) {
    errors.amount = 'Please enter a valid amount greater than 0';
  }

  if (!category || !category.trim()) {
    errors.category = 'Please select a category';
  }

  if (!type || (type !== 'expense' && type !== 'income')) {
    errors.type = 'Select transaction type (Income or Expense)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
