import Link from "next/link";
import clsx from "clsx";

import { getSectionPages } from "@/app/lib/db/getSectionPages";
import { Header as PageHeader } from "@/app/components/en/section/page/Header";
import { Footer } from "@/app/components/en/section/page/Footer";

import styles from "./page.module.css";

type PageData = { title: string; path: string };

async function Page() {
  const pages: PageData[] = await getSectionPages("en", "tables");

  const groups: Record<string, PageData[]> = pages.reduce(
    (acc, page) => {
      const letter = page.title.charAt(0).toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(page);
      return acc;
    },
    {} as Record<string, PageData[]>,
  );

  const sortedLetters = Object.keys(groups).sort((a, b) =>
    a.localeCompare(b, "en"),
  );

  sortedLetters.forEach((letter) => {
    groups[letter].sort((a, b) => a.title.localeCompare(b.title, "en"));
  });

  return (
    <>
      <PageHeader
        pathname="/en/tables"
        className={clsx(styles.pageHeader, "layoutContainer")}
      />
      <main className={styles.main}>
        <header className={styles.mainHeader}>
          <h1 className={styles.h1}>Table Index</h1>
        </header>
        <hr className={styles.hr} />
        {sortedLetters.map((letter) => (
          <section key={letter} className={styles.section}>
            <h2 className={styles.h2}>{letter}</h2>
            <ul className={styles.ul}>
              {groups[letter].map((page) => (
                <li key={page.path} className={styles.li}>
                  <Link href={page.path} className={styles.link}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer className={clsx(styles.footer, "layoutContainer")} />
    </>
  );
}

export default Page;
