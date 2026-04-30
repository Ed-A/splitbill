import { Expense, Member } from "@/types";

export default function ExpenseInfo({ expense, members, shown, setShown, refreshKey, setRefreshKey}: { expense: Expense; members: Member[]; shown: boolean; setShown: React.Dispatch<React.SetStateAction<boolean>>; refreshKey: number; setRefreshKey: React.Dispatch<React.SetStateAction<number>>;}) {

return (
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 top-[50%] left-[50%] w-[80vw] p-6 text-[#330033] bg-red-300 rounded-lg m-auto ${shown ? "block" : "hidden"}`}>
            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold mb-4">Expense Information</h2>
                <button className="hover:cursor-pointer" onClick={() => setShown(false)}>❌</button>
            </div>
            <h3>Title: {expense?.title}</h3>
            <h3>Amount: ${expense?.amount.toFixed(2)}</h3>
            <h3>Date: {new Date(expense?.date).toLocaleString()}</h3> 
            <h3>Paid By: {members.find((m) => m._id === expense?.paidBy)?.name}</h3>
            <h3>Participants: {expense?.participants?.map((id) => members.find((m) => m._id === id)?.name).join(", ")}</h3> 
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={async () => {
                if (confirm("Are you sure you want to delete this expense?")) {
                    try {
                        const response = await fetch(`/api/expenses/${expense._id}`, {
                            method: "DELETE"
                        });

                        if (!response.ok) {
                            throw new Error("Failed to delete expense");
                        }

                        setRefreshKey((prev) => prev + 1);
                        setShown(false);
                    } catch (error) {
                        console.error("Error deleting expense:", error);
                    }
                }
            }}>
                Delete Expense
            </button>
        </div>
    )
};