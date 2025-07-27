"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import InputAffix from "@/components/InputAffix";
import ResultsCard from "@/components/ResultsCard";
import BarChart from "@/components/BarChart";
import AmortizationTable from "@/components/AmortizationTable";
import { DEFAULT_STATE, getURLState, updateURL, copyShareableURL, type CalculatorState } from "@/lib/urlState";
import { calculateAll } from "@/lib/finance";
import { toCurrency, toPercent } from "@/lib/format";

export default function Page() {
  // Load initial state from URL, localStorage, or defaults
  const getInitialState = (): CalculatorState => {
    if (typeof window !== 'undefined') {
      // First try URL parameters
      const urlState = getURLState();
      if (Object.keys(urlState).length > 0) {
        return { ...DEFAULT_STATE, ...urlState };
      }
      
      // Then try localStorage
      const saved = localStorage.getItem('collegeCalculator');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_STATE, ...parsed };
        } catch (e) {
          console.warn('Failed to parse saved values:', e);
        }
      }
    }
    return DEFAULT_STATE;
  };

  const initialState = getInitialState();
  const [annualCost, setAnnualCost] = useState<number>(initialState.annualCost);
  const [growthRate, setGrowthRate] = useState<number>(initialState.growthRate);
  const [years, setYears] = useState<number>(initialState.years);
  const [loanAPR, setLoanAPR] = useState<number>(initialState.loanAPR);
  const [termYears, setTermYears] = useState<number>(initialState.termYears);



  // Share current scenario function
  const shareScenario = useCallback(async () => {
    const currentState = {
      annualCost,
      growthRate,
      years,
      loanAPR,
      termYears
    };
    
    const success = await copyShareableURL(currentState);
    if (success) {
      // You could add a toast notification here
      alert('Shareable URL copied to clipboard!');
    } else {
      alert('Failed to copy URL. Please try again.');
    }
  }, [annualCost, growthRate, years, loanAPR, termYears]);

  // Update URL when state changes
  useEffect(() => {
    const currentState = {
      annualCost,
      growthRate,
      years,
      loanAPR,
      termYears
    };
    updateURL(currentState);
  }, [annualCost, growthRate, years, loanAPR, termYears]);

  // Debounced state for calculations
  const [debouncedAnnualCost, setDebouncedAnnualCost] = useState<number>(15000);
  const [debouncedGrowthRate, setDebouncedGrowthRate] = useState<number>(0.04);
  const [debouncedYears, setDebouncedYears] = useState<number>(4);
  const [debouncedLoanAPR, setDebouncedLoanAPR] = useState<number>(0.065);
  const [debouncedTermYears, setDebouncedTermYears] = useState<number>(10);

  // Debounce effect for annual cost
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedAnnualCost(annualCost), 250);
    return () => clearTimeout(timer);
  }, [annualCost]);

  // Debounce effect for growth rate
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedGrowthRate(growthRate), 250);
    return () => clearTimeout(timer);
  }, [growthRate]);

  // Debounce effect for years
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedYears(years), 250);
    return () => clearTimeout(timer);
  }, [years]);

  // Debounce effect for loan APR
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedLoanAPR(loanAPR), 250);
    return () => clearTimeout(timer);
  }, [loanAPR]);

  // Debounce effect for term years
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTermYears(termYears), 250);
    return () => clearTimeout(timer);
  }, [termYears]);

  const result = useMemo(() => {
    return calculateAll(
      { annualCost: debouncedAnnualCost, growthRate: debouncedGrowthRate, years: debouncedYears },
      { cashUpfront: 0 },
      { accrueDuringSchool: false, apr: debouncedLoanAPR, graceMonths: 0 },
      { apr: debouncedLoanAPR, termYears: debouncedTermYears }
    );
  }, [debouncedAnnualCost, debouncedGrowthRate, debouncedYears, debouncedLoanAPR, debouncedTermYears]);

  const perYear = result.perYear.map((c, i) => ({
    year: i + 1,
    cost: c
  }));

  return (
    <>
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        style={{
          position: 'absolute',
          top: '-40px',
          left: '6px',
          background: '#3b82f6',
          color: 'white',
          padding: '8px 16px',
          textDecoration: 'none',
          borderRadius: '4px',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: '500'
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = '6px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = '-40px';
        }}
      >
        Skip to main content
      </a>
      
      <main 
        id="main-content"
        style={{ 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '24px',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af', marginBottom: '16px' }}>College Payment Calculator</h1>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Project your total college cost and loan payments. Adjust assumptions and see results instantly.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          <section style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '32px', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '12px'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#111827'
              }}>Inputs</h2>
              
              <button
                type="button"
                onClick={shareScenario}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #10b981',
                  borderRadius: '6px',
                  background: '#10b981',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #059669';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
              >
                Share
              </button>
            </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* College Costs Section */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                  College Costs
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <InputAffix
                    id="firstYear"
                    label="First-year cost"
                    prefix="$"
                    inputMode="decimal"
                    value={annualCost}
                    onChange={(value) => setAnnualCost(Number(value))}
                    min={0}
                    step={100}
                    formatCurrency={true}
                    showStepper={true}
                    validationMessage={annualCost < 0 ? "Cost cannot be negative" : undefined}
                  />
                  <InputAffix
                    id="increase"
                    label="Annual increase rate"
                    prefix="%"
                    inputMode="decimal"
                    value={growthRate}
                    onChange={(value) => setGrowthRate(Number(value))}
                    min={0}
                    max={0.2}
                    step={0.001}
                    formatPercent={true}
                    showStepper={true}
                    validationMessage={growthRate < 0 ? "Rate cannot be negative" : growthRate > 0.2 ? "Rate cannot exceed 20%" : undefined}
                  />
                                                  <InputAffix
                                  id="duration"
                                  label="Expected Years in College"
                                  type="number"
                                  inputMode="numeric"
                                  value={years}
                                  onChange={(value) => setYears(Number(value))}
                                  min={0.5}
                                  max={10}
                                  step={0.5}
                                  showStepper={true}
                                  validationMessage={years < 0.5 ? "Years must be at least 0.5" : years > 10 ? "Years cannot exceed 10" : undefined}
                                />
                </div>
              </div>

              {/* Loan Terms Section */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                  Loan Terms
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <InputAffix
                    id="apr"
                    label="APR (%)"
                    prefix="%"
                    helper="Enter as percent; we accept 6.5 or 6.5%."
                    value={loanAPR}
                    onChange={(value) => setLoanAPR(Number(value))}
                    min={0}
                    max={0.3}
                    step={0.001}
                    formatPercent={true}
                    showStepper={true}
                    validationMessage={loanAPR < 0 ? "Rate cannot be negative" : loanAPR > 0.3 ? "Rate cannot exceed 30%" : undefined}
                  />
                  <InputAffix
                    id="term"
                    label="Loan term"
                    type="number"
                    inputMode="numeric"
                    value={termYears}
                    onChange={(value) => setTermYears(Number(value))}
                    min={1}
                    max={30}
                    step={1}
                    showStepper={true}
                    validationMessage={termYears < 1 ? "Term must be at least 1 year" : termYears > 30 ? "Term cannot exceed 30 years" : undefined}
                  />
                </div>
              </div>


            </div>
        </section>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Results Section */}
            <section style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '32px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#111827', 
                marginBottom: '24px',
                borderBottom: '2px solid #10b981',
                paddingBottom: '12px'
              }}>Results</h2>

              <div 
                role="region" 
                aria-live="polite" 
                aria-label="Calculation results"
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <ResultsCard label="Projected total (before loan interest)" value={result.projectedTotal} />
                <ResultsCard label="Monthly payment" value={result.monthlyPayment} />
                <ResultsCard label="Total interest" value={result.totalInterest} />
                <ResultsCard label="Grand Total (Tuition cost + Total Interest)" value={result.projectedTotal + result.totalInterest} />
              </div>
            </section>

            {/* Breakdown Section */}
            <section style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '32px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#111827', 
                marginBottom: '24px',
                borderBottom: '2px solid #f59e0b',
                paddingBottom: '12px'
              }}>Breakdown</h2>

              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                <BarChart data={perYear} />
              </div>
              
              <AmortizationTable 
                principal={result.projectedTotal}
                monthlyRate={debouncedLoanAPR / 12}
                totalPayments={debouncedTermYears * 12}
                monthlyPayment={result.monthlyPayment}
              />
            </section>
                      </div>
          </div>
        </div>
      </div>
      
      {/* Assumptions footnote */}
      <div style={{
        maxWidth: '1280px',
        margin: '32px auto 0',
        padding: '0 24px'
      }}>
        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '16px',
          fontSize: '12px',
          color: '#6b7280',
          lineHeight: '1.5'
        }}>
          <strong>Assumptions:</strong> Interest compounds monthly. Origination fees, late fees, and other loan costs are excluded. 
          Results are estimates and may vary based on actual loan terms and conditions.
        </div>
      </div>
      </main>
    </>
  );
} 