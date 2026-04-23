import { Expense, Member } from "@/types";

export default function Summary({expenses, members}: {expenses: Expense[], members: Member[]}) {

  return (
    <div className="summary p-4 border-t border-gray-300 mt-8"> 
        <h2 className="text-2xl font-semibold mb-2">Summary</h2>
        <p className="text-lg">Total Expenses: ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</p>
    </div>
  );
}