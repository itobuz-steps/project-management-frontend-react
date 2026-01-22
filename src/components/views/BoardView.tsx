function BoardView() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      {['To Do', 'In Progress', 'Done'].map((col) => (
        <div
          key={col}
          className="min-w-[200px] flex-1 rounded-lg border bg-white p-4"
        >
          <h2 className="font-semibold">{col}</h2>
          <div className="mt-2 rounded bg-gray-100 p-2 text-sm text-gray-500">
            No tasks
          </div>
        </div>
      ))}
    </div>
  );
}

export default BoardView;
