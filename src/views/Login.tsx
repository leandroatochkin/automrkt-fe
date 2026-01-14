import React from 'react';
import { 
    Paper, 
    Typography, 
    TextField, 
    Box, 
    InputAdornment, 
    OutlinedInput, 
    IconButton, 
    Button, 
    Link,
    CircularProgress,
    FormControl,
    FormHelperText
} from '@mui/material'
//import MailIcon from '@mui/icons-material/Mail';
import { useForm } from 'react-hook-form'
import { emailRegex, passwordRegex } from '../lib/regex';
import { useState} from 'react'
import { VisibilityOff, Visibility } from '@mui/icons-material';
//import { useMobile, useScrollNavigation } from '../../utils/hooks/hooks';
import type { UserLoginData } from '../api/userApi';
import { supabase } from '../lib/supabase';
import { 
    login, 
    signup, 
    googleLogin 
} from '../auth/auth';
import { notify } from '../lib/toast';
import { 
    useDispatch, 
    useSelector 
} from "react-redux";
import { storeLogin } from '../store/slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { setToken } from '../auth/token';
//import { useCheckLoginMutation } from '../../api/userApi';

//import ForgotPasswordDialog from '../../components/dialogs/ForgotPassword';





 const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    //const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [isLogin, setIsLogin] = useState<boolean>(true)
    //const [checkLogin] = useCheckLoginMutation();
    // const {
    //     handleSectionClick
    //   } = useScrollNavigation();
const {
    handleSubmit, 
    register,
    getValues, 
    formState: { errors }, 
} = useForm<UserLoginData>()

const dispatch = useDispatch();

//const isMobile = useMobile()

const navigate = useNavigate()

const handleResetPassword = () => navigate('/reset-password')

const theme = useSelector((state: RootState) => state.theme);

//const {mutate, isPending} = useLogIn()

const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

React.useEffect(() => {
  if (isLoggedIn) {
    navigate("/draw");
  }
}, [isLoggedIn]);


