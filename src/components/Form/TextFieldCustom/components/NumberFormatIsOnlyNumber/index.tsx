import React from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { InputBaseComponentProps } from '@mui/material/InputBase'

interface NumberFormatIsOnlyNumberProps extends Omit<NumericFormatProps, 'onChange'> {
  onChange: (event: { target: { value: string } }) => void
}

const NumberFormatIsOnlyNumber = React.forwardRef<
  HTMLInputElement,
  NumberFormatIsOnlyNumberProps & InputBaseComponentProps
>(({ onChange, ...other }, ref) => {
  return (
    <NumericFormat
      getInputRef={ref}
      allowLeadingZeros
      onValueChange={values => {
        onChange &&
          onChange({
            target: {
              value: values.value
            }
          })
      }}
      valueIsNumericString={false}
      allowNegative={true}
      {...other}
    />
  )
})

export default NumberFormatIsOnlyNumber
