import { randomUUID } from 'crypto' // testauksen vuoksi, voi poistaa kun Auth0 käytössä

export interface UserProps {
  user_id?: number | null;
  auth0_id: string;
  email: string;
  nickname: string;
}

class User {
  public readonly user_id: number | null;
  public readonly auth0_id: string;
  public readonly email: string;
  public readonly nickname: string;

  constructor({ user_id, email, auth0_id, nickname }: UserProps) {
    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }

    this.user_id = user_id ?? null;
    this.auth0_id = auth0_id;
    this.email = email;
    this.nickname = nickname;
  }
}

export default User;
