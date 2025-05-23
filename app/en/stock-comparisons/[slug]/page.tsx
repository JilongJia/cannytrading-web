import clsx from "clsx";
import { AdvertisementSidebar } from "@/app/components/en/content/page/AdvertisementSidebar";
import { Footer } from "@/app/components/en/content/page/Footer";
import { Header as PageHeader } from "@/app/components/en/content/page/Header";
import { TableOfContentsSidebar } from "@/app/components/en/content/page/TableOfContentsSidebar";
import { H1 } from "@/app/components/en/content/page/main/article/H1";
import { Header as ArticleHeader } from "@/app/components/en/content/page/main/article/Header";
import { ModifiedDate } from "@/app/components/en/content/page/main/article/ModifiedDate";
import { P } from "@/app/components/en/content/page/main/article/P";
import { tableOfContentsData } from "./tableOfContents";

import { PerformanceComparisonSection } from "./components/PerformanceComparisonSection";
import { CompanyOverviewSection } from "./components/CompanyOverviewSection";
import { ValuationMetricsComparisonSection } from "./components/ValuationMetricsComparisonSection";
import { DividendComparisonSection } from "./components/DividendComparisonSection";
import { FinancialStrengthMetricsComparisonSection } from "./components/FinancialStrengthMetricsComparisonSection";
import styles from "./page.module.css";

type PageProps = { params: Promise<{ slug: string }> };

async function Page({ params }: PageProps) {
  const slug = (await params).slug;
  const stockOneSymbol = "AAPL";
  const stockTwoSymbol = "TSLA";

  return (
    <>
      <PageHeader
        pathname={`/en/stock-comparisons/${slug}`}
        className={clsx(styles.pageHeader, "layoutContainer")}
      />
      <div className={clsx(styles.contentContainer, "layoutContainer")}>
        <TableOfContentsSidebar
          tableOfContentsData={tableOfContentsData}
          className={styles.tableOfContentsSidebar}
        />
        <main className={styles.main}>
          <article>
            <ArticleHeader className={styles.articleHeader}>
              <H1>
                {stockOneSymbol} vs. {stockTwoSymbol}: A Head-to-Head Stock
                Comparison
              </H1>
              <ModifiedDate />
            </ArticleHeader>
            <P>
              Here’s a clear look at {stockOneSymbol} and {stockTwoSymbol},
              comparing key factors like performance, valuation metrics,
              dividends, and financial strength. It’s built for investors or
              anyone curious to see how these two stocks match up.
            </P>
            <PerformanceComparisonSection
              stockOneSymbol={stockOneSymbol}
              stockTwoSymbol={stockTwoSymbol}
            />
            <CompanyOverviewSection
              stockOneSymbol={stockOneSymbol}
              stockTwoSymbol={stockTwoSymbol}
            />
            <ValuationMetricsComparisonSection
              stockOneSymbol={stockOneSymbol}
              stockTwoSymbol={stockTwoSymbol}
            />
            <DividendComparisonSection
              stockOneSymbol={stockOneSymbol}
              stockTwoSymbol={stockTwoSymbol}
            />
            <FinancialStrengthMetricsComparisonSection
              stockOneSymbol={stockOneSymbol}
              stockTwoSymbol={stockTwoSymbol}
            />
          </article>
        </main>
      </div>
      <AdvertisementSidebar className={styles.advertisementSidebar} />
      <Footer className={clsx(styles.footer, "layoutContainer")} />
    </>
  );
}

export default Page;
export const revalidate = 60;
export const dynamic = "force-static";
