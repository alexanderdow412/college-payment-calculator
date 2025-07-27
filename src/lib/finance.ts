export type ProjectionInput = {
  annualCost: number;         // C0, Year 1 cost
  growthRate: number;         // g (e.g., 0.04)
  years: number;              // Y (decimal allowed)
};

export type OverrideAndCash = {
  totalOverride?: number;     // If provided, overrides projection
  cashUpfront?: number;       // Reduces borrowing
};

export type CapitalizationSettings = {
  accrueDuringSchool: boolean;
  apr: number;                // annual APR as decimal
  graceMonths: number;        // e.g., 0..6
};

export type LoanInput = {
  apr: number;                // annual APR as decimal
  termYears: number;          // repayment term in years
};

export type AmRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export function projectPerYearCosts({ annualCost, growthRate, years }: ProjectionInput): number[] {
  const fullYears = Math.floor(years);
  const fraction = years - fullYears;
  const rows: number[] = [];
  for (let y = 1; y <= fullYears; y++) {
    rows.push(annualCost * Math.pow(1 + growthRate, y - 1));
  }
  if (fraction > 0) {
    const lastFull = annualCost * Math.pow(1 + growthRate, fullYears);
    rows.push(lastFull * fraction);
  }
  return rows;
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function computeCapitalizedInterest(
  perYear: number[],
  years: number,
  settings: CapitalizationSettings
): number {
  const { accrueDuringSchool, apr, graceMonths } = settings;
  if (!accrueDuringSchool || apr <= 0) return 0;

  const fullYears = Math.floor(years);
  const fraction = years - fullYears;
  let capInt = 0;
  const graceYears = graceMonths / 12;

  // For each disbursement at start of academic year k (1-indexed)
  // time until repayment start:
  // t_k = (years - (k - 1)) + graceYears
  for (let k = 1; k <= perYear.length; k++) {
    const Dk = perYear[k - 1];
    // If the last entry is fractional, it's still disbursed at that start point
    const t_k = (years - (k - 1)) + graceYears;
    if (Dk > 0 && t_k > 0) {
      capInt += Dk * (Math.pow(1 + apr, t_k) - 1);
    }
  }
  return capInt;
}

export function monthlyPayment(principal: number, apr: number, termYears: number): number {
  const n = Math.max(Math.round(termYears * 12), 1);
  const r = apr / 12;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  const pow = Math.pow(1 + r, n);
  return principal * r * pow / (pow - 1);
}

export function amortizationSchedule(
  principal: number,
  apr: number,
  termYears: number
): AmRow[] {
  const n = Math.max(Math.round(termYears * 12), 1);
  const r = apr / 12;
  const rows: AmRow[] = [];
  if (principal <= 0) return rows;

  const M = monthlyPayment(principal, apr, termYears);
  let balance = principal;

  for (let m = 1; m <= n; m++) {
    const interest = r * balance;
    const principalPaid = Math.min(M - interest, balance);
    balance = Math.max(balance - principalPaid, 0);
    rows.push({
      month: m,
      payment: M,
      interest,
      principal: principalPaid,
      balance
    });
  }
  return rows;
}

export function calculateAll(
  projection: ProjectionInput,
  override: OverrideAndCash,
  cap: CapitalizationSettings,
  loan: LoanInput
) {
  const perYear = projectPerYearCosts(projection);
  const projectedTotal = sum(perYear);

  const totalCost = override.totalOverride && override.totalOverride > 0
    ? override.totalOverride
    : projectedTotal;

  const cash = Math.max(override.cashUpfront ?? 0, 0);
  const principalBeforeCap = Math.max(totalCost - cash, 0);

  const capInterest = computeCapitalizedInterest(perYear, projection.years, cap);
  const principal = principalBeforeCap + (cap.accrueDuringSchool ? capInterest : 0);

  const M = monthlyPayment(principal, loan.apr, loan.termYears);
  const schedule = amortizationSchedule(principal, loan.apr, loan.termYears);

  const totalPayments = schedule.reduce((a, r) => a + r.payment, 0);
  const totalInterest = totalPayments - principal;

  return {
    perYear,
    projectedTotal,
    totalCost,
    principalBeforeCap,
    capitalizedInterest: cap.accrueDuringSchool ? capInterest : 0,
    principal,
    monthlyPayment: M,
    totalPayments,
    totalInterest,
    schedule
  };
} 