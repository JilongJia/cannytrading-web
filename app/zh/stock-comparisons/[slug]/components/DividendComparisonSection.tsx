import { H2 } from "@/app/components/zh/content/page/main/article/H2";
import { P } from "@/app/components/zh/content/page/main/article/P";
import { Section } from "@/app/components/zh/content/page/main/article/Section";
import { Table } from "@/app/components/zh/content/page/main/article/Table";

type DividendData = {
  symbol: string;
  dividendYieldTTM: number;
};

type DividendComparisonSectionProps = {
  stockOneSymbol: string;
  stockTwoSymbol: string;
};

async function fetchDividendData(symbol: string): Promise<DividendData | null> {
  const apiKey = process.env.FINANCIAL_MODELING_PREP_API_KEY;
  const endpoint = `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${symbol}&apikey=${apiKey}`;
  try {
    const response = await fetch(endpoint);
    const dividendRawData = await response.json();
    if (!dividendRawData || dividendRawData.length === 0) return null;

    const dividendData = dividendRawData[0];
    const data: DividendData = {
      symbol: dividendData.symbol,
      dividendYieldTTM: dividendData.dividendYieldTTM,
    };
    return data;
  } catch (error) {
    console.error("Error fetching dividend data for", symbol, error);
    return null;
  }
}

function generateDividendYieldCommentary(
  stockOneSymbol: string,
  stockOneDividendYield: number,
  stockTwoSymbol: string,
  stockTwoDividendYield: number,
): string {
  const DIVIDEND_YIELD_THRESHOLD_NONE = 0;
  const DIVIDEND_THRESHOLD_SIGNIFICANT_RELATIVE_GAP = 0.5;

  type DividendYieldCategory = "None" | "Has";

  const getDividendYieldCategory = (
    dividendYield: number,
  ): DividendYieldCategory =>
    dividendYield <= DIVIDEND_YIELD_THRESHOLD_NONE ? "None" : "Has";

  const stockOneCategory = getDividendYieldCategory(stockOneDividendYield);
  const stockTwoCategory = getDividendYieldCategory(stockTwoDividendYield);

  if (stockOneCategory === "None" && stockTwoCategory === "None") {
    return `${stockOneSymbol} 和 ${stockTwoSymbol} 均不支付股息，利润主要用于再投资，可能优先考虑业务扩展或长期增长而非短期股东回报。`;
  }

  if (stockOneCategory === "None" && stockTwoCategory === "Has") {
    return `${stockOneSymbol} 不支付股息，利润更多用于支持公司发展，适合追求资本增值的投资者。而 ${stockTwoSymbol} 的股息率为 ${stockTwoDividendYield.toFixed(2)}%，通过分红直接回报股东，反映出较稳定的盈利能力，两者策略形成对比。`;
  }

  if (stockOneCategory === "Has" && stockTwoCategory === "None") {
    return `${stockOneSymbol} 的股息率为 ${stockOneDividendYield.toFixed(2)}%，在回报股东的同时兼顾增长；而 ${stockTwoSymbol} 不支付股息，利润主要投入未来发展，如业务扩展或研发，体现出不同的经营策略。`;
  }

  if (stockOneCategory === "Has" && stockTwoCategory === "Has") {
    const baseCommentary = `${stockOneSymbol} 的股息率为 ${stockOneDividendYield.toFixed(2)}%，${stockTwoSymbol} 为 ${stockTwoDividendYield.toFixed(2)}%，两者均在股东回报与公司发展之间取得平衡。`;

    const higherYield = Math.max(stockOneDividendYield, stockTwoDividendYield);
    const lowerYield = Math.min(stockOneDividendYield, stockTwoDividendYield);
    const relativeDifference = (higherYield - lowerYield) / lowerYield;
    const percentageDifference = (relativeDifference * 100).toFixed(0);

    if (relativeDifference > DIVIDEND_THRESHOLD_SIGNIFICANT_RELATIVE_GAP) {
      const higherStock =
        stockOneDividendYield > stockTwoDividendYield
          ? stockOneSymbol
          : stockTwoSymbol;
      const lowerStock =
        stockOneDividendYield > stockTwoDividendYield
          ? stockTwoSymbol
          : stockOneSymbol;
      const higherYieldValue = higherYield.toFixed(2);
      return `${baseCommentary} 其中，${higherStock} 的股息率达 ${higherYieldValue}%，高出 ${lowerStock} 约 ${percentageDifference}%，显示其更倾向于回报股东，而 ${lowerStock} 则更多保留利润用于发展。`;
    }

    return `${baseCommentary} 两者的股息率差距较小，显示出相似的分红与增长策略。`;
  }

  return "";
}

export async function DividendComparisonSection({
  stockOneSymbol,
  stockTwoSymbol,
}: DividendComparisonSectionProps) {
  const stockOneDividendData = await fetchDividendData(stockOneSymbol);
  const stockTwoDividendData = await fetchDividendData(stockTwoSymbol);

  if (!stockOneDividendData || !stockTwoDividendData) {
    return (
      <Section ariaLabelledby="dividend-comparison">
        <H2 id="dividend-comparison">股息比较</H2>
        <P>暂时无法加载股息数据。</P>
      </Section>
    );
  }

  const dividendYieldCommentary = generateDividendYieldCommentary(
    stockOneSymbol,
    stockOneDividendData.dividendYieldTTM,
    stockTwoSymbol,
    stockTwoDividendData.dividendYieldTTM,
  );

  return (
    <Section ariaLabelledby="dividend-comparison">
      <H2 id="dividend-comparison">股息比较</H2>
      <P>{dividendYieldCommentary}</P>
      <Table>
        <Table.Thead>
          <Table.Thead.Tr>
            <Table.Thead.Tr.Th scope="row">代码</Table.Thead.Tr.Th>
            <Table.Thead.Tr.Th scope="col">{stockOneSymbol}</Table.Thead.Tr.Th>
            <Table.Thead.Tr.Th scope="col">{stockTwoSymbol}</Table.Thead.Tr.Th>
          </Table.Thead.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tbody.Tr>
            <Table.Tbody.Tr.Th scope="row">股息率 (TTM)</Table.Tbody.Tr.Th>
            <Table.Tbody.Tr.Td>
              {(stockOneDividendData.dividendYieldTTM * 100).toFixed(2)}%
            </Table.Tbody.Tr.Td>
            <Table.Tbody.Tr.Td>
              {(stockTwoDividendData.dividendYieldTTM * 100).toFixed(2)}%
            </Table.Tbody.Tr.Td>
          </Table.Tbody.Tr>
        </Table.Tbody>
      </Table>
    </Section>
  );
}
