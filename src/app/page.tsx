import { Frame } from "@/components/Frame";
import { Analytics } from "@/components/Analytics";

export default async function Home() {
  console.log("here's home");
  return (
    <main className="h-screen flex flex-col justify-start items-center">
      <Frame />
      <Analytics />
    </main>
  );
}
