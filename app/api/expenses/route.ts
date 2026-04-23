import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { groupId, title, amount, paidBy, date, participants } = await req.json();

  const client = await clientPromise;
  const db = client.db("expense_splitter");

  // 1️⃣ Save expense
  await db.collection("expenses").insertOne({
    groupId: new ObjectId(groupId),
    title,
    amount,
    paidBy,
    participants, 
    date: new Date(date),
  });

  // 2️⃣ Update member total
  await db.collection("members").updateOne(
    { groupId: new ObjectId(groupId), name: paidBy },
    { $inc: { totalPaid: amount } }
  );

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  const client = await clientPromise;
  const db = client.db("expense_splitter");

  const expenses = await db
    .collection("expenses")
    .find({ groupId: new ObjectId(groupId!) })
    .sort({ date: -1 })
    .toArray();

  return NextResponse.json(expenses);
}
