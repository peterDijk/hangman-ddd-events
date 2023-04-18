import * as bcrypt from 'bcrypt';

export async function arePasswordsEqual(
  raw: string,
  hashed: string,
): Promise<boolean> {
  return await bcrypt.compare(raw, hashed);
}
