import React from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { InputBaseComponentProps } from '@mui/material/InputBase'

interface NumberFormatCustomWithoutNegativeProps extends Omit<NumericFormatProps, 'onChange'> {
  onChange: (event: { target: { value: string } }) => void
}

const NumberFormatCustomWithoutNegative = React.forwardRef<
  HTMLInputElement,
  NumberFormatCustomWithoutNegativeProps & InputBaseComponentProps
>(({ onChange, ...other }, ref) => {
  return (
    <NumericFormat
      getInputRef={ref}
      allowNegative={false}
      thousandSeparator
      {...other}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        })
      }}
    />
  )
})

export default NumberFormatCustomWithoutNegative
