import { ProjectContainer } from '../components/forYou/ProjectContainer';
import { StatsContainer } from '../components/forYou/StatsContainer';
import { TaskContainer } from '../components/forYou/TaskContainer';

export function ForYouPage() {
  return (
    <div
      id="forYouPage"
      className="flex flex-1 flex-col gap-2 transition-all duration-300 md:gap-3"
    >
      <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-3 inset-shadow-sm md:p-4 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-b-gray-400 bg-clip-text pb-2 text-xl font-semibold text-black sm:text-2xl dark:border-b-slate-700 dark:text-slate-100">
          <h1 className="bg-clip-text text-xl font-semibold text-black sm:text-2xl dark:text-slate-100">
            For You
          </h1>
        </div>
        <StatsContainer />
        <ProjectContainer />
        <TaskContainer />
      </div>
      <div />
    </div>
  );
}
