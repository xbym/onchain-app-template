import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const TOKEN_ADDRESS = '0x91ff962f7de9865d3ca8ca151bac28969f52f34b'
const TOKEN_ABI = [
  'function claim() public',
  'function balanceOf(address account) public view returns (uint256)'
]

export default function SmartTokenClaimer() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isSmartAccount, setIsSmartAccount] = useState<boolean>(false)
  const [balance, setBalance] = useState<string>('0')
  const [isClaiming, setIsClaiming] = useState<boolean>(false)
  const [claimStatus, setClaimStatus] = useState<string | null>(null)

  useEffect(() => {
    const web3Modal = new Web3Modal()
    web3Modal.connect().then((connection: any) => {
      const web3Provider = new ethers.BrowserProvider(connection)
      setProvider(web3Provider)
      web3Provider.getSigner().then(signer => signer.getAddress()).then(setAddress)
    })
  }, [])

  useEffect(() => {
    if (provider && address) {
      checkSmartAccount()
      updateBalance()
    }
  }, [provider, address])

  const checkSmartAccount = async () => {
    if (!provider || !address) return
    const code = await provider.getCode(address)
    setIsSmartAccount(code !== '0x')
  }

  const updateBalance = async () => {
    if (!provider || !address) return
    const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider)
    const balance = await contract.balanceOf(address)
    setBalance(ethers.formatEther(balance))
  }

  const claimTokens = async () => {
    if (!provider || !isSmartAccount) return
    setIsClaiming(true)
    setClaimStatus(null)
    try {
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer)
      
      // Create a batch transaction
      const batchTx = [
        {
          to: TOKEN_ADDRESS,
          data: contract.interface.encodeFunctionData('claim')
        }
      ]
      
      // Send the batch transaction
      const tx = await signer.sendTransaction({
        to: address,
        data: ethers.concat(batchTx.map(t => t.data))
      })
      
      await tx.wait()
      setClaimStatus('Tokens claimed successfully!')
      updateBalance()
    } catch (error) {
      console.error('Error claiming tokens:', error)
      setClaimStatus('Failed to claim tokens. Please try again.')
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>SMART Token Claimer</CardTitle>
        <CardDescription>Claim your $SMART tokens here</CardDescription>
      </CardHeader>
      <CardContent>
        {address ? (
          <>
            <p className="mb-2">Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
            <p className="mb-2">Smart Account: {isSmartAccount ? 'Yes' : 'No'}</p>
            <p className="mb-4">Balance: {balance} $SMART</p>
            {isSmartAccount ? (
              <Button onClick={claimTokens} disabled={isClaiming}>
                {isClaiming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isClaiming ? 'Claiming...' : 'Claim Tokens'}
              </Button>
            ) : (
              <Alert variant="destructive">
                <AlertTitle>Not a Smart Account</AlertTitle>
                <AlertDescription>
                  You need a Smart Account to claim $SMART tokens.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <p>Connecting to wallet...</p>
        )}
      </CardContent>
      <CardFooter>
        {claimStatus && (
          <Alert variant={claimStatus.includes('successfully') ? 'default' : 'destructive'}>
            <AlertDescription>{claimStatus}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  )
}