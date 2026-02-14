
export enum Role {
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY'
}

export enum ApplicationStatus {
  APPLIED = 'Applied',
  SHORTLISTED = 'Shortlisted',
  ROUND1 = 'Round 1 (Aptitude)',
  ROUND2 = 'Round 2 (Technical)',
  HR = 'HR Interview',
  SELECTED = 'Selected',
  REJECTED = 'Rejected'
}

export interface Skill {
  id: string;
  name: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  year: number;
  cgpa: number;
  backlogs: number;
  skills: string[];
  resumeUrl: string;
}

export interface DriveEligibilityRules {
  minCGPA: number;
  allowedBranches: string[];
  maxBacklogs: number;
  requiredSkills: string[];
  minYear: number;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  logo: string;
  package: string;
  location: string;
  role: string;
  deadline: string;
  rules: DriveEligibilityRules;
}

export interface Application {
  id: string;
  studentId: string;
  driveId: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  score: number; // 0 to 100
  details: {
    label: string;
    passed: boolean;
    actualValue: any;
    requiredValue: any;
    message: string;
  }[];
}

export interface InterviewMessage {
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
}
