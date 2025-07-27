import { toCurrency } from "@/lib/format";

type Props = {
  label: string;
  value: number;
  hint?: string;
};

export default function ResultsCard({ label, value, hint }: Props) {
  const getCardStyle = (label: string) => {
    switch (label.toLowerCase()) {
      case 'projected total':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          borderColor: '#16a34a',
          color: '#15803d'
        };
      case 'monthly payment':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: '#2563eb',
          color: '#1e40af'
        };
      case 'total interest':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderColor: '#dc2626',
          color: '#b91c1c'
        };
      default:
        return {
          backgroundColor: 'rgba(107, 114, 128, 0.15)',
          borderColor: '#4b5563',
          color: '#1f2937'
        };
    }
  };

  const cardStyle = getCardStyle(label);

  return (
    <div 
      className="kpi"
      role="region"
      aria-label={`${label}: ${toCurrency(Math.round(value))}`}
      tabIndex={0}
      style={{
        backgroundColor: cardStyle.backgroundColor,
        borderColor: cardStyle.borderColor,
        boxShadow: `0 8px 25px ${cardStyle.borderColor}30`,
        borderWidth: '2px',
        borderRadius: '12px',
        padding: '24px',
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
      <div className="kpi-label" style={{ color: cardStyle.color, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>{label}</div>
      <div className="kpi-value" style={{ color: cardStyle.color, fontSize: '28px', fontWeight: '700' }}>{toCurrency(Math.round(value))}</div>
      {hint && <div className="help mt-2" style={{ color: cardStyle.color }}>{hint}</div>}
    </div>
  );
} 