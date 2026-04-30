import { Expense, Member } from "@/types";
import { useEffect, useState } from "react";
import MemberEdit from "./MemberEdit";

export default function MemberInfo({ member, expenses, shown, setShown, refreshKey, setRefreshKey}: { member: Member; expenses: Expense[]; shown: boolean; setShown: React.Dispatch<React.SetStateAction<boolean>>; refreshKey: number; setRefreshKey: React.Dispatch<React.SetStateAction<number>>;}) {
    
    const [showMemberEditForm, setShowMemberEditForm] = useState(false);

    const handleEdit = () => {
        setShowMemberEditForm(true);
        console.log("Edit member:", member);
    }
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
            return;
        }
        try {
            const res = await fetch(`/api/members/${member._id}`, {
                method: "DELETE",
            });
            
            const data = await res.json();

            if (data.ok) {
                setShown(false);
                setRefreshKey(prev => prev + 1);
            } 
        } catch (error) {
            console.error("Failed to delete member", error);
        }
    }

return (
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 top-[50%] left-[50%] w-[80vw] p-6 text-black bg-blue-300 rounded-lg m-auto ${shown ? "block" : "hidden"}`}>
            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold mb-4">Member Information</h2>
                <button className="hover:cursor-pointer" onClick={() => setShown(false)}>❌</button>
            </div>
            <h3>Name: {member?.name}</h3>
            <h3>Total Expense: {expenses.filter(expense => expense.paidBy === member?._id).reduce((total, expense) => total + expense.amount, 0).toFixed(2)}</h3>
            <div className="flex gap-4 mt-4">
                <button className="text-red-800 hover:underline" onClick={handleDelete}>Delete Member</button>
                <button className="text-green-800 hover:underline" onClick={handleEdit}>Edit Member</button>
            </div>

            <MemberEdit member={member} expenses={expenses} shown={showMemberEditForm} setShown={setShowMemberEditForm} refreshKey={refreshKey} setRefreshKey={setRefreshKey} shownInfo={shown} setShownInfo={setShown}/>
        </div>
    )
};