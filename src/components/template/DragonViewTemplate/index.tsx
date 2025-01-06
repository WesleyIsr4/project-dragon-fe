"use client";

import Image from "next/image";
import styles from "./styles.module.css";
import type { Dragon } from "@/app/(private)/home/page";
import { useRouter } from "next/navigation";

interface DetailsDragonProps {
  dragon: Dragon;
}

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

function DetailsDragon({ dragon }: DetailsDragonProps) {
  const typeInfo = getDragonType(dragon.type);

  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este dragão?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${process.env.API_DRAGON_URL as string}/${dragon.id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Dragão excluído com sucesso!");
        router.push("/home");
      } else {
        alert("Erro ao excluir o dragão.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o dragão.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{dragon.name}</h1>
      <Image
        src={typeInfo.image}
        alt={dragon.name}
        className={styles.image}
        width={100}
        height={100}
      />
      <p className={styles.detail}>
        <strong>Tipo:</strong> {typeInfo.type}
      </p>
      <p className={styles.detail}>
        <strong>Data de Criação:</strong>
        {new Date(dragon.createdAt).toLocaleDateString()}
      </p>
      <div className={styles.actions}>
        <button className={styles.button} onClick={() => router.push("/home")}>
          Voltar
        </button>
        <button
          className={styles.button}
          onClick={() => router.push(`/dragons/${dragon.id}/edit`)}
        >
          Editar
        </button>
        <button
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={handleDelete}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

export default DetailsDragon;
