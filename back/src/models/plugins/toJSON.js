export const applyToJSON = (schema, { hide = [] } = {}) => {
  const hidden = new Set(['password', 'refreshToken', ...hide]);

  schema.set('toJSON', {
    virtuals: true,
    transform(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      hidden.forEach((field) => delete ret[field]);
      return ret;
    },
  });

  schema.set('toObject', { virtuals: true });
};
