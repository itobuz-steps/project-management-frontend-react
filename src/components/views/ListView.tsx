function ListView() {
  return (
    <div className="rounded-lg border bg-white">
      <div className="grid grid-cols-1 border-b bg-gray-100 p-3 text-sm font-medium sm:grid-cols-3">
        <span>Task</span>
        <span>Status</span>
        <span>Assignee</span>
      </div>
      <div className="p-3 text-sm text-gray-500">No tasks available</div>
    </div>
  );
}

export default ListView;
