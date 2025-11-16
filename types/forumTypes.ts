
export type Question = {
  _id: string;
  username: string;
  userEmail: string;
  userImage?: string;
  content: string;
  answerCount: number;
  createdAt: string;
}


export type Answer = {
  _id: string;
  questionId: string;
  username: string;
  userEmail: string;
  userImage?: string;
  content: string;
  createdAt: string;
}

export type Build = {
  _id: string;
  name: string;
  username: string;
  userEmail?: string;
  userImage?: string;
  createdAt: string;
}
