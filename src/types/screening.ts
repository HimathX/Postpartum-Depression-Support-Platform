// src/types/screening.ts
export interface EPDSQuestion {
  id: number;
  question: string;
  options: string[];
  isReversed: boolean;
}

export interface EPDSResponse {
  question1: number; // Able to laugh and see funny side
  question2: number; // Look forward with enjoyment
  question3: number; // Blamed myself unnecessarily
  question4: number; // Anxious or worried for no reason
  question5: number; // Scared or panicky for no reason
  question6: number; // Things getting on top of me
  question7: number; // Difficulty sleeping due to unhappiness
  question8: number; // Felt sad or miserable
  question9: number; // Been crying
  question10: number; // Thought of harming myself
}

export interface ScreeningResult {
  id: string;
  totalScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRISIS';
  recommendations: string[];
  requiresImmediateAttention: boolean;
  crisisResources?: string[];
  completedAt: Date;
}

export interface CBTModule {
  id: string;
  title: string;
  description: string;
  type: 'COGNITIVE_RESTRUCTURING' | 'BEHAVIORAL_ACTIVATION' | 'MINDFULNESS' | 'PSYCHOEDUCATION';
  content: CBTContent[];
  exercises: CBTExercise[];
  estimatedDuration: number; // in minutes
}

export interface CBTContent {
  id: string;
  type: 'TEXT' | 'VIDEO' | 'AUDIO' | 'INTERACTIVE';
  title: string;
  content: string;
  mediaUrl?: string;
}

export interface CBTExercise {
  id: string;
  type: 'THOUGHT_RECORD' | 'ACTIVITY_SCHEDULING' | 'BREATHING' | 'JOURNALING';
  title: string;
  instructions: string;
  fields: ExerciseField[];
}

export interface ExerciseField {
  name: string;
  type: 'TEXT' | 'TEXTAREA' | 'SCALE' | 'CHECKBOX';
  label: string;
  required: boolean;
  options?: string[];
}

export interface EducationalResource {
  id: string;
  title: string;
  contentType: 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'INFOGRAPHIC' | 'PDF';
  description: string;
  contentUrl: string;
  targetRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRISIS' | 'ALL';
  tags: string[];
  readingTime?: number;
}
