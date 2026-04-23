import { ObjectId } from "mongodb";

export type Group = {
  _id?: ObjectId;
  name: string;
};

export type Member = {
  _id?: ObjectId;
  groupId: ObjectId;
  name: string;
  avatar: string;
};

export type Expense = {
  _id?: ObjectId;
  groupId: ObjectId;
  title: string;
  amount: number;
  paidBy: ObjectId;
  participants: ObjectId[];
  date: Date;
};
