import { H2 } from "@/app/components/en/content/page/main/article/H2";
import { P } from "@/app/components/en/content/page/main/article/P";
import { Section } from "@/app/components/en/content/page/main/article/Section";
import { Table } from "@/app/components/en/content/page/main/article/Table";

export type CompanyProfileData = {
  companyName: string;
  country: string;
  sector: string;
  industry: string;
  ceo: string;
  price: number;
  marketCap: number;
  beta: number;
  exchange: string;
  ipoDate: string;
  isAdr: boolean;
  currency: string;
};

type CompanyOverviewSectionProps = {
  stockOneSymbol: string;
  stockTwoSymbol: string;
};

async function fetchCompanyProfileData(
  symbol: string,
): Promise<CompanyProfileData | null> {
  const apiKey = process.env.FINANCIAL_MODELING_PREP_API_KEY;
  const endpoint = `https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${apiKey}`;
  try {
    const response = await fetch(endpoint);
    const rawData = await response.json();
    return rawData[0];
  } catch (error) {
    console.error("Error fetching company profile data for", symbol, error);
    return null;
  }
}

function generateMarketCapComparisonCommentary(
  stockOneSymbol: string,
  stockOneMarketCap: number,
  stockOneCurrency: string,
  stockTwoSymbol: string,
  stockTwoMarketCap: number,
  stockTwoCurrency: string,
): string {
  const marketCapRatio = stockOneMarketCap / stockTwoMarketCap;
  const stockOneFormattedMarketCap = (
    stockOneMarketCap / 1000000000
  ).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const stockTwoFormattedMarketCap = (
    stockTwoMarketCap / 1000000000
  ).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (marketCapRatio > 1.5) {
    return `For market capitalization, ${stockOneSymbol} is notably larger with a market cap of approximately ${stockOneFormattedMarketCap} billion ${stockOneCurrency}, roughly ${marketCapRatio.toFixed(2)} times that of ${stockTwoSymbol} (${stockTwoFormattedMarketCap} billion ${stockTwoCurrency}).`;
  } else if (marketCapRatio < 0.67) {
    const inverseRatio = 1 / marketCapRatio;
    return `In terms of market cap, ${stockTwoSymbol} stands out with a value of approximately ${stockTwoFormattedMarketCap} billion ${stockTwoCurrency}, roughly ${inverseRatio.toFixed(2)} times that of ${stockOneSymbol} (${stockOneFormattedMarketCap} billion ${stockOneCurrency}).`;
  } else {
    return `Both ${stockOneSymbol} and ${stockTwoSymbol} have comparable market capitalizations, at ${stockOneFormattedMarketCap} billion ${stockOneCurrency} and ${stockTwoFormattedMarketCap} billion ${stockTwoCurrency}, respectively.`;
  }
}

function generateBetaComparisonCommentary(
  stockOneSymbol: string,
  stockOneBeta: number,
  stockTwoSymbol: string,
  stockTwoBeta: number,
): string {
  const betaRatio = stockOneBeta / stockTwoBeta;
  if (betaRatio > 1.5) {
    return `Regarding volatility, ${stockOneSymbol} has a higher beta of ${stockOneBeta.toFixed(2)} (suggesting potentially higher volatility relative to the market), compared to ${stockTwoSymbol}'s beta of ${stockTwoBeta.toFixed(2)}.`;
  } else if (betaRatio < 0.67) {
    return `Looking at volatility, ${stockTwoSymbol} shows a higher beta of ${stockTwoBeta.toFixed(2)} (suggesting potentially higher volatility relative to the market), while ${stockOneSymbol} has a beta of ${stockOneBeta.toFixed(2)}.`;
  } else {
    return `Both stocks exhibit similar volatility characteristics based on their beta values, with ${stockOneSymbol} at ${stockOneBeta.toFixed(2)} and ${stockTwoSymbol} at ${stockTwoBeta.toFixed(2)}.`;
  }
}

