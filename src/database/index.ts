require('dotenv').config();

import mariadb from 'mariadb';

async function dbConnection() {
  return await mariadb.createConnection({
    host: process.env.DB_URL,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT!)
  });
}

export async function insertDelistedCompanies(companies: Array<any>) {
  const connection = await dbConnection();
  await connection.beginTransaction();

  try {
    await connection.batch(
      "INSERT IGNORE INTO delisted_companies(symbol, companyName, exchange, ipoDate, delistedDate) VALUES (?, ?, ?, ?, ?)",
      companies
    );
    await connection.commit();
  } catch (err) {
    await connection.rollback();
  } finally {
    // Close Connection
    await connection.end();
  }
}

export async function insertStockDividend(records: Array<any>) {
  const connection = await dbConnection();
  await connection.beginTransaction();

  try {
    await connection.batch(
      "INSERT IGNORE INTO dividends(symbol, date, adjDividend, dividend, recordDate, paymentDate, declarationDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
      records
    );
    await connection.commit();
  } catch (err) {
    await connection.rollback();
  } finally {
    // Close Connection
    await connection.end();
  }
}
