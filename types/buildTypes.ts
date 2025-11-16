export type Build = {
  _id: string;
  name: string;
  description?: string;
  username: string;
  userImage?: string;
  viewCount: number;
  replyCount: number;
  totalPrice?: number;
  isPublic: boolean;
  createdAt: string;
}
