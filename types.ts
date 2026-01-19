
export enum ProgramType {
  MAF = 'MAF',
  IKI = 'IKI'
}

export interface Question {
  id: string;
  text: string;
}

export interface Category {
  id: string;
  name: string;
  weight: number;
  questions: Question[];
}

export interface Answer {
  score: number; // 0-5
  canImprove: boolean;
  action: string;
  date: string;
  owner: string;
}

/**
 * Fix: Changed from Record<string, Record<string, Answer>> to Record<string, Answer>.
 * The assessment state maps question IDs directly to their respective Answer objects.
 */
export type AssessmentState = Record<string, Answer>;

export interface ProjectInfo {
  name: string;
  client: string;
  sector: string;
  country: string;
}

export type PerformanceClass = 'Forte' | 'Viável' | 'Fraco' | 'Inadequado';

export interface ScoreResult {
  totalScore: number;
  percentage: number;
  classification: PerformanceClass;
  color: string;
  categoryScores: Record<string, number>;
}
