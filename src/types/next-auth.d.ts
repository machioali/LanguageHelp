import { UserRoleType } from '@/lib/constants';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRoleType;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRoleType;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRoleType;
  }
}
