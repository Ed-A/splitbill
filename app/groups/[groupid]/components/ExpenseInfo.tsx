import { Expense, Member } from "@/types";

export default function ExpenseInfo({ expense, members, shown, setShown, refreshKey, setRefreshKey}: { expense: Expense; members: Member[]; shown: boolean; setShown: React.Dispatch<React.SetStateAction<boolean>>; refreshKey: number; setRefreshKey: React.Dispatch<React.SetStateAction<number>>;}) {

return (
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 top-[50%] left-[50%] w-[80vh] p-6 text-[#330033] bg-red-300 rounded-lg m-auto ${shown ? "block" : "hidden"}`}>
            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold mb-4">Expense Information</h2>
                <button className="hover:cursor-pointer" onClick={() => setShown(false)}>❌</button>
            </div>
            <h3>Title: {expense?.title}</h3>
            <h3>Amount: ${expense?.amount.toFixed(2)}</h3>
            <h3>Date: {new Date(expense?.date).toLocaleString()}</h3> 
            <h3>Paid By: {members.find((m) => m._id === expense?.paidBy)?.name}</h3>
            <h3>Participants: {expense?.participants?.map((id) => members.find((m) => m._id === id)?.name).join(", ")}</h3> 
        </div>
    )
};