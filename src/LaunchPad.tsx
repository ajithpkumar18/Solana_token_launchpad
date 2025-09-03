import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { useState, type ChangeEvent } from "react"
type Value = {
    name: string,
    symbol: string,
    url: string,
    supply: string
}

const LaunchPad = () => {
    const [values, setValues] = useState<Value>({
        name: "",
        symbol: "",
        url: "",
        supply: ""
    })

    const { connection } = useConnection()
    const wallet = useWallet();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = () => {
        console.log(values);
        createToken()
    }

    async function createToken() {
        const mintKeypair = Keypair.generate();
        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey!,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID
            }),
            createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey!, wallet.publicKey, TOKEN_PROGRAM_ID)
        );
        const recentBlockhas = await connection.getLatestBlockhash();
        transaction.recentBlockhash = recentBlockhas.blockhash;
        transaction.feePayer = wallet.publicKey!;
        transaction.partialSign(mintKeypair);

        await wallet.sendTransaction(transaction, connection)
        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`)
    }

    return (
        <div className="">
            <h1>Solana Token Launchpad</h1>
            <input onChange={handleChange} name="name" className='inputText' type='text' placeholder='Name'></input> <br />
            <input onChange={handleChange} name="symbol" className='inputText' type='text' placeholder='Symbol'></input> <br />
            <input onChange={handleChange} name="url" className='inputText' type='text' placeholder='Image URL'></input> <br />
            <input onChange={handleChange} name="supply" className='inputText' type='text' placeholder='Initial Supply'></input> <br />
            <button onClick={handleSubmit} className='btn'>Create a token</button>
        </div>
    )
}

export default LaunchPad