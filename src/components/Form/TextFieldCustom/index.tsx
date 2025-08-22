import TextField, { TextFieldProps } from '@mui/material/TextField'
import { useFormContext, Controller } from 'react-hook-form'
import NumberFormatCustomNegative from './components/NumberFormatCustomNegative'
import NumberFormatCustomWithoutNegative from './components/NumberFormatCustomWithoutNegative'
import NumberFormatIsOnlyNumber from './components/NumberFormatIsOnlyNumber'
import { ChangeEvent, ElementType } from 'react'
import { InputBaseComponentProps } from '@mui/material/InputBase'

type TextFieldCustom = {
  nameField: string
  isFormatNumber?: boolean
  isOnlyNumbers?: boolean
  isFormatNumberLessThanZero?: boolean
  onTextFieldChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
} & TextFieldProps

const TextFieldCustom = ({
  nameField,
  isFormatNumberLessThanZero = false,
  isOnlyNumbers = false,
  isFormatNumber = false,
  InputProps,
  onTextFieldChange,
  ...rest
}: TextFieldCustom) => {
  const { control } = useFormContext()

  const conditionFormatNumber = () => {
    // DÙNG KHI CHỈ MUỐN NHẬP SỐ
    if (isOnlyNumbers) {
      return NumberFormatIsOnlyNumber
    }

    // DÙNG KHI KHÔNG NHẬP SỐ NHỎ HƠN KHÔNG
    if (isFormatNumber) {
      return NumberFormatCustomWithoutNegative
    }

    // DÙNG KHI NHẬP SỐ NHỎ HƠN KHÔNG
    if (isFormatNumberLessThanZero) {
      return NumberFormatCustomNegative
    }
    return InputProps?.inputComponent
  }

  return (
    <>
      <Controller
        name={nameField}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <TextField
              {...field}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                field.onChange(event)
                if (onTextFieldChange) {
                  onTextFieldChange(event)
                }
              }}
              size='small'
              sx={{
                '& .MuiOutlinedInput-root': {
                  // TWO STYLE TO REMOVE THE ARROW OF INPUT NUMBER
                  '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                    display: 'none',
                    '-webkit-appearance': 'none'
                  },
                  '& input[type=number]': {
                    '-moz-appearance': 'textfield'
                  },
                  '& .Mui-disabled': {
                    color: '#888'
                  }
                },
                ...rest.sx
              }}
              fullWidth
              variant='outlined'
              helperText={error ? error.message : null}
              error={!!error}
              InputLabelProps={{
                shrink: true
              }}
              {...rest}
              InputProps={{
                ...InputProps,
                inputComponent: conditionFormatNumber() as ElementType<InputBaseComponentProps>
              }}
            />
          )
        }}
      />
    </>
  )
}

export default TextFieldCustom
