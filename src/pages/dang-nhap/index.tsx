import { useState } from 'react'
import FormWrapper from '@/components/Form/FormWrapper'
import TextFieldCustom from '@/components/Form/TextFieldCustom'
import { yupResolver } from '@hookform/resolvers/yup'
import { string, object, ObjectSchema } from 'yup'
import { useRouter } from 'next/navigation'
import { useSnackbar } from 'notistack'
import useAuth from '@/store/useAuth'
import { useForm, UseFormReturn } from 'react-hook-form'

// MUI IMPORT
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

// ICON
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

// SERVICE
import { TFormLogin } from '@/service/AuthService/type'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px'
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px'
}))

const TRANSITION_DURATION = '0.4s'

function SignIn() {
  const router = useRouter()
  const { setLoginData } = useAuth()

  const { enqueueSnackbar } = useSnackbar()
  // STATE
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleToggleShowPassword = (): void => {
    setIsShowPassword(!isShowPassword)
  }

  const schema: ObjectSchema<TFormLogin> = object({
    username: string().required('Trường bắt buộc'),
    password: string().required('Trường bắt buộc')
  })

  const methods: UseFormReturn<TFormLogin> = useForm({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: yupResolver(schema)
  })

  const handleSubmit = async (data: TFormLogin): Promise<void> => {
    try {
      setIsLoading(true)

      // const response = await login(payload)
      // setLoginData(response.data)
      // enqueueSnackbar('Đăng nhập thành công', { variant: 'success' })
      // router.push('/quan-ly-don-hang-quoc-te')
    } catch (error) {
      enqueueSnackbar((error as any)?.error?.message || 'Đã có nỗi xảy ra !', {
        variant: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Box
        sx={{
          width: { xs: '100%', md: '50vw' },
          transition: `width ${TRANSITION_DURATION}`,
          transitionDelay: `calc(${TRANSITION_DURATION} + 0.1s)`,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                zIndex: -1,
                inset: 0,
                backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                backgroundRepeat: 'no-repeat'
              }
            }}
          >
            <Card>
              <FormWrapper methods={methods} onSubmit={handleSubmit}>
                <Stack rowGap={4}>
                  <Typography component='h1' variant='h6' sx={{ width: '100%' }}>
                    Chào mừng quay trở lại
                  </Typography>
                  <TextFieldCustom nameField='username' label='Tài khoản' placeholder='Nhập tài khoản' />
                  <TextFieldCustom
                    type={isShowPassword ? 'text' : 'password'}
                    nameField='password'
                    label='Mật khẩu'
                    placeholder='Nhập mật khẩu'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label={isShowPassword ? 'hide the password' : 'display the password'}
                            onClick={handleToggleShowPassword}
                            edge='end'
                          >
                            {isShowPassword ? (
                              <Visibility
                                sx={{
                                  fontSize: '1.2rem'
                                }}
                              />
                            ) : (
                              <VisibilityOff
                                sx={{
                                  fontSize: '1.2rem'
                                }}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <LoadingButton loading={isLoading} variant='contained' type='submit' color='primary'>
                    Đăng nhập
                  </LoadingButton>

                  <Link
                    component='button'
                    type='button'
                    onClick={() => {
                      console.log('click')
                    }}
                    variant='body2'
                    sx={{ alignSelf: 'center' }}
                  >
                    Quên mật khẩu ?
                  </Link>
                </Stack>
              </FormWrapper>
            </Card>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition: `background-image ${TRANSITION_DURATION}, left ${TRANSITION_DURATION} !important`,
          transitionDelay: `calc(${TRANSITION_DURATION} + 0.1s)`,
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: 'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)'
        }}
      />
    </>
  )
}

export default SignIn
