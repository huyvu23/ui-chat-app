import { createTheme, Theme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

const COLOR_BORDER = '#e2e8f1'
const COLOR_ERROR = '#f44336'
const COLOR_PRIMARY = '#1976d2'

// Create a theme instance.
const theme: Theme = createTheme({
  // colorSchemes: {
  //   light: {},
  //   dark: {}
  // }

  palette: {
    mode: 'light',
    primary: {
      main: COLOR_PRIMARY
    },
    background: {
      default: 'white'
    }
  },
  typography: {
    fontFamily: 'var(--font-roboto)'
  },
  components: {
    // Name of the component
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '0 24px 16px 24px !important'
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderWidth: '1px 1px 0 1px',
          borderColor: COLOR_BORDER
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: COLOR_BORDER,
          borderBottomWidth: '1px'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          borderRadius: '5px',
          borderWidth: '0.5px'
        }
      }
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: COLOR_PRIMARY,
          fontSize: '0.96rem',
          fontWeight: 'bold'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '& .MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: `${COLOR_ERROR} !important`
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: grey[300] + ' !important'
            },
            '&.Mui-focused fieldset': {
              borderColor: `${COLOR_PRIMARY} !important`
            }
          },
          '& .MuiOutlinedInput-root.Mui-error fieldset': {
            borderColor: `${COLOR_ERROR} !important`
          },
          '& .MuiInputLabel-root.Mui-error': {
            color: COLOR_ERROR
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '5px !important',
          fontSize: '0.875rem',
          '& fieldset': {
            borderWidth: '0.5px !important'
          },
          '&:hover fieldset': {
            borderWidth: '1px !important'
          },
          '&.Mui-focused fieldset': {
            borderWidth: '1px !important'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e2e8f1 !important'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e2e8f1 !important'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e2e8f1 !important'
          }
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white',
            borderRadius: '8px'
          }
        }
      }
    }
  }
})

export default theme
