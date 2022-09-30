import client from './index';

export async function getDelistedCompanies(page: number) {
  const res = await client.get(`/delisted-companies?page=${page}`)
  return res.data;
}

export async function getStockDividend(stockSymbol: string) {
  const res = await client.get(`/historical-price-full/stock_dividend/${stockSymbol}`)

  if (Object.keys(res.data).length === 0) {
    throw new Error('Stock symbol is not exist');
  } else if (res.data.historical.length === 0) {
    throw new Error('No historical dividend of this symbol ');
  } else {
    return res.data;
  }
}