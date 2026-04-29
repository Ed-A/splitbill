'use client';

import { useEffect, useState } from "react";
import { Group } from "@/types";

export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);

  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // stop page refresh
    setLoading(true);

    // 1️⃣ Call backend API
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: groupName }),
    });

    // 2️⃣ Read response
    const data = await res.json();

    // 3️⃣ Handle result
    if (data.success) {
      setRefreshKey((oldKey) => oldKey + 1); // trigger refresh
      setGroupName(""); // clear input
    } else {
      alert("Something went wrong");
    }

    setLoading(false);
  }

  async function handleDelete(groupId: string) {

    setLoading(true);

    // 1️⃣ Call backend API
    const res = await fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    // 2️⃣ Read response
    const data = await res.json();

    if(res.ok) {
    setRefreshKey((oldKey) => oldKey + 1); // trigger refresh
    setConfirmDelete(false);
    }
    setLoading(false);
  }

  const handleListClick = (groupName: string, groupId: string) => {
    const encodedGroupId = encodeURIComponent(groupId);
    window.location.href = `/groups/${encodedGroupId}`;
  }

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch("/api/groups");
        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          setGroups([]);
          return;
        }

        setGroups(data.groups ?? []);

      } catch (error) {
        console.error("Failed to fetch groups", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, [refreshKey]);


  return (
    <div className="px-10 min-h-screen text-black">
      <h1 className="heading font-inter font-bold text-center text-gray-300">Splitbill</h1>
      {/* <p className="subtext text-center text-sm text-gray-600">Welcome to Splitbill, your go-to app for easy bill splitting!</p> */}
      
      <div className="bg-white rounded-t-lg shadow-md px-6 py-2">
        
      <h2 className="mt-4 text-2xl font-semibold font-inter p-2">Create a New Group:</h2>
      <div className="w-full items-center gap-2 justify-center p-2">
       
       <form onSubmit={handleSubmit} className="w-full flex justify-between flex-row gap-2 items-center">
        <input
          className="flex-8 min-w-0 border-2 border-gray-300 bg-gray-100 rounded p-2 h-14 mx-2"
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />

        <button type="submit" className= "flex-3 bg-green-700 p-4.5 w-max h-auto rounded text-gray-200" disabled={creating}>
          <span className="inline max-[450px]:inline min-[451px]:hidden">
            +
          </span>
          <span className="hidden min-[451px]:inline sm:hidden">
            + Create
          </span>
          <span className="hidden sm:inline">
            + Create Group
          </span>
  
  </button>
      </form>
      </div>
      </div>
      <div className="bg-gray-200 rounded-b-lg shadow-md px-6 py-4">
        <h2 className="text-2xl font-semibold font-inter">Your Groups</h2>
            <div style={{ padding: 20}}>

          {groups.length === 0 ? (
            <p>No groups yet</p>
          ) : (
            <ul>
              {
              groups?.map((group) => (
                <li key={group._id?.toString()} className="border-2 border-gray-500 bg-white rounded-xl p-2 mb-2 flex justify-between hover:cursor-pointer hover:text-red-400"><span className="text-2xl w-full" onClick={() => handleListClick(group.name, `${group._id}`)}>{group.name}</span>
                <button className="text-red-500 hover:underline hover:cursor-pointer" onClick={() => (confirmDelete? handleDelete(group._id?.toString() || "") : setConfirmDelete(true))}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill={confirmDelete? "red" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={confirmDelete? "white" : "currentColor"} className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      </div>

      

  );
}
