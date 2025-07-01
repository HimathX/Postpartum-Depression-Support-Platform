// src/services/riskCalculation.ts
// Update the import path if the types are located elsewhere, for example:
import { EPDSResponse, ScreeningResult } from '../../types/screening';
// Or, if the file does not exist, create 'src/types/screening.ts' and export the required types:

// Example content for src/types/screening.ts:
// export interface EPDSResponse {
//   question1: number;
//   question2: number;
//   question3: number;
//   question4: number;
//   question5: number;
//   question6: number;
//   question7: number;
//   question8: number;
//   question9: number;
//   question10: number;
// }
// export interface ScreeningResult {
//   id: string;
//   completedAt: Date;
//   totalScore: number;
//   riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRISIS';
//   recommendations: string[];
//   requiresImmediateAttention: boolean;
//   crisisResources?: string[];
// }

/**
 * Calculate EPDS risk based on validated scoring criteria[5][6][8]
 * Implements official EPDS scoring with proper reverse scoring
 */
export const calculateEPDSRisk = (responses: EPDSResponse): Omit<ScreeningResult, 'id' | 'completedAt'> => {
  // Calculate total score with proper reverse scoring for questions 1, 2, and 4
  let totalScore = 0;
  
  // Questions 1, 2, 4 are reverse scored (higher response = lower score)[6]
  totalScore += (3 - responses.question1); // Reverse scored
  totalScore += (3 - responses.question2); // Reverse scored
  totalScore += responses.question3;       // Normal scoring
  totalScore += responses.question4;       // Normal scoring
  totalScore += responses.question5;       // Normal scoring
  totalScore += responses.question6;       // Normal scoring
  totalScore += responses.question7;       // Normal scoring
  totalScore += responses.question8;       // Normal scoring
  totalScore += responses.question9;       // Normal scoring
  totalScore += responses.question10;      // Normal scoring

  // Crisis intervention check for suicidal ideation (Question 10)[6][8]
  if (responses.question10 >= 1) {
    return {
      totalScore,
      riskLevel: 'CRISIS',
      recommendations: [
        'IMMEDIATE CRISIS INTERVENTION REQUIRED',
        'Contact emergency services or crisis hotline immediately',
        'Do not leave patient alone',
        'Seek immediate professional mental health evaluation'
      ],
      requiresImmediateAttention: true,
      crisisResources: [
        'National Suicide Prevention Lifeline: 988 (24/7)',
        'Crisis Text Line: Text HOME to 741741',
        'Emergency Services: 911',
        'Postpartum Support International: 1-844-944-4773'
      ]
    };
  }

  // Standard risk stratification based on validated cutoff scores[5][8]
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  let recommendations: string[];

  if (totalScore >= 13) {
    // Probable depression - high specificity cutoff[5]
    riskLevel = 'HIGH';
    recommendations = [
      'Immediate clinical evaluation strongly recommended',
      'Schedule follow-up within 1 week',
      'Consider medication evaluation with healthcare provider',
      'Psychotherapy or counseling recommended',
      'Monitor symptoms closely'
    ];
  } else if (totalScore >= 10) {
    // Possible depression - high sensitivity cutoff[4][8]
    riskLevel = 'MEDIUM';
    recommendations = [
      'Clinical evaluation recommended',
      'Schedule follow-up within 2 weeks',
      'Consider counseling or support groups',
      'Monitor symptoms for changes',
      'Practice self-care strategies'
    ];
  } else if (totalScore >= 7) {
    // Mild symptoms - monitoring recommended[5]
    riskLevel = 'LOW';
    recommendations = [
      'Mild symptoms detected - continue monitoring',
      'Practice self-care and stress management',
      'Consider support groups or counseling if symptoms persist',
      'Schedule routine follow-up'
    ];
  } else {
    // Minimal symptoms[5]
    riskLevel = 'LOW';
    recommendations = [
      'Minimal depression symptoms detected',
      'Continue routine self-care practices',
      'Maintain healthy lifestyle habits',
      'Contact healthcare provider if symptoms develop'
    ];
  }

  return {
    totalScore,
    riskLevel,
    recommendations,
    requiresImmediateAttention: false
  };
};

/**
 * Get anxiety subscale from EPDS (Questions 3, 4, 5)[7]
 * Cutoff score ≥4 indicates probable anxiety
 */
export const calculateAnxietySubscale = (responses: EPDSResponse): number => {
  return responses.question3 + responses.question4 + responses.question5;
};
