import axios from 'axios'

export async function GET(req: Request, { params }: any) {
  try {
    const { id } = params
    const { searchParams } = new URL(req.url)
    const days = searchParams.get('days') || '30'
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    const r = await axios.get(url)
    return new Response(JSON.stringify(r.data), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500 })
  }
}
