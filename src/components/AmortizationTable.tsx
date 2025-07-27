"use client";
import { useMemo } from 'react';

type AmortizationRow = {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
};

type Props = {
  principal: number;
  monthlyRate: number;
  totalPayments: number;
  monthlyPayment: number;
};

export default function AmortizationTable({ principal, monthlyRate, totalPayments, monthlyPayment }: Props) {
  const schedule = useMemo(() => {
    const rows: AmortizationRow[] = [];
    let remainingBalance = principal;

    for (let paymentNumber = 1; paymentNumber <= totalPayments; paymentNumber++) {
      const interest = remainingBalance * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      remainingBalance = Math.max(0, remainingBalance - principalPaid);

      rows.push({
        paymentNumber,
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        remainingBalance
      });
    }

    return rows;
  }, [principal, monthlyRate, totalPayments, monthlyPayment]);

  const exportToCSV = () => {
    const headers = ['Payment #', 'Payment', 'Principal', 'Interest', 'Remaining Balance'];
    const csvContent = [
      headers.join(','),
      ...schedule.map(row => [
        row.paymentNumber,
        row.payment.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.remainingBalance.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amortization-schedule.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Simple PDF export using window.print() for now
    // In a production app, you'd use a library like jsPDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Amortization Schedule</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              th { background-color: #f2f2f2; font-weight: bold; }
              h1 { color: #333; }
              .summary { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>Amortization Schedule</h1>
            <div class="summary">
              <p><strong>Loan Principal:</strong> $${principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p><strong>Monthly Payment:</strong> $${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p><strong>Total Payments:</strong> ${totalPayments}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Payment #</th>
                  <th>Payment</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                ${schedule.map(row => `
                  <tr>
                    <td>${row.paymentNumber}</td>
                    <td>$${row.payment.toFixed(2)}</td>
                    <td>$${row.principal.toFixed(2)}</td>
                    <td>$${row.interest.toFixed(2)}</td>
                    <td>$${row.remainingBalance.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <h3 style={{ fontWeight: '600', color: '#111827' }}>Amortization Schedule</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={exportToCSV}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              background: 'white',
              color: '#374151',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
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
            Export CSV
          </button>
          <button
            type="button"
            onClick={exportToPDF}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              background: 'white',
              color: '#374151',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
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
            Export PDF
          </button>
        </div>
      </div>

      <div style={{ 
        maxHeight: '300px', 
        overflowY: 'auto', 
        border: '1px solid #e5e7eb', 
        borderRadius: '6px',
        backgroundColor: 'white'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead style={{ 
            position: 'sticky', 
            top: 0, 
            backgroundColor: '#f9fafb',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <tr>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151',
                borderRight: '1px solid #e5e7eb'
              }}>
                Payment #
              </th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'right', 
                fontWeight: '600', 
                color: '#374151',
                borderRight: '1px solid #e5e7eb'
              }}>
                Payment
              </th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'right', 
                fontWeight: '600', 
                color: '#374151',
                borderRight: '1px solid #e5e7eb'
              }}>
                Principal
              </th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'right', 
                fontWeight: '600', 
                color: '#374151',
                borderRight: '1px solid #e5e7eb'
              }}>
                Interest
              </th>
              <th style={{ 
                padding: '12px 8px', 
                textAlign: 'right', 
                fontWeight: '600', 
                color: '#374151'
              }}>
                Remaining Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => (
              <tr key={row.paymentNumber} style={{ 
                backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center', 
                  borderRight: '1px solid #e5e7eb',
                  color: '#374151'
                }}>
                  {row.paymentNumber}
                </td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'right', 
                  borderRight: '1px solid #e5e7eb',
                  fontFamily: 'monospace',
                  color: '#059669'
                }}>
                  ${row.payment.toFixed(2)}
                </td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'right', 
                  borderRight: '1px solid #e5e7eb',
                  fontFamily: 'monospace',
                  color: '#2563eb'
                }}>
                  ${row.principal.toFixed(2)}
                </td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'right', 
                  borderRight: '1px solid #e5e7eb',
                  fontFamily: 'monospace',
                  color: '#dc2626'
                }}>
                  ${row.interest.toFixed(2)}
                </td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  color: '#374151'
                }}>
                  ${row.remainingBalance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 