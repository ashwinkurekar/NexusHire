
import { PlacementDrive, Role, StudentProfile, ApplicationStatus } from './types';

export const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical'];

export const DUMMY_STUDENT: StudentProfile = {
  id: 's1',
  name: 'Aiden Vance',
  rollNo: '21CS1045',
  branch: 'CSE',
  year: 3,
  cgpa: 8.4,
  backlogs: 0,
  skills: ['React', 'Node.js', 'Python', 'Tailwind'],
  resumeUrl: '#'
};

export const DUMMY_DRIVES: PlacementDrive[] = [
  {
    id: 'd1',
    companyName: 'Stellar Tech',
    logo: 'https://picsum.photos/seed/stellar/200',
    package: '24 LPA',
    location: 'Bangalore, India',
    role: 'Software Engineer',
    deadline: '2024-12-15',
    rules: {
      minCGPA: 8.0,
      allowedBranches: ['CSE', 'IT', 'ECE'],
      maxBacklogs: 0,
      requiredSkills: ['React', 'Node.js'],
      minYear: 3
    }
  },
  {
    id: 'd2',
    companyName: 'Lumina Dynamics',
    logo: 'https://picsum.photos/seed/lumina/200',
    package: '18 LPA',
    location: 'Remote',
    role: 'Full Stack Developer',
    deadline: '2024-12-20',
    rules: {
      minCGPA: 7.5,
      allowedBranches: ['CSE', 'IT'],
      maxBacklogs: 1,
      requiredSkills: ['JavaScript', 'TypeScript'],
      minYear: 3
    }
  },
  {
    id: 'd3',
    companyName: 'RoboCore Systems',
    logo: 'https://picsum.photos/seed/robo/200',
    package: '15 LPA',
    location: 'Pune, India',
    role: 'Embedded Systems Engineer',
    deadline: '2024-12-10',
    rules: {
      minCGPA: 7.0,
      allowedBranches: ['ECE', 'EEE', 'Mechanical'],
      maxBacklogs: 0,
      requiredSkills: ['C++', 'Python'],
      minYear: 4
    }
  }
];

export const STATUS_ORDER = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.ROUND1,
  ApplicationStatus.ROUND2,
  ApplicationStatus.HR,
  ApplicationStatus.SELECTED
];
