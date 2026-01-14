import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { setToken } from "../auth/token";
import { 
    useDispatch, 
    //useSelector 
} from "react-redux";
import { storeLogin, logout } from "../store/slices/UserSlice";
//import { useCheckLoginMutation } from "../api/userApi";
//import type { RootState } from "../store/store";
import { CircleLoader } from "react-spinners";
import Dashboard from "./Dashboard";
import { Alert, Button, Box, Typography } from "@mui/material";
import type { Session } from "@supabase/supabase-js";

const MAX_RETRIES = 3;
//const RETRY_DELAY = 2000; // 2 seconds

export default function AppAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  //const [checkLogin] = useCheckLoginMutation();
  //const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

//   const attemptCheckLogin = async (userId: string, userEmail: string, attempt: number = 1): Promise<any> => {
//     try {
//       console.log(`🔄 Checking login... (Attempt ${attempt}/${MAX_RETRIES})`);
      
//       const checkResult = await checkLogin({ userId, userEmail });
//       const res = (checkResult as any)?.data ?? checkResult;
      
//       // Check if there was an error in the response
//       if ((checkResult as any)?.error) {
//         throw new Error((checkResult as any)?.error?.message || 'Error checking login');
//       }

//       return res;
//     } catch (error: any) {
//       console.error(`❌ Attempt ${attempt} failed:`, error);
      
//       if (attempt < MAX_RETRIES) {
//         // Wait before retrying
//         await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
//         return attemptCheckLogin(userId, userEmail, attempt + 1);
//       } else {
//         // Max retries reached
//         throw new Error(`No se pudo verificar la sesión después de ${MAX_RETRIES} intentos. Por favor, recarga la página.`);
//       }
//     }
//   };

const handleSessionData = async (session: Session) => {
  try {
    setError(null);
    setRetryCount(0);

    setToken(session.access_token);
    
    //const res = await attemptCheckLogin(session.user.id, session.user.email);
    
    // const usage = res?.usage ?? { used: 0, limit: 100, remaining: 100 };
    // const plan = res?.plan ?? 'free';
    // const subscriptionId = res?.subscriptionId ?? null;

    dispatch(storeLogin({
      id: session.user.id,
      //name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || '',
      email: session.user.email || '',
      //role: res?.role || 'user',
      isLoggedIn: true,
      //usage,
      //plan,
      //subscriptionId
    }));

    // ✅ SOLO navegar si estamos en la página de login (/)
    // NO navegar en otras páginas como /payment-success, /planes, /draw, etc.
    if (location.pathname === '/login') {
      navigate("/", { replace: true });
    }

    return true;
  } catch (error: unknown) {
    console.error("❌ Error handling session:", error);
    const errorMessage = error instanceof Error ? error.message : 'Error al verificar la sesión';
    setError(errorMessage);
    return false;
  } finally {
    setIsLoading(false);
  }
};

  // AppAuth.tsx - en el useEffect principal
useEffect(() => {
  console.log('🔍 Current path:', location.pathname);
  console.log('🔍 Search params:', location.search);

  // Check for existing session on mount
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session) {
      await handleSessionData(session);
    } else {
      setIsLoading(false);
    }
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('🔔 Auth event:', event, 'Path:', location.pathname);

      if (event === "SIGNED_IN" && session) {
        setIsLoading(true);
        await handleSessionData(session);
      } 
      else if (event === "SIGNED_OUT") {
        dispatch(logout());
        navigate("/", { replace: true });
      }
      else if (event === "TOKEN_REFRESHED" && session) {
        setToken(session.access_token);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, [dispatch, navigate, location.pathname]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        await handleSessionData(session);
      } else {
        setError('No hay sesión activa');
        setIsLoading(false);
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigate("/", { replace: true });
  };

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <Dashboard>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            p: 4 
          }}
        >
          <CircleLoader color="#fff" />
          <Typography variant="body1" color="white">
            Verificando sesión{retryCount > 0 ? ` (Intento ${retryCount}/${MAX_RETRIES})` : ''}...
          </Typography>
        </Box>
      </Dashboard>
    );
  }

  // Show error message if login check failed
  if (error) {
    return (
      <Dashboard>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 3,
            p: 4,
            maxWidth: 500,
            margin: '0 auto'
          }}
        >
          <Alert 
            severity="error" 
            sx={{ width: '100%' }}
          >
            <Typography variant="h6" gutterBottom>
              Error de Conexión
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleRetry}
              sx={{ minWidth: 120 }}
            >
              Reintentar
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleLogout}
              sx={{ minWidth: 120 }}
            >
              Cerrar Sesión
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" textAlign="center">
            Si el problema persiste, intenta:
            <br />• Recargar la página
            <br />• Revisar tu conexión a internet
            <br />• Contactar a soporte
          </Typography>
        </Box>
      </Dashboard>
    );
  }

  return <Outlet />;
}