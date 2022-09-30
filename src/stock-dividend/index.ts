import { getStockDividend } from "../api/ftm";
import { insertStockDividend } from "../database";

interface Historical {
  date:  string;
  adjDividend:  number;
  dividend:  number;
  recordDate:  string;
  paymentDate:  string;
  declarationDate:  string;
}

function isDate(date: string) {
  return !isNaN(Date.parse(date)) ? date : undefined;
}

/**
  @notice The function will call an API to get all historical dividend of stock
  @param symbol Symbol of stock
*/
export default async function main(symbol: string) {
  const dividendRecords = await getStockDividend(symbol);

  if (dividendRecords.length !== 0) {
    const historicalDividendOfStock = dividendRecords.historical.map((record: Historical) => [
      dividendRecords.symbol,
      isDate(record.date) || 'NULL',
      record.adjDividend || 'NULL',
      record.dividend || 'NULL',
      isDate(record.recordDate) || 'NULL',
      isDate(record.paymentDate) || 'NULL',
      isDate(record.declarationDate) || 'NULL'
    ]);
  
    await insertStockDividend(historicalDividendOfStock);
  }
}