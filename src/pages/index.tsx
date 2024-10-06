import Head from 'next/head'
import SmartTokenClaimer from '../components/SmartTokenClaimer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Head>
        <title>SMART Token Claimer</title>
        <meta name="description" content="Claim your $SMART tokens here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          SMART Token Claimer
        </h1>
        <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
          Welcome to the SMART Token Claimer. Connect your wallet and claim your $SMART tokens if you have a SmartAccount.
        </p>
        <div className="flex justify-center">
          <SmartTokenClaimer />
        </div>
      </main>

      <footer className="mt-8 py-4 text-center text-gray-500">
        <p>&copy; 2023 SMART Token Claimer. All rights reserved.</p>
      </footer>
    </div>
  )
}