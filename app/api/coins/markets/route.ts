import axios from 'axios'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page') || '1'
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=true&price_change_percentage=24h`
    const r = await axios.get(url)
    return new Response(JSON.stringify(r.data), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 })
  }
}
