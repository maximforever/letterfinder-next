import Image from "next/image";
import styles from "./page.module.css";
import { Frame } from "@/components/Frame";
import { Analytics } from "@/components/Analytics";

export default function Home() {
  const text =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

  return (
    <main className="h-screen flex flex-col justify-center items-center">
      <Frame text={text} />
      <Analytics />
    </main>
  );
}
