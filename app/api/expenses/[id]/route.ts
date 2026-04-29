import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("expense_splitter");
    const { id } = await params;

    const { ObjectId } = await import("mongodb");
    const result = await db
      .collection("expenses")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Expense deleted successfully" }, {status: 200});
  } catch (error) {
    console.error("DELETE /api/expenses/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}