import * as React from 'react';
import { useState } from 'react';
import { HomeViewProps } from '../../interfaces/home/HomeView.interface';
import Timer from '../timer/Timer';
import TaskList from '../task/TaskList';
import SessionHeader from '../task/SessionHeader';
import SessionHistory from '../task/SessionHistory';

const HomeView: React.FC<HomeViewProps> = ({
  tasks,
  currentTask,
  onTaskSelect,
  setTasks,
  onTaskToggle,
  error,
  activeConfig,
  onTimeEnd,
  activeSession,
  onNewSession,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex flex-col gap-8 p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="bg-[var(--bg-secondary)] rounded-lg shadow-lg p-6 border border-[var(--border-light)]">
            <Timer
              activeConfig={activeConfig}
              currentTask={currentTask}
              onTimeEnd={onTimeEnd}
              key={activeConfig.id}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-[var(--bg-secondary)] rounded-lg shadow-lg p-6 border border-[var(--border-light)]">
            <SessionHeader
              activeSession={activeSession}
              onNewSession={onNewSession}
              onShowHistory={() => setShowHistory(true)}
            />
            <TaskList
              tasks={tasks}
              onTaskSelect={onTaskSelect}
              setTasks={setTasks}
              onTaskToggle={onTaskToggle}
              selectedTaskId={currentTask?.id || null}
              sessionKey={activeSession?.id}
            />
          </div>
        </div>
      </div>
      <SessionHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
};

export default HomeView;
