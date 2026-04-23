"use client";
import React, { use } from "react";
import { Expense, Member } from "@/types";

export default function MemberEdit({member, expenses, shown, setShown, refreshKey, setRefreshKey, setShownInfo, shownInfo}: {member: Member; expenses: Expense[]; shown: boolean; setShown: React.Dispatch<React.SetStateAction<boolean>>; refreshKey: number; setRefreshKey: React.Dispatch<React.SetStateAction<number>>,  shownInfo: boolean; setShownInfo: React.Dispatch<React.SetStateAction<boolean>> }) {
    
  return (
        <div className={`p-4 text-black bg-blue-300 rounded-lg z-10 absolute w-[80%] m-auto left-0 right-0 ${shown ? "block" : "hidden"}`}>
            <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              const res = await fetch(`/api/members/${member._id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              name: formData.get("name"),
                            }),
                          });
              if (res.ok) {
              setShown(false);
              setShownInfo(false);
              setRefreshKey(prev => prev + 1);
              (e.target as HTMLFormElement).reset();
              }
            } catch (error) {
              console.error("Failed to update member", error);
            }
            }} className="space-y-3">
            <div className="flex justify-between">
            <h1>Edit Member</h1><button className="font-extrabold text-red-600 hover:cursor-pointer" onClick={() => setShown(false)}>❌</button>
            </div>
            <input type="text" name="name" placeholder="Name" defaultValue={member?.name} required className="w-full p-2 border rounded bg-gray-200" />
            <button type="submit" className="w-full bg-amber-200 text-black p-2 rounded">Update Member</button>
            </form>
        </div>
    )
}