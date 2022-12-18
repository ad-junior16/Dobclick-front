import { ChartType } from "../../models/ChartOptions.model";

const GraficoEstoqueCritico: ChartType = {
    options: {
        title: {
            text: "Estoque Critico",
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
        
    },
    
    type: "donut",
    series: [15,85],

    responsive: [{
        breakpoint: 1000,
        options: {
            chart: {
                width: "100%"
            },
            legend: {
                position: 'bottom'
            }
        }
    }],

}

export default GraficoEstoqueCritico;
