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


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = () => {
        console.log(values);
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