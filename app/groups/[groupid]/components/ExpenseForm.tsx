
import { Member } from "@/types";

export default function ExpenseForm({groupid, setRefreshKey, showExpenseForm, setShowExpenseForm, members}: {groupid: string; setRefreshKey: React.Dispatch<React.SetStateAction<number>>; showExpenseForm: boolean; setShowExpenseForm: React.Dispatch<React.SetStateAction<boolean>>; members: Member[]}) {
return (
  <div className={`p-4 text-gray-900 bg-blue-300 border-2 border-gray-400 rounded-lg z-10 absolute w-[80%] h-[80%] m-auto bottom-0 top-0 left-0 right-0 ${showExpenseForm ? "block" : "hidden"}`}>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      try {
        const res = await fetch(`/api/expenses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId: groupid,
            title: formData.get("description"),
            amount: parseFloat(formData.get("amount") as string),
            paidBy: formData.get("paidBy"),
            participants: formData.getAll("splitAmong"),
            date: formData.get("date"),
          }),
        });
        if (res.ok) {
          setRefreshKey(prev => prev + 1);
          setShowExpenseForm(false);
          (e.target as HTMLFormElement).reset();
        }
      } catch (error) {
        console.error("Failed to add expense", error);
      }
    }} className="space-y-3">
      <div className="flex justify-between font-extrabold text-xl">
        <h1>Add Expense</h1>
        <button className=" hover:cursor-pointer" onClick={() => setShowExpenseForm(false)}>❌</button>
      </div>
      <input type="text" name="description" placeholder="Description" required className="w-full p-2 border rounded bg-gray-200" />
      <input type="number" name="amount" placeholder="Amount" step="0.01" required className="w-full p-2 border rounded bg-gray-200" />
      <select name="paidBy" required className="w-full p-2 border rounded bg-gray-200">
          <option value="">-- Select who paid --</option>
          {members.map((member) => (
              <option key={member._id?.toString()} value={member._id?.toString()}>
                  {member.name}
              </option>
          ))}
      </select>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Select members to split</label>
        {members.map((member) => (
          <label key={member._id?.toString()} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="splitAmong"
              value={member._id?.toString()}
              className="w-4 h-4"
              defaultChecked
            />
            <span>{member.name}</span>
          </label>
        ))}
      </div>
      <input type="date" name="date" required className="w-full p-2 border rounded bg-gray-200" />
      <button type="submit" className="w-full bg-amber-200 text-black p-2 rounded">Add Expense</button>
    </form>
  </div>)
}