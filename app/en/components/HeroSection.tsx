import clsx from "clsx";
import Image from "next/image";

import styles from "./HeroSection.module.css";

import seekReturnsStrategically from "../images/seek-returns-strategically.gif";

type HeroSectionProps = { className?: string };

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={clsx(styles.heroSection, className)}>
      <div>
        <h1 className={styles.h1}>
          <span>Seek Returns.</span>
          <span>Strategically.</span>
        </h1>
        <p className={styles.p}>
          Combining essential knowledge and practical tools for smarter
          investment decisions.
        </p>
      </div>
      <Image
        src={seekReturnsStrategically}
        alt="Seek returns strategically"
        className={styles.image}
      />
    </section>
  );
}
