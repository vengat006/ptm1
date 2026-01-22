
import { TranslationSet, Language } from './types';

export const PASSWORDS = {
  TEACHER: '001',
  RECENT_ACTIVITY: '003'
};

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  en: {
    title: 'E-PTM Interactive Portal',
    subtitle: 'Connecting Parents and Teachers with AI-Powered Intelligence',
    parentsBtn: 'PARENTS',
    teacherBtn: 'TEACHER',
    activityBtn: 'RECENT ACTIVITY',
    enterPassword: 'Enter Access Password',
    submit: 'Enter',
    cancel: 'Cancel',
    startMeeting: 'Start Smart Session',
    endMeeting: 'End Meeting',
    meetingActive: 'Meeting in Progress',
    micActive: 'Microphone Active',
    camActive: 'Camera Active',
    transcription: 'Live Summary / Notes',
    recentActivityTitle: 'Meeting Logs & Activity',
    noActivity: 'No meetings recorded yet.',
    role: 'Participant Role',
    date: 'Date & Time',
    duration: 'Duration',
    accessDenied: 'Incorrect Password. Access Denied.',
    backToHome: 'Return to Dashboard',
    languageToggle: 'தமிழ்',
    aiModerator: 'AI Meeting Moderator',
    joinMeeting: 'Join Teacher Session',
    enterRoomId: 'Enter Meeting ID',
    roomId: 'Meeting ID',
    invalidRoomId: 'Please enter a valid Meeting ID (e.g. PTM-1234)',
    waitingForTeacher: 'Waiting for Teacher to start...',
    createMeeting: 'Create Meeting Room',
    shareRoomId: 'Share this ID with the parent'
  },
  ta: {
    title: 'இ-பெற்றோர் ஆசிரியர் சந்திப்பு',
    subtitle: 'பெற்றோர் மற்றும் ஆசிரியர்களை இணைக்கும் நவீன தளம்',
    parentsBtn: 'பெற்றோர்',
    teacherBtn: 'ஆசிரியர்',
    activityBtn: 'சமீபத்திய செயல்பாடுகள்',
    enterPassword: 'கடவுச்சொல்லை உள்ளிடவும்',
    submit: 'உள்நுழை',
    cancel: 'ரத்து செய்',
    startMeeting: 'சந்திப்பைத் தொடங்கு',
    endMeeting: 'சந்திப்பை முடி',
    meetingActive: 'சந்திப்பு நடைபெறுகிறது',
    micActive: 'ஒலிவாங்கி இயங்குகிறது',
    camActive: 'கேமரா இயங்குகிறது',
    transcription: 'நேரடி குறிப்புகள்',
    recentActivityTitle: 'சந்திப்பு விவரங்கள்',
    noActivity: 'இதுவரை பதிவுகள் எதுவும் இல்லை.',
    role: 'பங்கேற்பாளர்',
    date: 'தேதி மற்றும் நேரம்',
    duration: 'கால அளவு',
    accessDenied: 'தவறான கடவுச்சொல். அனுமதி மறுக்கப்பட்டது.',
    backToHome: 'முகப்புப் பக்கத்திற்குச் செல்லவும்',
    languageToggle: 'English',
    aiModerator: 'AI சந்திப்பு நடத்துனர்',
    joinMeeting: 'ஆசிரியர் சந்திப்பில் இணையுங்கள்',
    enterRoomId: 'சந்திப்பு ஐடியை உள்ளிடவும்',
    roomId: 'சந்திப்பு ஐடி',
    invalidRoomId: 'சரியான சந்திப்பு ஐடியை உள்ளிடவும் (எ.கா. PTM-1234)',
    waitingForTeacher: 'ஆசிரியர் தொடங்குவதற்காகக் காத்திருக்கிறது...',
    createMeeting: 'சந்திப்பு அறையை உருவாக்கு',
    shareRoomId: 'இந்த ஐடியைப் பெற்றோருடன் பகிர்ந்து கொள்ளுங்கள்'
  }
};
