"use client";

import { use, useEffect, useState } from "react";
import { Group, Expense, Member } from "@/types";
import Link from "next/link";
import MemberInfo from "./components/MemberInfo";
import Summary from "./components/Summary";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseInfo from "./components/ExpenseInfo";


export default function GroupPage({ params }: { params: Promise<{ groupid: string }> }) {
  const { groupid } = use(params);

  const [group, setGroup] = useState<Group | null>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingE, setLoadingE] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);

  const [members, setMembers] = useState<Member[]>([]);
  const [loadingM, setLoadingM] = useState(true);

  const [showExpenseForm, setShowExpenseForm] = useState(false );
  const [showMemberForm, setShowMemberForm] = useState(false );
  const [showExpenseInfo, setShowExpenseInfo] = useState(false);

  const [expense, setExpense] = useState<Expense | null>(null);

  const [showMemberInfo, setShowMemberInfo] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [avatar, setAvatar] = useState("");


  useEffect(() => {
    const getGroup = async (groupid: string) => {
      try {
        const res = await fetch(`/api/groups/${groupid}`);
        const data = await res.json();
        return data as Group;
      } catch (error) {
        console.error("Failed to fetch group name", error);
        return "Unknown Group" as unknown as Group;
      }
    };
    getGroup(groupid).then(group => setGroup(group));
  }, []);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch(`/api/expenses?groupId=${encodeURIComponent(groupid)}`);
        const data = await res.json();
        setExpenses(data);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      } finally {
        setLoadingE(false);
      }
    }

    fetchExpenses();
  }, [refreshKey]);

useEffect(() => {
  async function fetchMembers() {
    try {
        const res = await fetch(`/api/members?groupId=${encodeURIComponent(groupid)}`);
        const data = await res.json();
        setMembers(data);
    } catch (error) {
        console.error("Failed to fetch members", error);
    } finally {
        setLoadingM(false);
    }
  }
  fetchMembers();
}, [refreshKey]);

