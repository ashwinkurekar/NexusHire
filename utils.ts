
import { StudentProfile, PlacementDrive, EligibilityResult } from './types';

export const calculateEligibility = (
  student: StudentProfile,
  drive: PlacementDrive
): EligibilityResult => {
  const details = [];
  let passedCount = 0;
  const totalChecks = 5;

  // CGPA Check
  const cgpaPassed = student.cgpa >= drive.rules.minCGPA;
  if (cgpaPassed) passedCount++;
  details.push({
    label: 'CGPA',
    passed: cgpaPassed,
    actualValue: student.cgpa,
    requiredValue: drive.rules.minCGPA,
    message: cgpaPassed 
      ? `CGPA ${student.cgpa} satisfies min requirement of ${drive.rules.minCGPA}` 
      : `CGPA ${student.cgpa} is below the threshold of ${drive.rules.minCGPA}`
  });

  // Branch Check
  const branchPassed = drive.rules.allowedBranches.includes(student.branch);
  if (branchPassed) passedCount++;
  details.push({
    label: 'Branch',
    passed: branchPassed,
    actualValue: student.branch,
    requiredValue: drive.rules.allowedBranches,
    message: branchPassed 
      ? `Branch ${student.branch} is eligible` 
      : `Branch ${student.branch} is not in the allowed list: ${drive.rules.allowedBranches.join(', ')}`
  });

  // Backlog Check
  const backlogsPassed = student.backlogs <= drive.rules.maxBacklogs;
  if (backlogsPassed) passedCount++;
  details.push({
    label: 'Backlogs',
    passed: backlogsPassed,
    actualValue: student.backlogs,
    requiredValue: drive.rules.maxBacklogs,
    message: backlogsPassed 
      ? `${student.backlogs} backlogs is within limit (${drive.rules.maxBacklogs})` 
      : `${student.backlogs} backlogs exceeds the limit of ${drive.rules.maxBacklogs}`
  });

  // Skill Check
  const matchedSkills = student.skills.filter(s => drive.rules.requiredSkills.some(rs => rs.toLowerCase() === s.toLowerCase()));
  const skillsPassed = matchedSkills.length > 0; // Simplified: passed if at least one skill matches
  if (skillsPassed) passedCount++;
  details.push({
    label: 'Skills',
    passed: skillsPassed,
    actualValue: student.skills,
    requiredValue: drive.rules.requiredSkills,
    message: skillsPassed 
      ? `Found matching skills: ${matchedSkills.join(', ')}` 
      : `No matching skills found from required: ${drive.rules.requiredSkills.join(', ')}`
  });

  // Year Check
  const yearPassed = student.year >= drive.rules.minYear;
  if (yearPassed) passedCount++;
  details.push({
    label: 'Academic Year',
    passed: yearPassed,
    actualValue: student.year,
    requiredValue: drive.rules.minYear,
    message: yearPassed 
      ? `Year ${student.year} satisfies requirement` 
      : `Drive is for year ${drive.rules.minYear} and above`
  });

  const isEligible = passedCount === totalChecks;
  const score = (passedCount / totalChecks) * 100;

  return { isEligible, score, details };
};
