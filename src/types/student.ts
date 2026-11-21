export interface Student {
  id: number;
  name: string;
  course: string;
  age: number;
}

export interface StudentInput {
  name: string;
  course: string;
  age: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: StudentInput;
}

export function validateStudentInput(
  name: string,
  course: string,
  ageText: string
): ValidationResult {
  const trimmedName = name.trim();
  const trimmedCourse = course.trim();
  const trimmedAge = ageText.trim();

  if (!trimmedName) {
    return { valid: false, error: 'Please enter the student\'s name.' };
  }

  if (!trimmedCourse) {
    return { valid: false, error: 'Please enter the student\'s course.' };
  }

  if (!trimmedAge) {
    return { valid: false, error: 'Please enter the student\'s age.' };
  }

  const parsedAge = Number(trimmedAge);
  if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
    return {
      valid: false,
      error: 'Please enter a valid whole number age between 1 and 120.',
    };
  }

  return {
    valid: true,
    data: {
      name: trimmedName,
      course: trimmedCourse,
      age: parsedAge,
    },
  };
}
