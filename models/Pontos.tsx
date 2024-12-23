export default interface Pontos {
    nome: string,
    preco: number,
    desconto: number,
    latitude: number,
    longitude: number,
}

export function calcularDesconto(ponto: Pontos) {
    const { preco, desconto } = ponto;
    if (desconto > 0.4) return preco;
    return preco * (1 - desconto);
}
