
export type Language = 'en' | 'ta';

export enum ModuleType {
  HOME = 'HOME',
  PARENTS = 'PARENTS',
  TEACHER = 'TEACHER',
  RECENT_ACTIVITY = 'RECENT_ACTIVITY'
}

export interface MeetingActivity {
  id: string;
  timestamp: number;
  role: 'PARENTS' | 'TEACHER';
  duration: number; // in seconds
  summary?: string;
}

export interface TranslationSet {
  title: string;
  subtitle: string;
  parentsBtn: string;
  teacherBtn: string;
  activityBtn: string;
  enterPassword: string;
  submit: string;
  cancel: string;
  startMeeting: string;
  endMeeting: string;
  meetingActive: string;
  micActive: string;
  camActive: string;
  transcription: string;
  recentActivityTitle: string;
  noActivity: string;
  role: string;
  date: string;
  duration: string;
  accessDenied: string;
  backToHome: string;
  languageToggle: string;
  aiModerator: string;
  joinMeeting: string;
  enterRoomId: string;
  roomId: string;
  invalidRoomId: string;
  waitingForTeacher: string;
  createMeeting: string;
  shareRoomId: string;
}
