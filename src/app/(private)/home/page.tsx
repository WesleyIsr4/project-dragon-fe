export const revalidate = 0;

import HomeTemplate from "@/components/template/HomeTemplate";

export type Dragon = {
  id: string;
  name: string;
  type: number;
  createdAt: string;
};

async function fetchDragons(): Promise<Dragon[]> {
  const endpoint = process.env.API_DRAGON_URL as string;
  const res = await fetch(endpoint, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Falha ao buscar dados da API");
  }

  const data: Dragon[] = await res.json();
  return data.sort((a, b) => a.name.localeCompare(b.name));
}

export default async function Home() {
  const dragons = await fetchDragons();

  return <HomeTemplate dragonList={dragons} />;
}
