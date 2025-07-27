import { toCurrency } from "@/lib/format";

type Props = {
  label: string;
  value: number;
  hint?: string;
};

export default function ResultsCard({ label, value, hint }: Props) {
  const getCardStyle = (label: string) => {
    switch (label.toLowerCase()) {
      case 'projected total (before loan interest)':
        return {
          backgroundColor: '#FEE2E2',
          borderColor: '#EF4444',
          color: '#DC2626'
        };
      case 'monthly payment':
        return {
          backgroundColor: '#FFFBEB',
          borderColor: '#F59E0B',
          color: '#D97706'
        };
      case 'total interest':
        return {
          backgroundColor: '#ECFDF5',
          borderColor: '#10B981',
          color: '#059669'
        };
      case 'grand total (tuition cost + total interest)':
        return {
          backgroundColor: '#F5F3FF',
          borderColor: '#8B5CF6',
          color: '#7C3AED'
        };
      default:
        return {
          backgroundColor: '#F5F5F5',
          borderColor: '#9E9E9E',
          color: '#616161'
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
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderWidth: '1px',
        borderRadius: '8px',
        padding: '20px',
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
      <div className="kpi-label" style={{ color: cardStyle.color, fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{label}</div>
      <div className="kpi-value" style={{ color: cardStyle.color, fontSize: '24px', fontWeight: '600' }}>{toCurrency(Math.round(value))}</div>
      {hint && <div className="help mt-2" style={{ color: cardStyle.color }}>{hint}</div>}
    </div>
  );
} 