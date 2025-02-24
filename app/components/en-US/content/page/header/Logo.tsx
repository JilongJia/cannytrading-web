import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import logo from "@/public/cannytrading-logo.png";
import styles from "./Logo.module.css";

type LogoProps = { className?: string };

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/en-US" className={clsx(styles.logo, className)}>
      <Image src={logo} alt="Canny Trading logo" className={styles.image} />
    </Link>
  );
}
