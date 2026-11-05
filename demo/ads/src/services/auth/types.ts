// Auth types (recovered from the build's zod schemas / usage).
export interface User {
  Authorization: string;
  full_name: string;
  id: number;
  image: string;
  role_name: string;
  status: string;
  username: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
