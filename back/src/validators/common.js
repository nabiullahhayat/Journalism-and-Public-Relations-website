import mongoose from 'mongoose';
import { body } from 'express-validator';

export const isValidMongoId = (value) => {
  if (value === undefined || value === null || value === '') return true;
  const id = String(value);
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

export const mongoIdBody = (field, { optional = false } = {}) => {
  const chain = body(field);
  if (optional) {
    chain.optional({ values: ['', null] });
  } else {
    chain.notEmpty().withMessage(`${field} is required`);
  }
  return chain.custom((value) => {
    if (optional && (value === undefined || value === null || value === '')) return true;
    if (!isValidMongoId(value)) throw new Error(`Invalid ${field}`);
    return true;
  });
};

export const bodyBoolean = (field, { optional = false } = {}) => {
  const chain = body(field);
  if (optional) chain.optional({ values: ['', null] });
  return chain
    .customSanitizer((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    })
    .custom((value) => {
      if (optional && (value === undefined || value === null || value === '')) return true;
      if (typeof value === 'boolean') return true;
      throw new Error(`${field} must be a boolean`);
    });
};

export const bodyInt = (field, { optional = false, min, max } = {}) => {
  const chain = body(field);
  if (optional) {
    chain.optional({ values: ['', null] });
  } else {
    chain.notEmpty().withMessage(`${field} is required`);
  }
  return chain
    .custom((value) => {
      if (optional && (value === undefined || value === null || value === '')) return true;
      const n = parseInt(value, 10);
      if (Number.isNaN(n)) throw new Error(`${field} must be a number`);
      if (min !== undefined && n < min) throw new Error(`${field} must be at least ${min}`);
      if (max !== undefined && n > max) throw new Error(`${field} must be at most ${max}`);
      return true;
    })
    .toInt();
};
