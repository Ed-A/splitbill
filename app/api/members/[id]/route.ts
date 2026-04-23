import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PUT(req: Request, { params }: { params: { id: string}}) {

  try {
    const client = await clientPromise;
    const db = client.db("expense_splitter");
    const { id } = await params;
    const body = await req.json();

    const { ObjectId } = await import("mongodb");
    const result = await db
      .collection("members")
      .updateOne({ _id: new ObjectId(id) }, { $set: body });
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Member updated successfully" });
  } catch (error) {
    console.error("PUT /api/members/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request, 
  { params }: { params: { id: string}}
) {
  try {
    const client = await clientPromise;
    const db = client.db("expense_splitter");
    const { id } = params;

    const { ObjectId } = await import("mongodb");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
    }

    const memberId = new ObjectId(id);

    const member = await db.collection("members").findOne(
      { _id: memberId },
      { projection: { expense: 1 } }
    );

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (Number(member.expense ?? 0) != 0) {
      return NextResponse.json(
      { error: "Cannot delete member. Expense must be 0." },
      { status: 400 }
      );
    }

    const result = await db.collection("members").deleteOne({ _id: memberId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
      { error: "Member not found" },
      { status: 404 }
      );
    }

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/members/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
       { status: 500 }
    );
  }
}