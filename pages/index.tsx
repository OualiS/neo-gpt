import Neo from "../components/neo";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 ">
      <div className="gradient-custom absolute hover:cursor-pointer"></div>
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-text">
        <span className="">Neo</span>
      </h1>
      <main
        suppressHydrationWarning={true}
        className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center"
      >
        <Neo />
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2 text-sky-400"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vocal interface for <b>GPT-3</b> made by{" "}
          <b className="animate-bounce">d3Ex2</b>
        </a>
      </footer>
    </div>
  );
};

export default Home;