return <div className=" w-full my-14">
  <Link href="/" className="absolute top-2 left-2">
        <button className="mb-4 text-4xl hover:cursor-pointer">🏠</button>
    </Link>
  <h1 className=" max-[550px]:text-[12vw] min-[550px]:text-7xl text-center">
    
    {group?.name}
  </h1>
  <div className="flex flex-row max-[880px]:flex-col w-full mt-8">
    <div className="expense-div min-[880px]:w-[65%] w-full p-4">
      <span className="flex gap-8 items-center border-b border-gray-300 pb-2 mb-4 pl-4 text-2xl">
        <h1>Expenses</h1>
        <button className="border-0.5 border-black rounded-4xl w-10 h-10 bg-[#2f8f74] text-white hover:text-white hover:bg-[#25735e] hover:cursor-pointer" onClick={() => setShowExpenseForm(prev => !prev)}>+</button>
      </span>
      <ul>
        {loadingE ? (
            <p>Loading expenses...</p>
            ) : expenses.length > 0 ? (
            expenses.map((expense: Expense) => (
                <li key={expense._id?.toString()} className="flex flex-row items-center justify-between hover:bg-blue-300 px-4 py-2 mb-2 rounded-lg hover:text-black hover:cursor-pointer" onClick={() => {
                    setShowExpenseInfo(true);
                    setExpense(expense);
                }}>
                    <span className="flex flex-col font-serif items-center">
                        <span className="">{new Date(expense.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-3xl">{new Date(expense.date).getDate()}</span>
                    </span>
                    <span className="text-xl">{expense.title}</span>
                    <span className="font-semibold font-sans">$ {expense.amount.toFixed(2)}</span>
                </li>
            ))
        ) : (
            <p>No expenses yet</p>
        )}
      </ul>
        <ExpenseForm groupid={groupid} setRefreshKey={setRefreshKey} showExpenseForm={showExpenseForm} setShowExpenseForm={setShowExpenseForm} members={members} />
        <ExpenseInfo expense={expense!} members={members} shown={showExpenseInfo} setShown={setShowExpenseInfo} refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
      </div>
      <div className="members-div min-[880px]:w-[40%] w-full p-4">
        <span className="flex gap-4 items-center border-b border-gray-300 pb-2 mb-4 text-2xl">
          <button className="border-2 border-gray-400 rounded-xl w-10 h-10
           bg-gray-300 text-gray-700 hover:cursor-pointer hover:text-white hover:bg-amber-400" onClick={() => setShowMemberForm(prev => !prev)}>+</button>
          <h1>Members</h1>
        </span>
        <div className={`p-4 text-black bg-blue-300 rounded-lg z-10 absolute -translate-x-1/2 -translate-y-1/2 top-[50%] left-[50%] w-[80%] m-auto ${showMemberForm ? "block" : "hidden"}`}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              const res = await fetch(`/api/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupId: groupid,
                    name: formData.get("name"),
                    avatar: formData.get("avatar"),
                }),
              });
              if (res.ok) {
                setShowMemberForm(false);
                setRefreshKey(prev => prev + 1);
                (e.target as HTMLFormElement).reset();
              }
            } catch (error) {
              console.error("Failed to add member", error);
            }
          }} className="space-y-3">
            <div className="flex float-left w-full m-0 p-0">
              <button className="hover:cursor-pointer m-0 p-0" onClick={() => setShowMemberForm(false)}>❌</button>
            </div>
            <h1 className="text-3xl m-auto w-max font-serif text-black">Add Member</h1>
            
            <div className="flex flex-row justify-evenly m-auto w-full my-8">   
              <img src="/assets/avatar1.jpg" className={`w-36 h-36 max-[580px]:w-24 max-[580px]:h-24 rounded-full ${avatar === '1' ? 'ring-2 ring-blue-500' : ''} peer-checked:ring-2 peer-checked:ring-blue-500 hover:border p-2`} onClick={() => {
                  setAvatar('1');
                  const radio = document.getElementById("avatar1") as HTMLInputElement;
                  radio.checked = true;
              }} />
              <img src="/assets/avatar2.jpg" className={`w-36 h-36 max-[580px]:w-24 max-[580px]:h-24 rounded-full ${avatar === '2' ? 'ring-2 ring-blue-500' : ''} peer-checked:ring-2 peer-checked:ring-blue-500 hover:border p-2`} onClick={() => {
                  setAvatar('2');
                  const radio = document.getElementById("avatar2") as HTMLInputElement;
                  radio.checked = true;
              }} />
              <img src="/assets/avatar3.jpg" className={`w-36 h-36 max-[580px]:w-24 max-[580px]:h-24 rounded-full ${avatar === '3' ? 'ring-2 ring-blue-500' : ''} peer-checked:ring-2 peer-checked:ring-blue-500 hover:border p-2`} onClick={() => {
                  setAvatar('3');
                  const radio = document.getElementById("avatar3") as HTMLInputElement;
                  radio.checked = true;
              }} />
            </div>
            <input type="radio" name="avatar" value="1" id="avatar1" className="hidden peer-checked:ring-2 peer-checked:ring-blue-500 rounded-full" defaultChecked />
            <input type="radio" name="avatar" value="2" id="avatar2" className="hidden peer-checked:ring-2 peer-checked:ring-blue-500 rounded-full" />
            <input type="radio" name="avatar" value="3" id="avatar3" className="hidden peer-checked:ring-2 peer-checked:ring-blue-500 rounded-full" />
            
            <input type="text" name="name" placeholder="Name" required className="w-full p-2 border rounded bg-gray-200 text-center" />
            
            <button type="submit" className="w-full bg-green-500 text-gray-800 hover:bg-green-600 hover:text-white p-2 rounded">Add Member</button>
          </form>
        </div>
        <ul>
          {loadingM ? (
            <p>Loading members...</p>
          ) : members?.length > 0 ? (
          members.map((member: Member) => (
            <li key={member._id?.toString()} className="flex flex-row px-4 py-2 mb-2 group items-center hover:cursor-pointer" onClick={() => { setSelectedMember(member); setShowMemberInfo(true); }}>
              <img src={`/assets/avatar${member.avatar}.jpg`} className="rounded-xl w-16 h-16 mr-3" />
              <span className="group-hover:text-blue-300 text-2xl font-serif">{member.name}</span>
              {(() => {const toGet = expenses
                      .filter((exp) => exp.paidBy === member._id)
                      .reduce((sum, exp) => sum + (Math.round(exp.amount) * 100) -  ((Math.round(exp.amount) * 100) / exp.participants.length), 0);

                const toGive = expenses
                      .filter((exp) => exp.participants.includes(member._id!) && exp.paidBy !== member._id)
                      .reduce((sum, exp) => sum + (Math.round(exp.amount) * 100) / exp.participants.length, 0);
              
                const totalOwedCents = toGet - toGive;
                
                const totalOwed =
                    parseFloat(totalOwedCents.toFixed(0))/100;

                  return (<span className={` ml-auto text-2xl font-semibold ${totalOwedCents>=0? 'text-green-600' : 'text-red-500' } group-hover:text-white`}>
                $ {totalOwed}
              </span>);

                })()}
              
            </li>
          ))) : (
            <p>No members yet</p>
          )
          }
        </ul>
        <MemberInfo member={selectedMember ?? null as unknown as Member} expenses={expenses} shown={showMemberInfo} setShown={setShowMemberInfo} refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
    </div>
  </div>
    <Summary expenses={expenses} members={members} />
  </div>
}
