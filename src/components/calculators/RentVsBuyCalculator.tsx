/**
 * RentVsBuyCalculator — the two financial paths over a period: buying (equity, net of repayments
 * and holding costs) versus renting (rent paid, with the deposit invested instead). Mirrors the
 * website's Rent vs buy tool. Validated against its example ($750k · $150k dep · 6.25% · $650pw ·
 * 4% growth · 7% return · 10yr → buying ahead ~$174k, value $1.11m, deposit invested $295k).
 *
 * Assumptions, stated: rent is held flat; holding costs are ~0.4% of the price a year; it compares
 * money only. Security of tenure, the freedom to move and what a home is for do not appear.
 */
import * as React from 'react'
import { Home, DollarSign, Percent, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CalcShell, ResultHeadline, MetricRow } from '@/components/calculators/CalcLayout'
import { periodicRepayment, balanceAfter, aud0, toNum } from '@/components/calculators/finance'

const DEFAULTS = { price: 750000, deposit: 150000, rate: 6.25, term: 30, rent: 650, growth: 4, invest: 7, over: 10 }
const HOLDING_PCT = 0.4 // of the price a year — the site's implied holding assumption

export function RentVsBuyCalculator() {
  const [price, setPrice] = React.useState(DEFAULTS.price)
  const [deposit, setDeposit] = React.useState(DEFAULTS.deposit)
  const [rate, setRate] = React.useState(DEFAULTS.rate)
  const [term, setTerm] = React.useState(DEFAULTS.term)
  const [rent, setRent] = React.useState(DEFAULTS.rent)
  const [growth, setGrowth] = React.useState(DEFAULTS.growth)
  const [invest, setInvest] = React.useState(DEFAULTS.invest)
  const [over, setOver] = React.useState(DEFAULTS.over)

  const loan = Math.max(0, price - deposit)
  const payment = periodicRepayment(loan, rate, term, 'monthly')
  const debtRemaining = balanceAfter(loan, rate, payment, 12, over * 12)
  const propValue = price * Math.pow(1 + growth / 100, over)
  const equity = propValue - debtRemaining
  const holdingYr = (price * HOLDING_PCT) / 100
  const costsPaid = payment * over * 12 + holdingYr * over
  const rentPaid = rent * 52 * over
  const depositInvested = deposit * Math.pow(1 + invest / 100, over)
  const buyingAhead = equity - costsPaid - depositInvested + rentPaid

  const reset = () => {
    setPrice(DEFAULTS.price); setDeposit(DEFAULTS.deposit); setRate(DEFAULTS.rate); setTerm(DEFAULTS.term)
    setRent(DEFAULTS.rent); setGrowth(DEFAULTS.growth); setInvest(DEFAULTS.invest); setOver(DEFAULTS.over)
  }

  return (
    <CalcShell
      Icon={Home}
      title="Rent vs buy"
      subtitle="Both paths over a period, deposit invested either way."
      onReset={reset}
      note="The answer swings hard on the growth and return assumptions, and neither is knowable. It compares money only."
      inputs={
        <>
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Property price" value={String(price)} onChange={(e) => setPrice(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Deposit" value={String(deposit)} onChange={(e) => setDeposit(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.01} icon={Percent} label="Interest rate (p.a.)" value={String(rate)} onChange={(e) => setRate(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Loan term (years)" value={String(term)} onChange={(e) => setTerm(toNum(e.target.value, 40))} />
          <Input type="number" inputMode="decimal" min={0} icon={DollarSign} label="Rent a week" value={String(rent)} onChange={(e) => setRent(toNum(e.target.value))} />
          <Input type="number" inputMode="decimal" min={0} step={0.1} icon={Percent} label="Property growth a year" value={String(growth)} onChange={(e) => setGrowth(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} step={0.1} icon={Percent} label="Return if invested instead" value={String(invest)} onChange={(e) => setInvest(toNum(e.target.value, 100))} />
          <Input type="number" inputMode="decimal" min={0} icon={Clock} label="Compare over (years)" value={String(over)} onChange={(e) => setOver(toNum(e.target.value, 40))} />
        </>
      }
      result={
        <>
          <ResultHeadline label={`After ${over} years`} display={`${buyingAhead >= 0 ? 'Buying' : 'Renting'} ahead by ${aud0(Math.abs(buyingAhead))}`} />
          <MetricRow label="Property value then" figure={aud0(propValue)} />
          <MetricRow label="Debt remaining" figure={aud0(debtRemaining)} />
          <MetricRow label="Equity" figure={aud0(equity)} />
          <MetricRow label="Repayments and holding costs paid" figure={aud0(costsPaid)} />
          <MetricRow label="Rent paid over the period" figure={aud0(rentPaid)} />
          <MetricRow label="Deposit if invested instead" figure={aud0(depositInvested)} hint="Holding costs assumed at ~0.4% of the price a year; rent held flat." />
        </>
      }
    />
  )
}
