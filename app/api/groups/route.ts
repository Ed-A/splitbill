import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("expense_splitter");

    const result = await db.collection("groups").insertOne({ name });

    // ✅ THIS IS THE IMPORTANT LINE
    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });
  } catch (error) {
    console.error("POST /api/groups error:", error);

    // ✅ EVEN ERRORS MUST RETURN JSON
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("expense_splitter");

    const groups = await db
      .collection("groups")
      .find({})
      .toArray();

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("GET /api/groups error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}
