import BetExplorer from '@/components/bet-explorer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">NFL Bet Explorer</h1>
      <BetExplorer />
    </main>
  )
}