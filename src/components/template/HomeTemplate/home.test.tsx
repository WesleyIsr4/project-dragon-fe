import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import HomeTemplate from "./";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: function Image({ src, alt, width, height, ...props }: unknown) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  },
}));

global.fetch = jest.fn();
global.window.confirm = jest.fn();
global.alert = jest.fn();

describe("HomeTemplate", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  const mockDragonList = [
    {
      id: "1",
      name: "Dragão de Fogo",
      type: 1,
      histories: "História do dragão",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Dragão de Gelo",
      type: 2,
      histories: "História do dragão de gelo",
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("deve renderizar corretamente a lista de dragões", () => {
    render(<HomeTemplate dragonList={mockDragonList} />);

    expect(screen.getByText("Lista de Dragões")).toBeInTheDocument();

    expect(screen.getByText("Dragão de Fogo")).toBeInTheDocument();
    expect(screen.getByText("Dragão de Gelo")).toBeInTheDocument();
    expect(screen.getByText("Tipo: Fogo")).toBeInTheDocument();
    expect(screen.getByText("Tipo: Gelo")).toBeInTheDocument();
  });

  it("deve renderizar as imagens corretamente com os atributos apropriados", () => {
    render(<HomeTemplate dragonList={mockDragonList} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);

    expect(images[0]).toHaveAttribute("src", "/assets/dragões/fire.webp");
    expect(images[0]).toHaveAttribute("alt", "Fogo");
    expect(images[0]).toHaveAttribute("width", "150");
    expect(images[0]).toHaveAttribute("height", "150");
  });

  it("deve navegar para a página de detalhes quando clicar no botão Detalhes", () => {
    render(<HomeTemplate dragonList={mockDragonList} />);

    const detailsButtons = screen.getAllByText("Detalhes");
    fireEvent.click(detailsButtons[0]);

    expect(mockRouter.push).toHaveBeenCalledWith("/dragon/1");
  });

  it("deve mostrar confirmação antes de excluir um dragão", () => {
    render(<HomeTemplate dragonList={mockDragonList} />);

    const deleteButtons = screen.getAllByText("Excluir");
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith(
      "Tem certeza que deseja excluir este dragão?"
    );
  });

  it("deve excluir o dragão quando confirmado", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<HomeTemplate dragonList={mockDragonList} />);

    const deleteButtons = screen.getAllByText("Excluir");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.API_DRAGON_URL}/1`,
        { method: "DELETE" }
      );
      expect(window.alert).toHaveBeenCalledWith("Dragão excluído com sucesso!");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("não deve excluir o dragão quando cancelado", async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(<HomeTemplate dragonList={mockDragonList} />);

    const deleteButtons = screen.getAllByText("Excluir");
    fireEvent.click(deleteButtons[0]);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockRouter.refresh).not.toHaveBeenCalled();
  });

  it("deve mostrar erro quando a exclusão falhar", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<HomeTemplate dragonList={mockDragonList} />);

    const deleteButtons = screen.getAllByText("Excluir");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao excluir o dragão.");
    });
  });

  it("deve mostrar tipo desconhecido para dragões com tipo inválido", () => {
    const dragonWithInvalidType = [
      {
        ...mockDragonList[0],
        type: 999,
      },
    ];

    render(<HomeTemplate dragonList={dragonWithInvalidType} />);

    expect(screen.getByText("Tipo: Desconhecido")).toBeInTheDocument();

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/assets/dragões/desconhecido.webp");
  });

  it("deve renderizar corretamente quando a lista está vazia", () => {
    render(<HomeTemplate dragonList={[]} />);

    expect(screen.getByText("Lista de Dragões")).toBeInTheDocument();
    expect(screen.queryByText("Detalhes")).not.toBeInTheDocument();
  });
});
