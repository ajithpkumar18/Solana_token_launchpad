import { createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMint2Instruction, createMintToInstruction, ExtensionType, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, getMintLen, LENGTH_SIZE, MINT_SIZE, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { useState, type ChangeEvent } from "react"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

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
        if (values.name.length > 32) throw new Error("Name too long (max 32 chars)");
        if (values.symbol.length > 10) throw new Error("Symbol too long (max 10 chars)");
        if (values.url.length > 200) throw new Error("URI too long (max 200 chars)");

        const mintKeypair = Keypair.generate();

        const metaData = {
            mint: mintKeypair.publicKey,
            name: values.name,
            symbol: values.symbol,
            uri: values.url,
            additionalMetadata: [],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metaData).length;

        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey!,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey!, null, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metaData.name,
                symbol: metaData.symbol,
                uri: metaData.uri,
                mintAuthority: wallet.publicKey!,
                updateAuthority: wallet.publicKey!
            }),
        );

        console.log(metaData.name, metaData.uri, metaData.symbol)

        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = wallet.publicKey!;
        transaction.partialSign(mintKeypair);

        await wallet.sendTransaction(transaction, connection)
        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`)

        const associatedToken = getAssociatedTokenAddressSync(
            mintKeypair.publicKey,
            wallet.publicKey!,
            false,
            TOKEN_2022_PROGRAM_ID
        )

        console.log(associatedToken.toBase58());

        const transaction2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey!,
                associatedToken,
                wallet.publicKey!,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID
            )
        )

        await wallet.sendTransaction(transaction2, connection);

        const transaction3 = new Transaction().add(
            createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey!, 1000000000, [], TOKEN_2022_PROGRAM_ID)
        )

        await wallet.sendTransaction(transaction3, connection);

    }

    return (
        <div className="box">
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