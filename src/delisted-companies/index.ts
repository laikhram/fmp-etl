import { getDelistedCompanies } from "../api/ftm";
import { insertDelistedCompanies } from "../database";

function isDate(date: string) {
  return !isNaN(Date.parse(date)) ? date : undefined;
}

/**
  @notice First page start at 0, but API won't return end of page no.
  @notice The function will call an API to get delisted companies page by page.
  @notice To avoid API request limitation, after call full load please note latest page 
  @notice for call an API next time
  @param pageNo Number of page, start at 0
*/
export async function getByStartAtLatestPage(pageNo: number) {
  let currentPage = pageNo;
  let isNotEndOfPage = true;
  const delistedCompaniesAll = [];

  do {
    process.stdout.write("\r\x1b[K");
    process.stdout.write(`Fetching data at page No.: ${currentPage}`);
    const delistedCompanies = await getDelistedCompanies(currentPage);
    if (delistedCompanies.length !== 0) {
      delistedCompaniesAll.push(...delistedCompanies);
      currentPage++;
    } else {
      isNotEndOfPage = false;
      console.log(`Page no. ${currentPage} is empty`);
    }
  } while (isNotEndOfPage);

  const companies = delistedCompaniesAll.map(company => [
    company.symbol || 'NULL',
    company.companyName || 'NULL',
    company.exchange || 'NULL',
    isDate(company.ipoDate) || 'NULL',
    isDate(company.delistedDate) || 'NULL'
  ]);
  await insertDelistedCompanies(companies);
}
