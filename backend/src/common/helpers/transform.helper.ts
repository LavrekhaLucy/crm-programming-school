export class TransformHelper {
  public static toLowerCase({ value }: { value: string }): string {
    return value ? value.toString().toLowerCase() : value;
  }

  public static trim(this: void, { value }: { value: string }): string {
    return value ? value.toString().trim() : value;
  }

  public static toPhone(this: void, { value }: { value: unknown }): string {
    if (typeof value === 'string') {
      return value.replace(/\D/g, '');
    }
    return value as string;
  }
}
