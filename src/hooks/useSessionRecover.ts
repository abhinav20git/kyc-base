import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setConnectionState } from '@/store/slices/webrtcSlice';
import SessionManager from '@/utils/sessionManager';

export const useSessionRecovery = (webrtcService) => {
  const dispatch = useDispatch();
  const sessionManager = useRef(null);
  const session = useSelector((state:any) => state.session);
  const webrtc = useSelector((state:any) => state.webrtc);

  useEffect(() => {
    if (!sessionManager.current) {
      sessionManager.current = new SessionManager();
    }

    const handleReconnect = async () => {
      if (session.sessionStarted && webrtcService.current) {
        try {
          dispatch(setConnectionState('reconnecting'));
          await webrtcService.current.reconnect();
          sessionManager.current.resetReconnectionState();
        } catch (error) {
          console.error('Reconnection failed:', error);
          sessionManager.current.attemptReconnection();
        }
      }
    };

    window.addEventListener('reconnect-webrtc', handleReconnect);

    if (session.sessionStarted) {
      const isValidSession = sessionManager.current.checkForStaleSession();
      if (isValidSession) {
        sessionManager.current.startHeartbeat();
      }
    }

    return () => {
      window.removeEventListener('reconnect-webrtc', handleReconnect);
      if (sessionManager.current) {
        sessionManager.current.cleanup();
        sessionManager.current = null;
      }
    };
  }, [session.sessionStarted, dispatch]);

  useEffect(() => {
    if (session.sessionStarted) {
      sessionManager.current?.startHeartbeat();
    } else {
      sessionManager.current?.stopHeartbeat();
    }
  }, [session.sessionStarted]);

  return sessionManager.current;
};
