/**
 * InvestmentCashflowCalculator — what an investment property costs a week, before and after the tax
 * deduction. Mirrors the website's Investment property cashflow tool. Validated against the site's
 * example ($650k · $130k dep · 6.25% · 30yr · $620pw · 2% vacancy · $4,500 costs · 7% mgmt · 37% tax
 * → ~$207/wk out, rent after vacancy $31,595, repayments $38,421, gross yield 4.96%). finance.ts.
 *
 * Not tax advice. Depreciation, capital works, ownership structure, land tax and CGT all change it.
 */
import * as React from 'react'
import { Building2, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { periodicRepayment, interestOverPeriods, aud0, aud2, pct2, toNum } from '@/components/calculators/finance'

const DEFAULTS = { price: 650000, deposit: 130000, rate: 6.25, term: 30, rent: 620, vacancy: 2, costs: 4500, mgmt: 7, tax: 37 }

export function InvestmentCashflowCalculator() {
  const [price, setPrice] = React.useState(DEFAULTS.price)
  const [deposit, setDeposit] = React.useState(DEFAULTS.deposit)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [rent, setRent] = React.useState(DEFAULTS.rent)
  const [vacancy, setVacancy] = React.useState(DEFAULTS.vacancy)
  const [costs, setCosts] = React.useState(DEFAULTS.costs)
  const [mgmt, setMgmt] = React.useState(DEFAULTS.mgmt)
  const [tax, setTax] = React.useState(DEFAULTS.tax)

  const loan = Math.max(0, price - deposit)
  const grossRentYr = rent * 52
  const grossYield = price > 0 ? (grossRentYr / price) * 100 : 0
  const rentAfterVacancy = grossRentYr * (1 - vacancy / 100)
  const monthly = periodicRepayment(loan, rate, term, 'monthly')
  const repaymentsYr = monthly * 12
  const mgmtFee = rentAfterVacancy * (mgmt / 100)
  const cashBeforeTax = rentAfterVacancy - repaymentsYr - mgmtFee - costs
  const interestYr = interestOverPeriods(loan, rate, monthly, 12, 12)
  const taxableIncome = rentAfterVacancy - interestYr - mgmtFee - costs
  const taxEffect = (taxableIncome * tax) / 100 // negative when it is a loss → a refund
  const afterTaxYr = cashBeforeTax - taxEffect
  const weekly = afterTaxYr / 52

  const reset = () => {
    setPrice(DEFAULTS.price); setDeposit(DEFAULTS.deposit); setRate(DEFAULTS.rate); setTerm(DEFAULTS.term)
    setRent(DEFAULTS.rent); setVacancy(DEFAULTS.vacancy); setCosts(DEFAULTS.costs); setMgmt(DEFAULTS.mgmt); setTax(DEFAULTS.tax)
  }

  return (
    <CalcShell
      Icon={Building2}
      title="Investment property cashflow"
      subtitle="What it costs a week, before and after tax."
      onReset={reset}
      note="This is not tax advice. Depreciation, capital works, ownership structure, land tax and CGT all change the answer."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Purchase price" value={String(price)} onChange={(e) => setPrice(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Deposit" value={String(deposit)} onChange={(e) => setDeposit(toNum(e.target.value))} hint={loan > 0 ? `Loan ${aud0(loan)}` : 'Deposit covers the price'} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Interest rate (p.a.)" value={String(rate)} onChange={(e) => setRate(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Rent a week" value={String(rent)} onChange={(e) => setRent(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.1} icon={Percent} label="Vacancy allowance" value={String(vacancy)} onChange={(e) => setVacancy(toNum(e.target.value, 100))} hint="Two per cent is about one week a year." />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Rates, insurance, strata a year" value={String(costs)} onChange={(e) => setCosts(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.1} icon={Percent} label="Property management" value={String(mgmt)} onChange={(e) => setMgmt(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} step={0.1} icon={Percent} label="Marginal tax rate" value={String(tax)} onChange={(e) => setTax(toNum(e.target.value, 100))} />
        </>
      }
      result={
        <>
          <ResultHeadline label="After tax, a week" display={aud2(Math.abs(weekly))} suffix={weekly < 0 ? 'out' : 'in'} />
          <MetricRow label="Rent after vacancy" figure={aud0(rentAfterVacancy)} />
          <MetricRow label="Loan repayments a year" figure={aud0(repaymentsYr)} />
          <MetricRow label="Management fee" figure={aud0(mgmtFee)} />
          <MetricRow label="Rates, insurance, strata" figure={aud0(costs)} />
          <MetricRow label="Cash position before tax" figure={aud0(cashBeforeTax)} hint="Out of pocket before any deduction." />
          <MetricRow label="Taxable loss" figure={aud0(Math.max(0, -taxableIncome))} hint="Interest is deductible; the principal portion of the repayment is not." />
          <MetricRow label="Gross yield" figure={pct2(grossYield)} />
        </>
      }
    />
  )
}
