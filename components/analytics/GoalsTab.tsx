import React, { useState } from 'react';
import { Goal, GoalStatus, AnalyticsData } from '../../types';
import { createGoal, updateGoal, deleteGoal } from '../../services/geminiService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import EditGoalModal from './EditGoalModal';

interface GoalsTabProps {
    goals: Goal[];
    analyticsData: AnalyticsData;
    onGoalUpdate: () => void;
}

const GoalCard: React.FC<{ goal: Goal; progress: number; current: number; onEdit: () => void; onDelete: () => void }> = ({ goal, progress, current, onEdit, onDelete }) => {
    return (
        <Card className="p-6">
            <h4 className="font-bold text-lg dark:text-white">{goal.name}</h4>
            <div className="my-2">
                <ProgressBar value={current} max={goal.target} />
                <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">{current.toLocaleString()} / {goal.target.toLocaleString()} ({progress.toFixed(0)}%)</span>
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        {Math.max(0, goal.target - current).toLocaleString()} remaining
                    </span>
                </div>
            </div>
            <p className="text-xs text-gray-500">
                Timeframe: {new Date(goal.timeframe.start).toLocaleDateString()} - {new Date(goal.timeframe.end).toLocaleDateString()}
            </p>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={onEdit} className="!text-sm !py-1 !px-3">Edit</Button>
                <Button variant="danger" onClick={onDelete} className="!text-sm !py-1 !px-3">Delete</Button>
            </div>
        </Card>
    );
};

const GoalsTab: React.FC<GoalsTabProps> = ({ goals, analyticsData, onGoalUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);

    const handleOpenModal = (goal: Goal | null = null) => {
        setGoalToEdit(goal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setGoalToEdit(null);
        setIsModalOpen(false);
    };

    const handleSubmitGoal = async (formData: Omit<Goal, 'id' | 'createdAt' | 'status'>) => {
        if (goalToEdit) {
            await updateGoal({ ...goalToEdit, ...formData });
        } else {
            const newGoal: Omit<Goal, 'id'> = {
                ...formData,
                status: GoalStatus.ACTIVE,
                createdAt: new Date().toISOString(),
            };
            await createGoal(newGoal);
        }
        onGoalUpdate();
        handleCloseModal();
    };
    
    const handleDeleteGoal = async (goalId: string) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(goalId);
            onGoalUpdate();
        }
    };

    const activeGoals = goals.filter(g => g.status === GoalStatus.ACTIVE);
    const completedGoals = goals.filter(g => g.status === GoalStatus.COMPLETED);

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold dark:text-white">Active Goals</h3>
                    <Button onClick={() => handleOpenModal()}>+ New Goal</Button>
                </div>
                {activeGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeGoals.map(goal => {
                            const progressData = analyticsData.goals[goal.id];
                            const current = progressData?.current || 0;
                            const progress = goal.target > 0 ? (current / goal.target) * 100 : 0;
                            return (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    progress={progress}
                                    current={current}
                                    onEdit={() => handleOpenModal(goal)}
                                    onDelete={() => handleDeleteGoal(goal.id)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No active goals. Click "+ New Goal" to set one.</p>
                )}

                {completedGoals.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold dark:text-white">Completed Goals</h3>
                         <ul className="mt-4 space-y-2">
                            {completedGoals.map(goal => (
                                <li key={goal.id} className="text-green-600 dark:text-green-400">✅ {goal.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <EditGoalModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitGoal}
                    existingGoal={goalToEdit}
                />
            )}
        </>
    );
};

export default GoalsTab;