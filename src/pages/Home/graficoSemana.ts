import { ChartType } from "../../models/ChartOptions.model";

 const GraficoSemanaOptions: ChartType = {
    options: {
        
        chart: {
            id: "basic-bar",
            locales: [{
                
                name: 'en',
                options: {
                    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                    shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    days: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
                    shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                    toolbar: {
                        download: 'Download do SVG',
                        selection: 'Seleção',
                        selectionZoom: 'Zoom da Seleção',
                        zoomIn: 'Mais Zoom',
                        zoomOut: 'Menos Zoom',
                        pan: 'Panoramica',
                        reset: 'Resetar Zoom',
                    }
                }
            }]

        },
        xaxis: {
            categories: ["Domingo","Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
        },
        dataLabels: {
            enabled: true,
            formatter: function (value: any) {
                return "R$" + value;
            },
            offsetY: -20,
            style: {
                fontSize: '10px',
                colors: ["#fff"]
            }

        },
        title: {
            text: "Lucro Diário",
            align: 'left',
            margin: 10,
        }
    },
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

    type: "bar",
};

export default  GraficoSemanaOptions;