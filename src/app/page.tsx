import TaskBoard from "@/components/task-board";

export default function Home() {
  return (
    <section className="flex flex-1 flex-col gap-4 p-4 w-full h-full">
      <TaskBoard />
    </section>
  );
}