function generateAdrCommentary(
  stockOneSymbol: string,
  stockOneIsAdr: boolean,
  stockTwoSymbol: string,
  stockTwoIsAdr: boolean,
): string {
  if (stockOneIsAdr && stockTwoIsAdr) {
    return `Also, please note: both ${stockOneSymbol} and ${stockTwoSymbol} are ADRs. This means they represent ownership in shares of foreign companies, made available for trading on U.S. stock exchanges, offering investors exposure to international markets.`;
  } else if (stockOneIsAdr) {
    return `Also, please note: ${stockOneSymbol} operates as an ADR, meaning it’s a foreign company’s stock listed on U.S. exchanges, while ${stockTwoSymbol} is a standard U.S.-listed stock, not tied to the ADR structure.`;
  } else if (stockTwoIsAdr) {
    return `Also, please note: ${stockTwoSymbol} is structured as an ADR, indicating it’s a foreign entity traded on U.S. markets, whereas ${stockOneSymbol} is a regular U.S.-based stock without ADR designation.`;
  } else {
    return "";
  }
}

export async function CompanyOverviewSection({
  stockOneSymbol,
  stockTwoSymbol,
}: CompanyOverviewSectionProps) {
  const stockOneCompanyProfileData =
    await fetchCompanyProfileData(stockOneSymbol);
  const stockTwoCompanyProfileData =
    await fetchCompanyProfileData(stockTwoSymbol);

  if (!stockOneCompanyProfileData || !stockTwoCompanyProfileData) {
    return (
      <Section ariaLabelledby="company-overview">
        <H2 id="company-overview">Company Overview</H2>
        <P>Company overview data is currently unavailable.</P>
      </Section>
    );
  }

  const marketCapComparisonCommentary = generateMarketCapComparisonCommentary(
    stockOneSymbol,
    stockOneCompanyProfileData.marketCap,
    stockOneCompanyProfileData.currency,
    stockTwoSymbol,
    stockTwoCompanyProfileData.marketCap,
    stockTwoCompanyProfileData.currency,
  );

  const betaComparisonCommentary = generateBetaComparisonCommentary(
    stockOneSymbol,
    stockOneCompanyProfileData.beta,
    stockTwoSymbol,
    stockTwoCompanyProfileData.beta,
  );

  const adrCommentary = generateAdrCommentary(
    stockOneSymbol,
    stockOneCompanyProfileData.isAdr,
    stockTwoSymbol,
    stockTwoCompanyProfileData.isAdr,
  );

  return (
    <Section ariaLabelledby="company-overview">
      <H2 id="company-overview">Company Overview</H2>
      <P>{marketCapComparisonCommentary}</P>
      <P>{betaComparisonCommentary}</P>
      {adrCommentary && <P>{adrCommentary}</P>}
      <P>For a detailed comparison, please refer to the table below.</P>
      <Table>
        <Table.Thead>
          <Table.Thead.Tr>
            <Table.Thead.Tr.Th scope="row">Symbol</Table.Thead.Tr.Th>
            <Table.Thead.Tr.Th scope="col">{stockOneSymbol}</Table.Thead.Tr.Th>
            <Table.Thead.Tr.Th scope="col">{stockTwoSymbol}</Table.Thead.Tr.Th>
          </Table.Thead.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">Company Name</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.companyName}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.companyName}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">Country</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.country}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.country}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">Sector</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.sector}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.sector}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">Industry</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.industry}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.industry}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">CEO</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.ceo}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.ceo}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">Price</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.price.toLocaleString()}{" "}
              {stockOneCompanyProfileData.currency}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.price.toLocaleString()}{" "}
              {stockTwoCompanyProfileData.currency}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">Market Cap</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {(
                stockOneCompanyProfileData.marketCap / 1000000000
              ).toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              billion {stockOneCompanyProfileData.currency}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {(
                stockTwoCompanyProfileData.marketCap / 1000000000
              ).toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              billion {stockTwoCompanyProfileData.currency}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">Beta</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.beta}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.beta}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">Exchange</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.exchange}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.exchange}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">IPO Date</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {new Date(stockOneCompanyProfileData.ipoDate).toLocaleDateString(
                "en",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {new Date(stockTwoCompanyProfileData.ipoDate).toLocaleDateString(
                "en",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">ADR</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {stockOneCompanyProfileData.isAdr ? "Yes" : "No"}
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {stockTwoCompanyProfileData.isAdr ? "Yes" : "No"}
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
        </Table.Tbody>
      </Table>
    </Section>
  );
}
