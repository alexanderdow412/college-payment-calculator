"use client";
import { useId, useState, useCallback } from "react";

type Props = {
  id?: string;
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  formatCurrency?: boolean;
  formatPercent?: boolean;
  formatYears?: boolean;
};

export default function SliderInput({
  id: propId,
  label,
  prefix,
  suffix,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatCurrency = false,
  formatPercent = false,
  formatYears = false,
}: Props) {
  const generatedId = useId();
  const id = propId || generatedId;
  const [inputValue, setInputValue] = useState(String(value));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
    setInputValue(String(newValue));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const numValue = Number(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = Number(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(String(min));
      onChange(min);
    } else if (numValue > max) {
      setInputValue(String(max));
      onChange(max);
    } else {
      setInputValue(String(numValue));
      onChange(numValue);
    }
  };

  const formatDisplayValue = (val: number): string => {
    if (formatCurrency) {
      return `$${val.toLocaleString()}`;
    }
    if (formatPercent) {
      return `${val}%`;
    }
    if (formatYears) {
      return `${val} years`;
    }
    return String(val);
  };

  const formatRangeLabel = (val: number): string => {
    if (formatCurrency) {
      return `$${val.toLocaleString()}`;
    }
    if (formatPercent) {
      return `${val}%`;
    }
    return String(val);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <label htmlFor={id} style={{ 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#000' 
        }}>
          {label}
        </label>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#000' 
        }}>
          {formatDisplayValue(value)}
        </span>
      </div>
      
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: `linear-gradient(to right, #333 0%, #333 ${((value - min) / (max - min)) * 100}%, #e0e0e0 ${((value - min) / (max - min)) * 100}%, #e0e0e0 100%)`,
          outline: 'none',
          WebkitAppearance: 'none',
          appearance: 'none',
          marginBottom: '8px'
        }}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          const val = Number(target.value);
          const percentage = ((val - min) / (max - min)) * 100;
          target.style.background = `linear-gradient(to right, #333 0%, #333 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
        }}
      />
      
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #333;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #333;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: '12px', 
        color: '#666',
        marginBottom: '8px'
      }}>
        <span>{formatRangeLabel(min)}</span>
        <span>{formatRangeLabel(max)}</span>
      </div>
      
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#000',
          backgroundColor: 'white',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#333';
        }}
        onBlur={(e) => {
          handleInputBlur();
          e.target.style.borderColor = '#e0e0e0';
        }}
      />
    </div>
  );
} 