import Image from "next/image";
import styles from "./page.module.css";
import { Frame } from "@/components/Frame";
import { Analytics } from "@/components/Analytics";

export default function Home() {
  return (
    <main>
      <Frame text={"we run hard."} />
      <Analytics />
    </main>
  );
}
