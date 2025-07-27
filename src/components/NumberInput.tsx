"use client";
import { useId, useState } from "react";

type Props = {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string; // "$"
  suffix?: string; // "%"
  help?: string;
  formatCurrency?: boolean;
};

export default function NumberInput({
  label, value, onChange,
  min, max, step, prefix, suffix, help, formatCurrency = false
}: Props) {
  const id = useId();
  const [isEditing, setIsEditing] = useState(false);
  
  const formatValue = (val: number) => {
    if (formatCurrency) {
      return val.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    return String(val);
  };
  
  const parseValue = (str: string) => {
    if (formatCurrency) {
      return Number(str.replace(/,/g, ''));
    }
    return Number(str);
  };
  
  const displayValue = isEditing ? String(value) : formatValue(Number(value));
  
  return (
    <div className="field">
      <label htmlFor={id} className="label">{label}</label>
      {help && <div className="help">{help}</div>}
      <div className="affix">
        {prefix && <span className="prefix" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          className="input"
          type={formatCurrency ? "text" : "number"}
          inputMode="decimal"
          value={displayValue}
          min={min}
          max={max}
          step={step ?? "any"}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          onChange={(e) => onChange(parseValue(e.target.value))}
        />
        {suffix && <span className="suffix" aria-hidden="true">{suffix}</span>}
      </div>
    </div>
  );
} 