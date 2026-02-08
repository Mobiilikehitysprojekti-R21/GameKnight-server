export interface Friend {
  user_id: number;
  nickname: string;
}

export interface FriendRequest {
  request_id: number;
  from_user_id: number;
  from_nickname: string;
  to_user_id: number;
  to_nickname: string;
  created_at: Date;
}

export type FriendInviteStatus = "already_user" | "already_invited" | "sent";

export interface FriendInviteResult {
  email: string;
  status: FriendInviteStatus;
  token?: string;
}

export interface FriendshipProps {
  request_id: number;
  user_id: number;
  friend_id: number;
  status: 'pending' | 'accepted' ;
  created_at?: Date;
}

class Friendship {
  public readonly request_id: number;
  public readonly user_id: number;
  public readonly friend_id: number;
  public readonly status: 'pending' | 'accepted';

  constructor({ request_id, user_id, friend_id, status }: FriendshipProps) {
    if (user_id === friend_id) {
      throw new Error("A user cannot be friends with themselves");
    }
    this.request_id = request_id;
    this.user_id = user_id;
    this.friend_id = friend_id;
    this.status = status;
  }
}

export default Friendship;
