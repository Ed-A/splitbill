'use client';

export default function Home() {
    const groups = ["Trip to Paris", "Weekend Getaway", "Office Party", "Family Dinner", "Road Trip", "Birthday Bash", "Holiday Gathering", "Concert Night", "Sports Event", "Movie Marathon"];

  const handleListClick = (group: string) => {
    const groupId = encodeURIComponent(group);
    window.location.href = `/groups/${groupId}`;
  }

  return (
    <div className="">
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Groups</h2>
        <ul className="list-disc pl-5 p-2 max-h-48 overflow-y-auto">
          {groups.map((group, index) => (
        <li key={index} className="mt-1 border-b border-gray-300 p-2 bg-amber-50 hover:bg-gray-200 text-gray-800 cursor-pointer list-none" onClick={() => handleListClick(group)}>
          {group}
        </li>
          ))}
        </ul>
      </div>
    </div>

      

  );
}
