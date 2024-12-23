import Pontos from "./Pontos";

export default interface Cidade {
    id: number | string;
    nome: string,
    pais: string,
    atualizado: Date,
    pontos: Array<Pontos>
}

export function calcularValorPontos(cidade: Cidade) {
    return cidade.pontos.reduce((somatorio, ponto) => {
        const { preco } = ponto;
        return somatorio + preco;
    }, 0);
}

export function calcularValorPontosComDesconto(
    cidade: Cidade, 
    calcularDesconto: (ponto: Pontos) => number) {
        return cidade.pontos.reduce((somatorio, ponto) => {
            // const { preco } = ponto;
            return somatorio + calcularDesconto(ponto);
        }, 0);

}
