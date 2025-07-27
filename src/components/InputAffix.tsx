"use client";
import { useId, useState, useCallback } from "react";

type Props = {
  id?: string;
  label: string;
  prefix?: string;
  suffix?: string;
  helper?: string;
  type?: string;
  inputMode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";
  readOnly?: boolean;
  value?: string | number;
  onChange?: (value: string | number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatCurrency?: boolean;
  formatPercent?: boolean;
  showStepper?: boolean;
  validationMessage?: string;
};

export default function InputAffix({
  id: propId,
  label,
  prefix,
  suffix,
  helper,
  type = "text",
  inputMode = "text",
  readOnly = false,
  value,
  onChange,
  min,
  max,
  step,
  formatCurrency = false,
  formatPercent = false,
  showStepper = false,
  validationMessage,
  ...props
}: Props) {
  const generatedId = useId();
  const id = propId || generatedId;
  const [isEditing, setIsEditing] = useState(false);

  // Enhanced number parsing with lenient input
  const parseValue = (str: string): number => {
    if (!str) return 0;
    
    // Remove all non-numeric characters except decimal point
    let cleaned = str.replace(/[^\d.-]/g, '');
    
    // Handle percentage input (e.g., "6.5%" -> 0.065)
    if (formatPercent && str.includes('%')) {
      cleaned = str.replace(/[^\d.-]/g, '');
      return Number(cleaned) / 100;
    }
    
    // Handle currency input (remove commas)
    if (formatCurrency) {
      cleaned = cleaned.replace(/,/g, '');
    }
    
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Enhanced formatting
  const formatValue = (val: number): string => {
    if (formatCurrency) {
      return val.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    if (formatPercent) {
      return (val * 100).toFixed(2);
    }
    return String(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    
    const rawValue = e.target.value;
    const parsedValue = parseValue(rawValue);
    
    // Validate min/max
    if (min !== undefined && parsedValue < min) return;
    if (max !== undefined && parsedValue > max) return;
    
    onChange(parsedValue);
  };

  const handleStepper = useCallback((direction: 'up' | 'down') => {
    if (!onChange || !step) return;
    
    const currentValue = typeof value === 'number' ? value : 0;
    const newValue = direction === 'up' ? currentValue + step : currentValue - step;
    
    // Validate min/max
    if (min !== undefined && newValue < min) return;
    if (max !== undefined && newValue > max) return;
    
    onChange(newValue);
  }, [onChange, value, step, min, max]);

  // Determine display value
  const getDisplayValue = (): string => {
    if (isEditing) {
      return typeof value === 'number' ? String(value) : String(value || '');
    }
    
    if (typeof value === 'number') {
      return formatValue(value);
    }
    
    return String(value || '');
  };

  const displayValue = getDisplayValue();

  return (
    <div className="field">
      <label htmlFor={id} className="label">{label}</label>
      {helper && <div id={`${id}-help`} className="help">{helper}</div>}
      <div className={`affix ${readOnly ? "readOnly" : ""}`}>
        {prefix && <span className="prefix" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          className="input"
          type={type}
          inputMode={inputMode}
          aria-describedby={[
            helper ? `${id}-help` : '',
            validationMessage ? `${id}-error` : ''
          ].filter(Boolean).join(' ')}
          aria-invalid={validationMessage ? 'true' : 'false'}
          aria-required={min !== undefined || max !== undefined}
          readOnly={readOnly}
          value={displayValue}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.currentTarget.blur();
            }
          }}
          style={{
            outline: 'none'
          }}
          onFocus={(e) => {
            setIsEditing(true);
            e.currentTarget.style.outline = '2px solid #3b82f6';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            setIsEditing(false);
            e.currentTarget.style.outline = 'none';
          }}
          {...props}
        />
        {suffix && <span className="suffix" aria-hidden="true">{suffix}</span>}
        
        {/* Stepper buttons */}
        {showStepper && !readOnly && (
          <div className="stepper" style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <button
              type="button"
              aria-label={`Increase ${label}`}
              onClick={() => handleStepper('up')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStepper('up');
                }
              }}
              style={{
                width: '20px',
                height: '20px',
                border: 'none',
                background: '#f3f4f6',
                color: '#6b7280',
                fontSize: '12px',
                cursor: 'pointer',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #3b82f6';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              ▲
            </button>
            <button
              type="button"
              aria-label={`Decrease ${label}`}
              onClick={() => handleStepper('down')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStepper('down');
                }
              }}
              style={{
                width: '20px',
                height: '20px',
                border: 'none',
                background: '#f3f4f6',
                color: '#6b7280',
                fontSize: '12px',
                cursor: 'pointer',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #3b82f6';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              ▼
            </button>
          </div>
        )}
      </div>
      {validationMessage && (
        <div 
          id={`${id}-error`}
          className="validation-error" 
          role="alert"
          aria-live="polite"
          style={{
            fontSize: '12px',
            color: '#dc2626',
            marginTop: '4px'
          }}
        >
          {validationMessage}
        </div>
      )}
    </div>
  );
} 