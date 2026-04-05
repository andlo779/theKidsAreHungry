export interface AuthUser {
  id: string;
  email: string;
  family_id: string | null;
  name: string;
}

export interface AuthRequest {
  user: AuthUser;
}
