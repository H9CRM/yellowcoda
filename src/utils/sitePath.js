// Router links use basename; native media and anchor URLs need the same base.
export const basePath = import.meta.env.BASE_URL;
export function sitePath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
  if (basePath === '/' || value.startsWith(basePath)) return value;
  return `${basePath.replace(/\/$/, '')}${value}`;
}
