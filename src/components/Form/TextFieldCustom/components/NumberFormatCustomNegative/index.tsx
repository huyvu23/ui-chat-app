import React from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

interface NumberFormatCustomNegativeProps extends Omit<NumericFormatProps, 'onChange'> {
  onChange: (event: { target: { value: string } }) => void
}

const NumberFormatCustomNegative = (props: NumberFormatCustomNegativeProps) => {
  const { onChange, ...other } = props

  return (
    <NumericFormat
      allowNegative
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
}

export default NumberFormatCustomNegative
