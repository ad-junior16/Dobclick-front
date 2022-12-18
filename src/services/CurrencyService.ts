export default class CurrencyService {

    public Formatar(param: string): any {
        var novoValor = param.split(' ').join('');
        novoValor =  novoValor.replaceAll("R$", '');

        if(novoValor.includes(".")){
         novoValor = novoValor.replaceAll(".",""); 
        }
        novoValor = novoValor.trim();       
        novoValor =  novoValor.replaceAll(",", '.');
        var retorno =  Number(novoValor);
        return retorno;
    }


}