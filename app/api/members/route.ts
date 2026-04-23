import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  const client = await clientPromise;
  const db = client.db("expense_splitter");

  const members = await db
    .collection("members")
    .find({ groupId: new ObjectId(groupId!) })
    .toArray();

  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const { groupId, name, avatar } = await req.json();

  const client = await clientPromise;
  const db = client.db("expense_splitter");

  const result = await db.collection("members").insertOne({
    groupId: new ObjectId(groupId),
    name,
    totalPaid: 0,
    avatar,
  });

  return NextResponse.json({ success: true, memberId: result.insertedId });
}