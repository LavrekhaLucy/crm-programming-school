export const FormatsEnum = {
  ALLFORMATS : 'all_formats',
  STATIC : 'static',
  ONLINE : 'online',
} as const;
export type FormatsEnum = typeof FormatsEnum[keyof typeof FormatsEnum];