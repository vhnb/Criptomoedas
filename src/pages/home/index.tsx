import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { FormEvent, useState, useEffect } from 'react'

export interface CoinProps {
    id: string,
    name: string,
    symbol: string,
    priceUsd: string,
    vwap24Hr: string,
    changePercent24Hr: string,
    rank: string,
    supply: string,
    maxSupply: string,
    marketCapUsd: string,
    volumeUsd24Hr: string,
    explorer: string,
    formatedPrice?: string,
    formatedMarket?: string,
    formatedVolume?: string
}

interface DataProp {
    data: CoinProps[]
}

export function Home() {
    const [input, setInput] = useState("")
    const [coins, setCoins] = useState<CoinProps[]>([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        async function getData() {
            fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
                .then(response => response.json())
                .then((data: DataProp) => {
                    const coinsData = data.data

                    const price = Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                    })

                    const priceCompact = Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact"
                    })

                    const formatedResult = coinsData.map((item) => {
                        const formated = {
                            ...item,
                            formatedPrice: price.format(Number(item.priceUsd)),
                            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
                            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
                        }
                        return formated
                    })

                    const listCoins = [...coins, ...formatedResult]
                    setCoins(listCoins)
                })
        }
        getData()
    }, [offset])

    function handleSubmit(event: FormEvent) {
        event.preventDefault()

        if (input === "") return

        navigate(`/detail/${input}`)
    }

    function handleGetMore() {
        if(offset === 0){
            setOffset(10)
            return
        }
        setOffset(offset + 10)
    }

    return (
        <main className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input value={input} onChange={(event) => setInput(event.target.value)} type="text" placeholder='Digite o nome da moeda...' />
                <button type='submit'><BsSearch size={28} color='#fff' /></button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor mercado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                        <th scope='col'>Mudança 24h</th>
                    </tr>
                </thead>
                <tbody id='tbody'>
                    {coins.map((item) => (
                        <tr className={styles.tr} key={item.id}>
                            <td className={styles.tdLabel} data-label="Moeda">
                                <div className={styles.name}>
                                    <img className={styles.logo} src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`} alt='Logo Cripto Moeda' />
                                    <Link to={`/detail/${item.id}`}>
                                        <span>{item.name}</span> | {item.symbol}
                                    </Link>
                                </div>
                            </td>
                            <td className={styles.tdLabel} data-label="Valor mercado">
                                {item.formatedMarket}
                            </td>
                            <td className={styles.tdLabel} data-label="Preço">
                                {item.formatedPrice}
                            </td>
                            <td className={styles.tdLabel} data-label="Volume">
                                {item.formatedVolume}
                            </td>
                            <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
                                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleGetMore} className={styles.buttonMore}>Carregar mais</button>
        </main>
    )
}