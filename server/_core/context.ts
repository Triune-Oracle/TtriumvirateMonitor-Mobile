import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

export interface Session {
  userId: string;
  token: string;
}

export interface Context {
  session: Session | null;
}

export async function createContext(opts?: CreateNextContextOptions): Promise<Context> {
  const authHeader = opts?.req?.headers?.authorization;
  if (!authHeader) {
    return { session: null };
  }
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { session: null };
  }
  return {
    session: { userId: 'system', token },
  };
}