const onSubmit = async (data: UserLoginData) => {
  setLoading(true);



  try {
    let authData: any;
    let authError: any;
    

    if (isLogin) {
      const { data: loginData, error: loginError } = await login(data.email, data.password);
      authData = loginData;
      authError = loginError;
    } else if (!isLogin && data.password === data.repeatPassword) {
      const { data: signupData, error: signupError } = await signup(data.email, data.password);
      authData = signupData;
      authError = signupError;
    }

    // Handle errors
    if (authError) {
      console.error(authError);
      notify(isLogin ? "Error al iniciar sesión" : "Error al registrarse", "error");
      return; 
    }

    //const userId = authData.user?.id;
    //const userEmail = authData.user?.email;
    const accessToken = authData.session?.access_token;

    if (accessToken) {
      setToken(accessToken);            
    } else {
      console.warn("No access token returned from Supabase");
    }

    //const checkResult = await checkLogin({ userId, userEmail });
    //const res = (checkResult as any)?.data ?? checkResult;
    //const usage = res?.usage ?? 0;
    //const plan = res?.plan ?? null;
    //const subscriptionId = res?.subscriptionId ?? null


    dispatch(
      storeLogin({
        id: authData.user?.id,
        //name: authData.user?.email,
        email: authData.user?.email ?? data.email,
        isLoggedIn: true,
        //role: "user",
        //usage: usage,
        //plan: plan,
        //subscriptionId: subscriptionId
      })
    );

  } 
  catch(e){
    console.log(e)
  }
  finally {
    setLoading(false);
  }
};


  return (
    <>
    {/* {
        openForgotPasswordDialog && <ForgotPasswordDialog open={openForgotPasswordDialog} onClose={()=>setOpenForgotPasswordDialog(false)}/>
    } */}
    <Box
    aria-label="Sección de inicio de sesión"
    sx={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //mt: isMobile ? 10 : 0,
    }}
    >
        <Paper
            id='login'
            aria-label="Formulario de inicio de sesión"
            sx={{
                width: {
                    md: '30%',
                    xs: '86vw'
                },
                p: 2,
            }}
            >
        {
            !loading ? (
                <>
        <Box
        sx={{
          backgroundImage: 'url(/logo2.png)',
          backgroundPosition: 'center',
          height: '100px',
          width: '100%',
          borderRadius: 1,
          mb: 2
        }}
        >
      
        </Box>
        <Typography
        variant='h4'
        fontFamily={'PTSerif-Bold, sans-serif'}
        color={theme.colors.primary}
        textAlign='start'
        >
           {
            isLogin ? 'Iniciar sesión' : 'Registrate'
           }
        </Typography>
        <Typography
        textAlign='start'
        color='#333'
        >
        </Typography>
        <form
        onSubmit={handleSubmit(onSubmit)}
        >   
            {/*LOGIN*/}
            <Box
            sx={{
                mt: 2
            }}
            >
                <Typography
                fontWeight='bold'
                textAlign='start'
                color={theme.colors.primary}
                >
                    Email
                </Typography>
                <Box className="relative">
                    <TextField
                    fullWidth
                    id="login-identificationNumber"
                    type="text"
                    variant="outlined"
                    placeholder="Email"
                    {...register(`email`, { required: 'Campo requerido.', pattern: { value: emailRegex, message: 'Campo incorrecto.' } })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    />    
                </Box>
            </Box>
            {/*PASSWORD*/}
            <Box
            sx={{
                mt: 2
            }}
            >
                <Box>
                <Typography
                fontWeight='bold'
                textAlign='start'
                color={theme.colors.primary}
                >
                    Contraseña
                </Typography>
                </Box>
                <Box className="relative">
                    <FormControl fullWidth variant="outlined" error={!!errors.password}>
                        <OutlinedInput
                            id="login-password"
                            color="secondary"
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                            required: "Campo requerido",
                            ...(isLogin ? {} : {
                                pattern: {
                                    value: passwordRegex,
                                    message:
                                    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo",
                                },
                            }),
                            })}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label={
                                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                                onClick={() => setShowPassword(!showPassword)}
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />

                        <FormHelperText>
                            {errors.password?.message}
                        </FormHelperText>
                        </FormControl>

                </Box>
            </Box>
            {
                !isLogin &&
                 <Box
            sx={{
                mt: 2
            }}
            >
                <Box>
                <Typography
                fontWeight='bold'
                textAlign='start'
                color={theme.colors.primary}
                >
                    Repetir contraseña
                </Typography>
                </Box>
                <Box className="relative">
                        <FormControl fullWidth variant="outlined" error={!!errors.repeatPassword}>
                            <OutlinedInput
                                type={showPassword ? "text" : "password"}
                                {...register("repeatPassword", {
                                validate: {
                                    passwordsDontMatch: (value) =>
                                    value === getValues("password") || "Las contraseñas no coinciden"
                                }
                                })}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />

                            <FormHelperText>
                                {errors.repeatPassword?.message}
                            </FormHelperText>
                            </FormControl>

                        </Box>
                                    </Box>
            }
            <Button
            type='submit'
            variant='contained'
            sx={{
                background: theme.colors.primary,
                mt: 4
            }}
            fullWidth
            disabled={loading}
            >
                Iniciar sesión
            </Button>
            <Button
                  disabled={loading}
                  onClick={googleLogin}
                  variant='outlined'
                  sx={{
                    width: '100%',
                    mt: 2
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
				<path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
				<path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
				<path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
				<path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
			</svg>
                  <span
                  style={{
                    marginLeft: 10
                  }}
                  >
                    Ingresar con google
                  </span>
                </Button>
        <Link
          onClick={
            ()=>setIsLogin(!isLogin)
          }
          underline='none'
          fontFamily={'PTSerif-Bold, sans-serif'}
          sx={{
            color: theme.colors.text,
            textDecoration: 'none',
            '&:hover': {
              color: theme.colors.primary,
              cursor: 'pointer'
            },
          }}
          >
            {
                isLogin ? '¿No tenés una cuenta? Registrate' : '¿Ya tenés una cuenta? Logueate'
            }
          </Link>
          <Typography
          fontFamily={'PTSerif-Bold, sans-serif'}
          sx={{
            color: theme.colors.text
          }}
          variant={'body1'}
          aria-label='link para recuperar clave'
          >
            ¿Olvidaste tu contraseña? Hace click <Typography
                component="span"
                onClick={handleResetPassword}
                sx={{
                    fontWeight: 'bolder',
                    cursor: 'pointer',
                    '&:hover': {
                    color: theme.colors.primary,
                    textDecoration: 'underline',
                    },
                }}
                >
                acá
                </Typography>

          </Typography>
        </form>
        </>
            )
            :
            (
                <CircularProgress size={50} color='primary' />
            )
        }
        </Paper>
    </Box>
    </>
  )
}

export default Login