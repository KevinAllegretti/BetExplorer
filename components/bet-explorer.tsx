"use client"

import React, { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from 'lucide-react'

const decimalToAmerican = (decimal: number): string => {
  if (decimal >= 2) {
    return `+${Math.round((decimal - 1) * 100)}`
  } else {
    return `-${Math.round(100 / (decimal - 1))}`
  }
}

const americanToDecimal = (american: string): number => {
  const odds = parseInt(american)
  return odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1
}

const pastBets = [
  { id: 1, game: "Packers vs Bears", bet: "Aaron Rodgers over 2.5 TD passes", odds: "+140", commenceTime: "2023-09-10T20:00:00Z", streak: 3 },
  { id: 2, game: "Chiefs vs Raiders", bet: "Patrick Mahomes over 300.5 passing yards", odds: "-115", commenceTime: "2023-09-10T20:30:00Z" },
  { id: 3, game: "Cowboys vs Eagles", bet: "Ezekiel Elliott over 75.5 rushing yards", odds: "+105", commenceTime: "2023-09-10T21:00:00Z", streak: 2 },
  { id: 4, game: "Rams vs 49ers", bet: "Cooper Kupp over 7.5 receptions", odds: "-130", commenceTime: "2023-09-11T00:20:00Z" },
  { id: 5, game: "Bills vs Patriots", bet: "Josh Allen over 40.5 rushing yards", odds: "+100", commenceTime: "2023-09-11T17:00:00Z", streak: 4 },
]

const calculateTotalOdds = (bets: typeof pastBets): number => {
  return bets.reduce((total, bet) => total * americanToDecimal(bet.odds), 1)
}

export default function BetExplorer() {
  const [legCount, setLegCount] = useState(3)
  const [parlayType, setParlayType] = useState('multiple')
  const [stake, setStake] = useState('')

  const sortedBets = useMemo(() => {
    return [...pastBets].sort((a, b) => americanToDecimal(b.odds) - americanToDecimal(a.odds))
  }, [])

  const selectedBets = sortedBets.slice(0, legCount)
  const totalOdds = calculateTotalOdds(selectedBets)
  const americanTotalOdds = decimalToAmerican(totalOdds)

  const handleLegCountChange = (value: string) => {
    setLegCount(parseInt(value))
  }

  const handleParlayTypeChange = (value: string) => {
    setParlayType(value)
  }

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStake(e.target.value)
  }

  const calculateWinnings = (stake: string, odds: number): string => {
    const stakeAmount = parseFloat(stake)
    if (isNaN(stakeAmount)) return '0.00'
    return (stakeAmount * odds - stakeAmount).toFixed(2)
  }

  const formatMoney = (amount: string): string => {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatCommenceTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      timeZone: 'UTC',
      timeZoneName: 'short' 
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Highest Payout Parlay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Select onValueChange={handleLegCountChange} value={legCount.toString()}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select legs" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num} legs</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleParlayTypeChange} value={parlayType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select parlay type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple">Multiple Game Parlay</SelectItem>
                <SelectItem value="same">Same Game Parlay</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xl font-semibold mb-4">Total Odds: <span className="text-green-500">{americanTotalOdds}</span></p>
          <div className="space-y-4">
            {selectedBets.map(bet => (
              <div key={bet.id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold flex items-center">
                    {bet.game}
                    {bet.streak && (
                      <span className="ml-2 flex items-center text-orange-400" title={`${bet.streak} week streak`}>
                        <Flame size={16} />
                        <span className="ml-1 text-sm">x{bet.streak}</span>
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{bet.bet}</p>
                  <p className="text-xs text-gray-500">{formatCommenceTime(bet.commenceTime)}</p>
                </div>
                <span className="text-green-500 font-bold">{bet.odds}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Potential Winnings Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Input
              type="number"
              placeholder="Enter stake"
              value={stake}
              onChange={handleStakeChange}
              className="w-40"
            />
            <Button>Calculate</Button>
          </div>
          {stake && (
            <p className="text-2xl">
              Potential Winnings: <span className="text-green-500">${formatMoney(calculateWinnings(stake, totalOdds))}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}