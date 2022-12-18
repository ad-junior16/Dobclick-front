
import { Box, Card, CardContent, styled, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import GraficoSemanaOptions from "./graficoSemana";
import GraficoEstoqueCritico from "./graficoEstoqueCritico";
import GraficoLinha from "./graficoLinha";
import { useContext, useEffect, useState } from "react";
import User from "../../models/User.model";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Layout from "../../components/layout/Layout/Layout";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { ResponseModel } from "../../models/Response.model";
import { Produto } from "../../models/Produto.model";


const apiURL = import.meta.env.VITE_APIURL;


function CircularProgressEstoqueCriticoVermelho(props: CircularProgressProps) {
    return (
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[300],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"

                sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#FF1A3C' : '#FF1A3C'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}

function CircularProgressEstoqueCriticoAmarelo(props: CircularProgressProps) {
    return (
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[300],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#FFF11E' : '#FFF11E'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}



function Home() {
    let userData: User = new User();
    const [usuarioName, setUsuarioName] = useState<string | undefined>("");
    const [usuario, setUsuario] = useState<User | null>(null);
    const [isGraphsLoading, setIsGraphsLoading] = useState<boolean>(true);
    const [produtoCritico, setProdutoCritico] = useState<Produto | null>(null);
    const [produtoAtencao,setProdutoAtencao] = useState<Produto | null>(null);
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    var numeroTentativa = 0;



    useEffect(() => {
        if (context?.isAuthenticated == false) {
            navigate("/");
        } else if (context?.user == null) {
            var usu = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;

            setUsuario(usu);
            setUsuarioName(usu.nome);

        } else {
            setUsuarioName(context?.user?.nome);
        }

        //pega os dados do back
        getGraficosData();

        // setTimeout(function () {
        //     //your code to be executed after 1 second
        //     setIsGraphsLoading(false);
        // }, 1500);



    },[]);

    async function getGraficosData() {

        if (usuario?.Id == null) {
            var usu = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;

            setUsuario(usu);
         
            if (numeroTentativa == 0) {
                numeroTentativa++;
                await axios.post<ResponseModel<any>>(apiURL + "/graficos/obterDadosGraficos", {
                    "usuarioId": usu.Id
                }).then((response) => {
      
                    const dataGraficoSemana = response.data.data.GraficoSemana;
                    GraficoSemanaOptions.series = [{
                        name: "Lucro",
                        data: dataGraficoSemana
                    }];
                    const dataGraficoLinha = response.data.data.MaisVendidoSemana;
                    GraficoLinha.series = [{
                        name: dataGraficoLinha.name,
                        data: dataGraficoLinha.data
                    }]


                    setProdutoCritico(response.data.data.EstoqueCritico);
                    setProdutoAtencao(response.data.data.EstoqueAtencao);

                    setIsGraphsLoading(false);
                });
            }

        } else {
            if (numeroTentativa == 0) {
                numeroTentativa++;
                await axios.post<ResponseModel<any>>(apiURL + "/graficos/obterDadosGraficos", {
                    "usuarioId": usuario?.Id
                }).then((response) => {
      
                    const dataGraficoSemana = response.data.data.GraficoSemana;
                    GraficoSemanaOptions.series = [{
                        name: "Lucro",
                        data: dataGraficoSemana
                    }];
                    const dataGraficoLinha = response.data.data.MaisVendidoSemana;
                    GraficoLinha.series = [{
                        name: dataGraficoLinha.name,
                        data: dataGraficoLinha.data
                    }]


                    setProdutoCritico(response.data.data.EstoqueCritico);
                    setProdutoAtencao(response.data.data.EstoqueAtencao);

                    setIsGraphsLoading(false);
                });
            }
        }
    }



    return (
        <Layout>

            <h2>Home</h2>
            {usuarioName && <h6>Seja Bem-vindo(a) {usuarioName} ! </h6>}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-12 py-2">
                        <Card raised={true} sx={{ height: 380 }}>

                            {!isGraphsLoading &&

                                <Chart
                                    options={GraficoSemanaOptions.options}
                                    series={GraficoSemanaOptions.series}
                                    type={GraficoSemanaOptions.type}
                                    width={"100%"}
                                    height={380}
                                />

                            }
                            {isGraphsLoading &&
                                <CardContent className="d-flex justify-content-center align-items-center" sx={{ height: 350 }}>
                                    <div className="">

                                        <div className="spinner-border avatar-sm text-primary m-2" role="status"></div>

                                    </div>
                                </CardContent>
                            }

                        </Card>

                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-12 py-2">

                        <Card raised={true} sx={{ height: 380 }} >
                            <div className="mt-2">
                                <h6 className="text-center " style={{ fontSize: "1.1rem" }}><strong> Crítico</strong></h6>
                            </div>
                            {!isGraphsLoading && <CardContent className="d-flex justify-content-center align-items-center">
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgressEstoqueCriticoVermelho variant="determinate" size={"20rem"} value={produtoCritico?.porcentagem} />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-12 text-center">
                                                <strong>
                                                    {produtoCritico?.descricao}
                                                </strong>
                                            </div>
                                            <div className="col-12 text-center">
                                                <strong>
                                                {produtoCritico?.estoque} UN
                                                </strong>
                                            </div>
                                            <div className="col-12 text-center">
                                                <strong>
                                                {produtoCritico?.porcentagem} % do estoque
                                                </strong>
                                            </div>
                                        </div>

                                    </Box>
                                </Box>
                            </CardContent>}

                            {isGraphsLoading &&
                                <CardContent className="d-flex justify-content-center align-items-center" sx={{ height: 350 }}>
                                    <div className="">

                                        <div className="spinner-border avatar-sm text-primary m-2" role="status"></div>

                                    </div>
                                </CardContent>
                            }

                        </Card>
                    </div>

                    <div className="col-md-6 col-lg-6 col-sm-12 py-2">
                        <Card raised={true} sx={{ height: 380 }}>
                            {!isGraphsLoading && <Chart
                                options={GraficoLinha.options}
                                series={GraficoLinha.series}
                                type={GraficoLinha.type}
                                width={"100%"}
                                height={380}
                            />}
                            {isGraphsLoading &&
                                <CardContent className="d-flex justify-content-center align-items-center" sx={{ height: 350 }}>
                                    <div className="">

                                        <div className="spinner-border avatar-sm text-primary m-2" role="status"></div>

                                    </div>
                                </CardContent>
                            }
                        </Card>
                    </div>

                    <div className="col-md-6 col-lg-6 col-sm-12 py-2">
                        <Card raised={true} sx={{ height: 380 }}>
                            <div className="mt-2">
                                <h6 className="text-center"><strong>Atenção</strong></h6>
                            </div>
                            {!isGraphsLoading && <CardContent className="d-flex justify-content-center align-items-center">
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgressEstoqueCriticoAmarelo variant="determinate" size={"20rem"} value={produtoAtencao?.porcentagem} />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-12 text-center">
                                                <strong>
                                                  {produtoAtencao?.descricao}
                                                </strong>
                                            </div>
                                            <div className="col-12 text-center">
                                                <strong>
                                                {produtoAtencao?.estoque} UN
                                                </strong>
                                            </div>
                                            <div className="col-12 text-center">
                                                <strong>
                                                {produtoAtencao?.porcentagem} % do estoque
                                                </strong>
                                            </div>
                                        </div>

                                    </Box>
                                </Box>

                            </CardContent>}

                            {isGraphsLoading &&
                                <CardContent className="d-flex justify-content-center align-items-center" sx={{ height: 350 }}>
                                    <div className="">

                                        <div className="spinner-border avatar-sm text-primary m-2" role="status"></div>

                                    </div>
                                </CardContent>
                            }

                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Home