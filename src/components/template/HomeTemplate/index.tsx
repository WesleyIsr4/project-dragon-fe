"use client";

import type { Dragon } from "@/app/(private)/home/page";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

type HomeTemplateProps = {
  dragonList: Dragon[];
};

const dragonTypeMapping: Record<number, { type: string; image: string }> & {
  default: { type: string; image: string };
} = {
  1: { type: "Fogo", image: "/assets/dragões/fire.webp" },
  2: { type: "Gelo", image: "/assets/dragões/gelo.webp" },
  3: { type: "Elétrico", image: "/assets/dragões/eletrico.webp" },
  4: { type: "Terra", image: "/assets/dragões/terra.webp" },
  default: { type: "Desconhecido", image: "/assets/dragões/desconhecido.webp" },
};

const getDragonType = (type: number) => {
  return (
    dragonTypeMapping[type] || {
      type: "Desconhecido",
      image: "/assets/dragões/desconhecido.webp",
    }
  );
};

function HomeTemplate({ dragonList }: HomeTemplateProps) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este dragão?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.API_DRAGON_URL as string}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Dragão excluído com sucesso!");
        router.refresh();
      } else {
        alert("Erro ao excluir o dragão.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o dragão.");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Dragões</h1>
      <div className={styles.cardGrid}>
        {dragonList.map((dragon) => {
          const typeInfo = getDragonType(dragon.type);

          return (
            <div key={dragon.id} className={styles.card}>
              <Image
                src={typeInfo.image}
                alt={typeInfo.type}
                width={150}
                height={150}
              />
              <h3 className={styles.cardTitle}>{dragon.name}</h3>
              <p className={styles.cardType}>Tipo: {typeInfo.type}</p>
              <div className={styles.cardButtons}>
                <button
                  className={`${styles.button} ${styles.buttonDetails}`}
                  onClick={() => router.push(`/dragon/${dragon.id}`)}
                >
                  Detalhes
                </button>
                <button
                  className={`${styles.button} ${styles.buttonDelete}`}
                  onClick={() => handleDelete(dragon.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomeTemplate;
