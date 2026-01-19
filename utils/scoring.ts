
import { AssessmentState, Category, ScoreResult, PerformanceClass } from '../types';

export const calculateScores = (
  categories: Category[],
  state: AssessmentState
): ScoreResult => {
  let weightedTotal = 0;
  const categoryScores: Record<string, number> = {};

  categories.forEach((category) => {
    const questions = category.questions;
    let sum = 0;
    let count = 0;

    questions.forEach((q) => {
      const ans = state[q.id];
      if (ans && ans.score > 0) {
        sum += ans.score;
        count++;
      }
    });

    const average = count > 0 ? sum / count : 0;
    categoryScores[category.id] = average;
    weightedTotal += average * category.weight;
  });

  const percentage = (weightedTotal / 5) * 100;
  
  let classification: PerformanceClass = 'Inadequado';
  let color = '#ef4444'; // red-500

  if (percentage >= 80) {
    classification = 'Forte';
    color = '#10b981'; // emerald-500
  } else if (percentage >= 60) {
    classification = 'Viável';
    color = '#f59e0b'; // amber-500
  } else if (percentage >= 40) {
    classification = 'Fraco';
    color = '#f97316'; // orange-500
  }

  return {
    totalScore: weightedTotal,
    percentage,
    classification,
    color,
    categoryScores
  };
};

export const getColorForScore = (percentage: number): string => {
  if (percentage >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (percentage >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
  if (percentage >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 60) return 'bg-amber-500';
  if (percentage >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};
