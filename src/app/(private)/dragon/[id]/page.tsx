import DetailsDragon from "@/components/template/DragonViewTemplate";
import type { Dragon } from "../../home/page";

async function fetchDragon(id: string): Promise<Dragon> {
  const endpoint = `${process.env.API_DRAGON_URL as string}/${id}`;
  const res = await fetch(endpoint, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Falha ao buscar os detalhes do dragão.");
  }

  return res.json();
}

export default async function DragonDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const dragon = await fetchDragon(params.id);

  return (
    <main>
      <DetailsDragon dragon={dragon} />
    </main>
  );
}
