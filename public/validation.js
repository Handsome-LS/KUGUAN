export class ValidationError extends Error {}

export const positiveInteger = (value, label) => {
  if (!Number.isSafeInteger(value) || value <= 0 || value > 1000000000) {
    throw new ValidationError(`${label}必须是 1 到 1,000,000,000 之间的整数`);
  }
  return value;
};

export const requiredText = (value, label, maxLength = 200) => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new ValidationError(`请填写${label}，最多 ${maxLength} 个字符`);
  }
  return value.trim();
};

export const optionalText = (value, maxLength = 1000) => {
  if (value == null || value === '') return '';
  if (typeof value !== 'string' || value.trim().length > maxLength) {
    throw new ValidationError(`文字内容最多 ${maxLength} 个字符`);
  }
  return value.trim();
};
