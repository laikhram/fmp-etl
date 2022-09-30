import prompts from 'prompts';
import { getByStartAtLatestPage } from './delisted-companies';
import StockDividend from './stock-dividend';

async function delistedRetrieveMode(mode: string, page?: number) {
  switch (mode) {
    case '1': // Full load, start from page 0
      await getByStartAtLatestPage(0);
      return 'Full load is successfully';
    case '2': // Full load, start from page 0
      const response = await prompts({
        type: 'number',
        name: 'pageNo',
        message: 'What No. of latest page?'
      });
      await getByStartAtLatestPage(response.pageNo!);
      return `Load data start at page ${response.pageNo!} is successfully`;
  }
}

// Main function
(async () => {
  const response = await prompts([
    {
      type: 'select',
      name: 'value',
      message: 'Which data you want to retrieve?',
      choices: [
        { title: 'Stock Dividend', value: '1' },
        { title: 'Delisted Companies', value: '2' },
      ],
      initial: 0
    }
  ]);

  switch (response.value) {
    case '1': // Stock Dividend
      const stockSymbolResponse = await prompts({
        type: 'text',
        name: 'symbol',
        message: 'What stock symbol you want? (Only one symble)',
      });

      try {
        process.stdout.write(`Fetching ${stockSymbolResponse.symbol} dividend...\n`);
        await StockDividend(stockSymbolResponse.symbol);
        process.stdout.write("\r\x1b[K");
        process.stdout.write(`Dividend of ${stockSymbolResponse.symbol} stock was put into database already.`);
      } catch (err: any) {
        console.error(err.message);
      }
      break;
    case '2': // Delisted Companies
      const retrieveMode = await prompts([
        {
          type: 'select',
          name: 'mode',
          message: 'Choose mode?',
          choices: [
            { title: 'Full load', value: '1', description: 'If you not sure what number is latest page' },
            { title: 'Specify latest page', value: '2', description: 'Start retrieve data from specify page' },
          ],
          initial: 0
        }
      ]);

      const response = await delistedRetrieveMode(retrieveMode.mode);
      console.log(response);
      break;
    default:
      console.log('Error')
  }
})();