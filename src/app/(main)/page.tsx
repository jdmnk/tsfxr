"use client";

import { LoadingPage } from "@/components/loading-page";
import dynamic from "next/dynamic";

// Use dynamic import to prevent hydration errors due to usage of window object in sfxr library
const Home = dynamic(() => import("./_components/home"), {
  ssr: false,
  loading: () => <LoadingPage />,
});

export default Home;
