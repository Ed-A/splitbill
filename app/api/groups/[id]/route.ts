import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { use } from "react";
import { ok } from "assert";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db("expense_splitter");
    const { id } = await context.params;

    const { ObjectId } = await import("mongodb");
    const group = await db
      .collection("groups")
      .findOne({ _id: new ObjectId(id) });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("GET /api/groups/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db("expense_splitter");
    const { id } = await context.params;
    const body = await request.json();

    const { ObjectId } = await import("mongodb");
    const result = await db
      .collection("groups")
      .updateOne({ _id: new ObjectId(id) }, { $set: body });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Group updated successfully" });
  } catch (error) {
    console.error("PUT /api/groups/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db("expense_splitter");
    const { id } = await context.params;

    const { ObjectId } = await import("mongodb");
    const result = await db
      .collection("groups")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Group deleted successfully" }, {status: 200});
  } catch (error) {
    console.error("DELETE /api/groups/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
