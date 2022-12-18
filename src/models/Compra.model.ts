export default class Compra {
    Id?: number;
    dataCompra?: Date;
    produtoId?: number;
    usuarioId?: number;
    pagamentoEfetuado?: boolean;
    formaPagamento?: number;
    valorCompraDisplay?: string;
    valorCompra?: number;
    fornecedor?: string;
    fornecedorContato?: string;
    quantidade?: number;
}