// URL state management for shareable scenarios
export interface CalculatorState {
  annualCost: number;
  growthRate: number;
  years: number;
  loanAPR: number;
  termYears: number;
}

export const DEFAULT_STATE: CalculatorState = {
  annualCost: 15000,
  growthRate: 0.04,
  years: 4,
  loanAPR: 0.065,
  termYears: 10
};

// Encode state to URL query string
export function encodeState(state: CalculatorState): string {
  const params = new URLSearchParams();
  
  // Round to reasonable precision for URL sharing
  params.set('cost', state.annualCost.toFixed(0));
  params.set('growth', (state.growthRate * 100).toFixed(1));
  params.set('years', state.years.toFixed(1));
  params.set('apr', (state.loanAPR * 100).toFixed(1));
  params.set('term', state.termYears.toFixed(0));
  
  return params.toString();
}

// Decode state from URL query string
export function decodeState(queryString: string): Partial<CalculatorState> {
  const params = new URLSearchParams(queryString);
  const state: Partial<CalculatorState> = {};
  
  const cost = params.get('cost');
  if (cost) {
    const parsed = parseFloat(cost);
    if (!isNaN(parsed) && parsed >= 0) {
      state.annualCost = parsed;
    }
  }
  
  const growth = params.get('growth');
  if (growth) {
    const parsed = parseFloat(growth) / 100;
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      state.growthRate = parsed;
    }
  }
  
  const years = params.get('years');
  if (years) {
    const parsed = parseFloat(years);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 10) {
      state.years = parsed;
    }
  }
  
  const apr = params.get('apr');
  if (apr) {
    const parsed = parseFloat(apr) / 100;
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      state.loanAPR = parsed;
    }
  }
  
  const term = params.get('term');
  if (term) {
    const parsed = parseFloat(term);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 30) {
      state.termYears = parsed;
    }
  }
  
  return state;
}

// Update URL with current state
export function updateURL(state: CalculatorState): void {
  if (typeof window === 'undefined') return;
  
  const queryString = encodeState(state);
  const newURL = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  
  // Use replaceState to avoid adding to browser history
  window.history.replaceState({}, '', newURL);
}

// Get current URL state
export function getURLState(): Partial<CalculatorState> {
  if (typeof window === 'undefined') return {};
  
  return decodeState(window.location.search);
}

// Copy current URL to clipboard
export async function copyShareableURL(state: CalculatorState): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const queryString = encodeState(state);
  const shareableURL = queryString 
    ? `${window.location.origin}${window.location.pathname}?${queryString}`
    : window.location.href;
  
  try {
    await navigator.clipboard.writeText(shareableURL);
    return true;
  } catch (error) {
    console.warn('Failed to copy URL:', error);
    return false;
  }
} 