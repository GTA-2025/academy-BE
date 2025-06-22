export enum UserRole {
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
}

export enum OnboardingStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  onboardingStatus: OnboardingStatus;
  // Add other user properties as needed
}
