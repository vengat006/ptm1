
import React, { useState, useRef, useEffect } from 'react';
import { decodeBase64, decodeAudioData, initGeminiLive, encodeBase64 } from '../services/geminiService';
import { TranslationSet } from '../types';

interface MeetingRoomProps {
  role: 'PARENTS' | 'TEACHER';
  translations: TranslationSet;
  onEnd: (duration: number) => void;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ role, translations, onEnd }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [tempRoomId, setTempRoomId] = useState<string>('');
  const [isRoomReady, setIsRoomReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Generate a random room ID for the teacher
  useEffect(() => {
    if (role === 'TEACHER' && !roomId) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      setRoomId(`PTM-${rand}`);
    }
  }, [role]);

  const startMeeting = async () => {
    if (role === 'PARENTS' && (!tempRoomId || !tempRoomId.startsWith('PTM-'))) {
      setError(translations.invalidRoomId);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = initGeminiLive(
        async (base64Audio) => {
          if (!outAudioContextRef.current) return;
          const ctx = outAudioContextRef.current;
          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
          
          const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.start(nextStartTimeRef.current);
          nextStartTimeRef.current += audioBuffer.duration;
          sourcesRef.current.add(source);
          source.onended = () => sourcesRef.current.delete(source);
        },
        (text) => {
          setTranscription(prev => [...prev.slice(-4), text]);
        },
        `You are a friendly AI Moderator for a ${translations.title}. 
         You are facilitating a meeting in Room: ${role === 'TEACHER' ? roomId : tempRoomId}.
         Help the ${role === 'PARENTS' ? 'Parent' : 'Teacher'} discuss student progress. 
         Be supportive and professional.`
      );

      sessionRef.current = await sessionPromise;

      // Audio capture
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const l = inputData.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
        
        sessionRef.current?.sendRealtimeInput({
          media: {
            data: encodeBase64(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000'
          }
        });
      };
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      // Video frame capture
      const frameInterval = setInterval(() => {
        if (canvasRef.current && videoRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
          canvasRef.current.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                sessionRef.current?.sendRealtimeInput({
                  media: { data: base64, mimeType: 'image/jpeg' }
                });
              };
              reader.readAsDataURL(blob);
            }
          }, 'image/jpeg', 0.5);
        }
      }, 1000);

      (sessionRef.current as any)._frameInterval = frameInterval;
      (sessionRef.current as any)._stream = stream;

      setIsActive(true);
      setStartTime(Date.now());
      setIsRoomReady(true);
      setError(null);
    } catch (err) {
      console.error('Failed to start meeting:', err);
      setError('Could not access camera/microphone. Please check permissions.');
    }
  };

  const endMeeting = () => {
    if (sessionRef.current) {
      clearInterval(sessionRef.current._frameInterval);
      sessionRef.current._stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      sessionRef.current.close();
    }
    
    audioContextRef.current?.close();
    outAudioContextRef.current?.close();
    
    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    onEnd(duration);
    setIsActive(false);
    setIsRoomReady(false);
  };

  if (role === 'PARENTS' && !isRoomReady) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-[2rem] shadow-2xl border border-slate-100 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{translations.joinMeeting}</h2>
        <p className="text-slate-500 mb-8">{translations.enterRoomId}</p>
        
        <input 
          type="text" 
          value={tempRoomId}
          onChange={(e) => {
            setTempRoomId(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="PTM-XXXX"
          className="w-full text-center text-2xl tracking-widest font-mono p-4 rounded-2xl border border-slate-200 mb-2 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition"
        />
        {error && <p className="text-red-500 text-sm font-bold mb-4">{error}</p>}

        <button 
          onClick={startMeeting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transform transition active:scale-95 flex items-center justify-center gap-2"
        >
          {translations.submit}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
        {/* Video Area */}
        <div className="flex-1 bg-slate-900 relative">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse font-bold uppercase">
                LIVE
              </span>
              <span className="bg-slate-800/80 text-white text-xs px-2 py-1 rounded-full">
                {isActive ? translations.meetingActive : 'Standby'}
              </span>
            </div>
            {role === 'TEACHER' && roomId && (
              <div className="bg-indigo-600/90 text-white text-xs px-3 py-1.5 rounded-lg flex flex-col backdrop-blur-sm border border-indigo-400">
                <span className="opacity-70 text-[10px] uppercase font-bold">{translations.roomId}</span>
                <span className="font-mono font-black text-sm tracking-wider">{roomId}</span>
              </div>
            )}
            {role === 'PARENTS' && tempRoomId && (
              <div className="bg-emerald-600/90 text-white text-xs px-3 py-1.5 rounded-lg flex flex-col backdrop-blur-sm border border-emerald-400">
                <span className="opacity-70 text-[10px] uppercase font-bold">{translations.roomId}</span>
                <span className="font-mono font-black text-sm tracking-wider">{tempRoomId}</span>
              </div>
            )}
          </div>

          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
              <div className="text-center">
                {role === 'TEACHER' && (
                  <div className="mb-6 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                     <p className="text-indigo-200 text-xs font-bold uppercase mb-1">{translations.shareRoomId}</p>
                     <p className="text-white text-3xl font-mono font-black tracking-widest">{roomId}</p>
                  </div>
                )}
                <button 
                  onClick={startMeeting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transform transition active:scale-95 flex items-center gap-2 mx-auto"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  {role === 'TEACHER' ? translations.createMeeting : translations.startMeeting}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info & Transcript Area */}
        <div className="w-full md:w-80 bg-slate-50 border-l border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {translations.aiModerator}
            </h3>
            <p className="text-sm text-slate-500 mb-6 italic">
              "Hi! I'm here to assist your meeting."
            </p>
            
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {translations.transcription}
              </h4>
              <div className="bg-white border border-slate-200 rounded-lg p-3 h-48 overflow-y-auto space-y-2 text-sm text-slate-700">
                {transcription.length === 0 ? (
                  <p className="text-slate-300 italic">Waiting for conversation...</p>
                ) : (
                  transcription.map((text, i) => (
                    <p key={i} className="animate-fade-in">{text}</p>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {isActive && (
              <button 
                onClick={endMeeting}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                {translations.endMeeting}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
          <p className="text-xs text-indigo-400 font-semibold">{translations.role}</p>
          <p className="text-indigo-900 font-bold">{translations[role === 'PARENTS' ? 'parentsBtn' : 'teacherBtn']}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
          <p className="text-xs text-emerald-400 font-semibold">Status</p>
          <p className="text-emerald-900 font-bold">{isActive ? translations.meetingActive : 'Disconnected'}</p>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
