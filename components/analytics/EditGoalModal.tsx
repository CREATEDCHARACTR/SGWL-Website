import React, { useState } from 'react';
import { Goal, GoalType } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

interface EditGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: Omit<Goal, 'id' | 'createdAt' | 'status'>) => void;
    existingGoal?: Goal | null;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, onSubmit, existingGoal }) => {
    const [type, setType] = useState<GoalType>(existingGoal?.type || GoalType.REVENUE);
    const [name, setName] = useState(existingGoal?.name || '');
    const [target, setTarget] = useState(existingGoal?.target || 0);
    const [timeframe, setTimeframe] = useState<'month' | 'year' | 'custom'>(existingGoal ? 'custom' : 'month');
    const [startDate, setStartDate] = useState(existingGoal?.timeframe.start.split('T')[0] || startOfMonth(new Date()).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(existingGoal?.timeframe.end.split('T')[0] || endOfMonth(new Date()).toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            type,
            name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Goal`,
            target: Number(target),
            timeframe: {
                start: new Date(startDate).toISOString(),
                end: new Date(endDate).toISOString(),
            }
        });
    };

    const handleTimeframeChange = (value: 'month' | 'year' | 'custom') => {
        setTimeframe(value);
        const now = new Date();
        if (value === 'month') {
            setStartDate(startOfMonth(now).toISOString().split('T')[0]);
            setEndDate(endOfMonth(now).toISOString().split('T')[0]);
        } else if (value === 'year') {
            setStartDate(startOfYear(now).toISOString().split('T')[0]);
            setEndDate(endOfYear(now).toISOString().split('T')[0]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-modal-backdrop p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg my-8">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">{existingGoal ? 'Edit Goal' : 'Create New Goal'}</h2>
                        <div className="space-y-4">
                            <Input id="goalName" label="Goal Name" value={name} onChange={e => setName(e.target.value)} placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Goal`} />
                            <div>
                                <label className="block text-sm font-medium mb-1">Goal Type</label>
                                <select value={type} onChange={e => setType(e.target.value as GoalType)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                                    <option value={GoalType.REVENUE}>Revenue</option>
                                    <option value={GoalType.CLIENTS}>New Clients</option>
                                    <option value={GoalType.SESSIONS}>Completed Sessions</option>
                                </select>
                            </div>
                            <Input id="goalTarget" label="Target" type="number" value={target} onChange={e => setTarget(Number(e.target.value))} />
                            <div>
                                <label className="block text-sm font-medium mb-1">Timeframe</label>
                                <select value={timeframe} onChange={e => handleTimeframeChange(e.target.value as any)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 mb-2">
                                    <option value="month">This Month</option>
                                    <option value="year">This Year</option>
                                    <option value="custom">Custom</option>
                                </select>
                                {timeframe === 'custom' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                        <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center gap-2">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{existingGoal ? 'Save Changes' : 'Create Goal'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGoalModal;