import { ChartType } from "../../models/ChartOptions.model";


const GraficoLinha: ChartType = {
    
    options: {
        title: {
            text: "Produto Mais Vendido da semana",
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: undefined,
                color: '#263238'
            },
        },
        xaxis: {
            categories: ['Dom','Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
          },
    },
    type: "line",
    series: [{
        name: "Camisa Polo GG",
        data: [10,15,12,25,50]
    }],
    title: {
        text: "Produto Mais Vendido da Semana",
        align: 'left',
        margin: 10,
    }



}

export default GraficoLinha;