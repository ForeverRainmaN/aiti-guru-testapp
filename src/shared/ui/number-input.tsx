import { ChevronDown, ChevronUp } from "lucide-react"
import { forwardRef, useCallback } from "react"
import { NumericFormat, type NumericFormatProps } from "react-number-format"
import { Button } from "./button"
import { Input } from "./input"

export interface NumberInputProps extends Omit<NumericFormatProps, "value" | "onValueChange"> {
  stepper?: number
  thousandSeparator?: string
  placeholder?: string
  min?: number
  max?: number
  value?: number | null
  suffix?: string
  prefix?: string
  onValueChange?: (value: number | undefined) => void
  fixedDecimalScale?: boolean
  decimalScale?: number
  hideStepper?: boolean
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      stepper,
      thousandSeparator,
      placeholder,
      min = -Infinity,
      max = Infinity,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix = "",
      prefix = "",
      value,
      hideStepper,
      ...props
    },
    ref
  ) => {
    const handleIncrement = useCallback(() => {
      if (value === undefined || value === null) {
        onValueChange?.(stepper ?? 1)
      } else {
        onValueChange?.(Math.min(value + (stepper ?? 1), max))
      }
    }, [stepper, max, value, onValueChange])

    const handleDecrement = useCallback(() => {
      if (value === undefined || value === null) {
        onValueChange?.(-(stepper ?? 1))
      } else {
        onValueChange?.(Math.max(value - (stepper ?? 1), min))
      }
    }, [stepper, min, value, onValueChange])

    const handleChange = (values: { value: string; floatValue: number | undefined }) => {
      onValueChange?.(values.floatValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault()
        handleIncrement()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        handleDecrement()
      }
    }

    const handleBlur = () => {
      if (value !== undefined && value !== null) {
        if (value < min) onValueChange?.(min)
        else if (value > max) onValueChange?.(max)
      }
    }

    return (
      <div className="flex items-center">
        <NumericFormat
          value={value ?? ""}
          onValueChange={handleChange}
          thousandSeparator={thousandSeparator ?? false}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          valueIsNumericString
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          suffix={suffix}
          prefix={prefix}
          customInput={Input}
          placeholder={placeholder}
          className="relative [appearance:textfield] rounded-r-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          getInputRef={ref}
          {...props}
        />
        {!hideStepper && (
          <div className="flex flex-col">
            <Button
              aria-label="Increase value"
              className="border-input h-5 rounded-l-none rounded-br-none border-b-[0.5px] border-l-0 px-2 focus-visible:relative"
              variant="outline"
              onClick={handleIncrement}
              disabled={value !== undefined && value !== null && value >= max}
              tabIndex={-1}
            >
              <ChevronUp size={15} />
            </Button>
            <Button
              aria-label="Decrease value"
              className="border-input h-5 rounded-l-none rounded-tr-none border-t-[0.5px] border-l-0 px-2 focus-visible:relative"
              variant="outline"
              onClick={handleDecrement}
              disabled={value !== undefined && value !== null && value <= min}
            >
              <ChevronDown size={15} />
            </Button>
          </div>
        )}
      </div>
    )
  }
)
