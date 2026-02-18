import { randomUUID } from 'crypto' // testauksen vuoksi, voi poistaa kun Auth0 käytössä

export interface UserProps {
  user_id?: number | null;
  auth0_id: string;
  email: string;
  nickname: string;
  avatar_url: string
}

class User {
  public readonly user_id: number | null;
  public readonly auth0_id: string;
  public readonly email: string;
  public readonly nickname: string;
  public readonly avatar_url: string

  constructor({ user_id, email, auth0_id, nickname, avatar_url }: UserProps) {
    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }

    this.user_id = user_id ?? null;
    this.auth0_id = auth0_id;
    this.email = email;
    this.nickname = nickname;
    this.avatar_url = avatar_url;
  }
}

export default User;
