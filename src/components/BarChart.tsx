import { useState, useEffect } from 'react';

type BarChartProps = {
  data: Array<{
    year: number;
    cost: number;
  }>;
};

export default function BarChart({ data }: BarChartProps) {
  const maxCost = Math.max(...data.map(d => d.cost));
  const minCost = 0; // Always start at 0 for better visualization
  const roundedMax = Math.ceil(maxCost / 5000) * 5000; // Round up to next $5k
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Generate grid lines with explicit ticks including 0
  const gridLines = [];
  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const value = minCost + (roundedMax - minCost) * (i / numGridLines);
    gridLines.push(value);
  }

  return (
    <div 
      style={{ width: '100%', position: 'relative' }}
      role="img"
      aria-label="College cost breakdown by year"
    >




      {/* Bars */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        gap: '12px', 
        height: '160px', 
        marginLeft: '0',
        marginBottom: '0',
        position: 'relative'
      }}>
        {data.map((item) => (
          <div key={item.year} style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            position: 'relative',
            cursor: 'pointer'
          }}>
            {/* Tooltip (desktop) or Data Label (mobile) */}
            <div style={{
              position: 'absolute',
              top: `${Math.max(0, 180 - (item.cost / maxCost) * 160 - 40)}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: isSmallScreen ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
              color: isSmallScreen ? '#374151' : 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              opacity: isSmallScreen ? '1' : '0',
              transition: 'opacity 0.2s ease',
              pointerEvents: isSmallScreen ? 'auto' : 'none',
              zIndex: 10,
              boxShadow: isSmallScreen ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
            }} className="tooltip">
              <div style={{ fontSize: '10px', marginBottom: '2px' }}>Year {item.year}</div>
              <div style={{ fontWeight: '600' }}>
                ${item.cost.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
            </div>

            {/* Bar */}
            <div
              role="button"
              tabIndex={0}
              aria-label={`Year ${item.year}: $${item.cost.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}`}
              style={{
                width: '70%',
                height: `${(item.cost / roundedMax) * 160}px`,
                background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '6px 6px 0 0',
                minHeight: '20px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                position: 'relative',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={!isSmallScreen ? (e) => {
                const tooltip = e.currentTarget.parentElement?.querySelector('.tooltip') as HTMLElement;
                if (tooltip) tooltip.style.opacity = '1';
              } : undefined}
              onMouseLeave={!isSmallScreen ? (e) => {
                const tooltip = e.currentTarget.parentElement?.querySelector('.tooltip') as HTMLElement;
                if (tooltip) tooltip.style.opacity = '0';
              } : undefined}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #3b82f6';
                e.currentTarget.style.outlineOffset = '2px';
                const tooltip = e.currentTarget.parentElement?.querySelector('.tooltip') as HTMLElement;
                if (tooltip) tooltip.style.opacity = '1';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
                const tooltip = e.currentTarget.parentElement?.querySelector('.tooltip') as HTMLElement;
                if (tooltip) tooltip.style.opacity = '0';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Announce the value to screen readers
                  const announcement = `Year ${item.year}: $${item.cost.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}`;
                  // Create a temporary element to announce
                  const announcer = document.createElement('div');
                  announcer.setAttribute('aria-live', 'polite');
                  announcer.setAttribute('aria-atomic', 'true');
                  announcer.style.position = 'absolute';
                  announcer.style.left = '-10000px';
                  announcer.style.width = '1px';
                  announcer.style.height = '1px';
                  announcer.style.overflow = 'hidden';
                  announcer.textContent = announcement;
                  document.body.appendChild(announcer);
                  setTimeout(() => document.body.removeChild(announcer), 100);
                }
              }}
            >
              {/* Value inside bar */}
              <span style={{
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                textAlign: 'center',
                lineHeight: '1',
                whiteSpace: 'nowrap'
              }}>
                ${item.cost.toLocaleString(undefined, { 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: 0 
                })}
              </span>
            </div>

            {/* Year label */}
            <div style={{ 
              marginTop: '4px', 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#374151',
              textAlign: 'center'
            }}>
              Year {item.year}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
} 