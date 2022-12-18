import { Card, CircularProgress } from "@mui/material";
import axios from "axios";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../../components/layout/Layout/Layout";
import { AuthContext } from "../../context/AuthContext";
import Fornecedor from "../../models/Fornecedor.model";
import { ResponseModel } from "../../models/Response.model";
import User from "../../models/User.model";
import "./Suppliers.css";


const SuppliersPage = () => {

    const apiURL = import.meta.env.VITE_APIURL;
    const [fornecedors, setfornecedors] = useState<Fornecedor[]>([]);
    const [isLoading, setisLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fornecedorEditing, setfornecedorEditing] = useState<Fornecedor>();


    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    var idsSelecionados: number[] = [];
    let userData: User | null = new User();
    const context = useContext(AuthContext);


    function selecionarfornecedor(id: number) {
        reset();
        if (isEditing == true) {
            setIsEditing(false);
        }

        setisLoading(true);

        let fornecedor = fornecedors.find((x) => x.Id === id);
        setfornecedorEditing(fornecedor);

        setTimeout(() => {
            setisLoading(false);

        }, 1000);

        // setisLoading(true);
        // await axios.get<ResponseModel<Produto>>(apiURL + "/produtos/consultar/" + id)
        //   .then(async (res) => {

        //     setIsPageLoading(false);
        //     setisLoading(false);
        //     ProdutoEditiingnew = res.data.data;
        //     setProdutoEditing(res.data.data);

        //   }).catch((error) => {
        //     console.log(error);
        //   })

        // setopenModalEditProduto(true);
    }

    const options: MUIDataTableOptions = {
        filterType: 'checkbox',
        onRowClick: ((rowdata, rowmeta) => {
            setIsPageLoading(true);
            setisLoading(true);
            selecionarfornecedor(Number(rowdata[0]));
            setIsEditing(true);
        }),
        onRowsDelete: ((rowsDeleted, newTableData) => {
          var listaIndices: number[] = [];

          rowsDeleted.data.map((values) => {
            listaIndices.push(values.index);
          });

          var listaIds: any[] = [];

          listaIndices.map((indice) => {
            listaIds?.push(fornecedors[indice].Id);
          });


          exlcuirfornecedors(listaIds);
        }),
        rowsSelected: idsSelecionados,
        print: false,
        download: false,
        rowsPerPage: 7,
        textLabels: {
            body: {
                noMatch: "Desculpe, Nenhum Dado foi encontrado!",
                toolTip: "Filtrar",
                columnHeaderTooltip: column => `Ordenar por ${column.label}`
            },
            pagination: {
                next: "Próxima Pagina",
                previous: "Pagina Anterior",
                rowsPerPage: "Linhas por pagina:",
                displayRows: "De",
            },
            toolbar: {
                search: "Pesquisar",
                downloadCsv: "Download do CSV",
                print: "Imprimir",
                viewColumns: "Ver Colunas",
                filterTable: "Filtrar Tabela",
            },
            filter: {
                all: "TUDO",
                title: "FILTROS",
                reset: "REINICIAR",
            },
            viewColumns: {
                title: "Mostrar Colunas",
                titleAria: "Mostrar/Esconder Colunas da Tabela",
            },
            selectedRows: {
                text: "Coluna(s) selecionada(s)",
                delete: "Deletar",
                deleteAria: "Deletar linhas selecionadas",
            },
        }
    };

    var columns = [
        {
            name: "Id",
            label: "Id",
            options: {
                display: false,
                filter: false,
                sort: false,
            }
        },
        {
            name: "descricao",
            label: "Descrição",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "contato",
            label: "Contato",
            options: {
                filter: true,
                sort: true,
            }
        },
    ]

    useEffect(() => {
        userData = context.user;
        setisLoading(true);
        setIsPageLoading(true);
        listarfornecedors();
    }, [])

    const listarfornecedors = async () => {
        if (userData?.Id == undefined) {
            userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
            listarfornecedors();
            return;
        } else {
            await axios.get<ResponseModel<any[]>>(apiURL + "/usuarios/listar-fornecedor/" + userData.Id)
                .then((response) => {
                    var novalista: any[] = [];
                    response.data.data?.map((prod) => {
                        novalista.push(prod);
                    })
                    setisLoading(false);
                    setIsPageLoading(false);
                    setfornecedors(novalista);
                    //   handleClose();
                    reset();
                }).catch((error) => {
                    console.log(error);
                    setisLoading(false);
                });
        }



    }



    const onSubmitClient = async (values: any) => {
        if (userData?.Id == undefined) {
            userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
        }
        await axios.post<ResponseModel<any[]>>(apiURL + "/usuarios/cadastrar-fornecedor", { "nome": values.nome, "contato": values.contato, "userId": userData?.Id })
            .then((response) => {

                if (response.data.success) {

                    toast.success(response.data.message ? response.data.message : "Sucesso!", {
                        type: "success",
                        theme: "colored",
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    // handleClose();

                    setisLoading(false);
                    setIsPageLoading(false);
                    listarfornecedors();
                }


            }).catch((error) => {
                console.log(error);
                setisLoading(false);
                setIsPageLoading(false);
            });
    }

    const onSubmitfornecedordit = async (values: any) => {
        if (userData?.Id == undefined) {
            userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
        }
        let data = { ...values, "usuarioId": userData?.Id }
        await axios.put<ResponseModel<any[]>>(apiURL + "/usuarios/editar-fornecedor", data)
            .then((response) => {

                if (response.data.success) {

                    toast.success(response.data.message ? response.data.message : "Sucesso!", {
                        type: "success",
                        theme: "colored",
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    // handleClose();
                    reset();
                    setIsEditing(false);
                    setisLoading(false);
                    setIsPageLoading(false);
                    listarfornecedors();
                }


            }).catch((error) => {
                console.log(error);
                setisLoading(false);
                setIsPageLoading(false);
            })
    }

    const onDeleteClient = async (id:number) =>{
        if (userData?.Id == undefined) {
            userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
        }
        setisLoading(true);
        axios.delete<ResponseModel<any>>(apiURL + '/usuarios/deletar-fornecedor', {
            data: { "id": id }
          })
            .then((res) => {
      
              if (res.data.success) {
      
                toast.success(res.data.message ? res.data.message : "Sucesso!", {
                  type: "success",
                  theme: "colored",
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                listarfornecedors();
                setIsPageLoading(false);
              } else {
                toast.error(res.data.message, {
                  type: "error",
                  theme: "colored",
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                listarfornecedors();
                setIsPageLoading(false);
              }
            }).catch((error) => {
              console.log(error);
              setIsPageLoading(false);
            });
    }

    const onDelteMultiple = async (listaIds:number[]) =>{
        axios.delete<ResponseModel<any>>(apiURL + '/usuarios/deletar-lista-fornecedor', {
            data: { "listaids": listaIds }
          })
            .then((res) => {
      
              if (res.data.success) {
      
                toast.success(res.data.message ? res.data.message : "Sucesso!", {
                  type: "success",
                  theme: "colored",
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                listarfornecedors();
                setIsPageLoading(false);
              } else {
                toast.error(res.data.message, {
                  type: "error",
                  theme: "colored",
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                listarfornecedors();
                setIsPageLoading(false);
              }
            }).catch((error) => {
              console.log(error);
              setIsPageLoading(false);
            });
      
    }

    const exlcuirfornecedors = (listaIds: number[]) => {
        if (listaIds.length == 1) {

            onDeleteClient(listaIds[0]);
          } else {
            onDelteMultiple(listaIds);
          }
    }

    const cancelEditClient = () => {
        setIsEditing(false);
        setfornecedorEditing(undefined);
        reset();
    }

    return (
        <Layout>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="container-fluid persons-container px-4 ">
                <Card sx={{ 'height': 700 }} className="shadow ">
                    <div className="card-body h-100">
                        <div className="w-100 d-flex justify-content-center align-content-center">
                            <h1>Fornecedores </h1>
                        </div>
                        <div className="row h-100">
                            <div className="col-6">
                                <Card sx={{ 'height': 300 }} className="p-4 shadow ">

                                    {!isEditing && !isLoading &&
                                        <form onSubmit={handleSubmit(onSubmitClient)}>
                                            <div className="row">
                                                <div className="col-12 mb-3">

                                                    <label htmlFor="exampleInputPassword1" className="form-label">
                                                        Descricao
                                                    </label>
                                                    <input
                                                        {...register("nome", { required: { value: true, message: "Campo Necessário!" } })}
                                                        type="text"

                                                        placeholder="Descricao"
                                                        className={`form-control ${errors.nome?.message != null ? "is-invalid" : ""}`}
                                                        id="exampleInputPassword1" />
                                                    {errors.codigo && <p className="text-danger">{errors.nome.message}</p>}
                                                </div>
                                                <div className="col-12 mb-3">
                                                    <label htmlFor="exampleInputEmail1" className="form-label">Contato</label>
                                                    <input {...register("contato", { required: { value: true, message: "Campo Necessário!" } })}
                                                        type="text"

                                                        placeholder="Contato"
                                                        className={`form-control ${errors.contato?.message != null ? "is-invalid" : ""}`}
                                                        id="exampleInputEmail1"
                                                        aria-describedby="emailHelp" />
                                                    {errors.descricao && <p className="text-danger">{errors.contato?.message}</p>}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-end align-items-end">
                                                <button className="btn btn-danger mx-1" type="button" >Cancelar</button>
                                                <button className="btn btn-success mx-1" placeholder="" type="submit"> Cadastrar fornecedor </button>
                                            </div>
                                        </form>
                                    }

                                    {isEditing && !isLoading &&
                                        <form onSubmit={handleSubmit(onSubmitfornecedordit)}>
                                            <div className="row">
                                                <div className="col-12 mb-3">
                                                    <input type="hidden" value={fornecedorEditing?.Id}  {...register("IdEdit")} />
                                                    <label htmlFor="exampleInputPassword1" className="form-label">
                                                        Nome
                                                    </label>
                                                    <input

                                                        {...register("nomeEdit", { required: { value: true, message: "Campo Necessário!" } })}
                                                        type="text"
                                                        defaultValue={fornecedorEditing?.descricao}
                                                        placeholder="Nome"
                                                        className={`form-control ${errors.nome?.message != null ? "is-invalid" : ""}`}
                                                        id="exampleInputPassword1" />
                                                    {errors.codigo && <p className="text-danger">{errors.nome.message}</p>}
                                                </div>
                                                <div className="col-12 mb-3">
                                                    <label htmlFor="exampleInputEmail1" className="form-label">Contato</label>
                                                    <input
                                                        {...register("contatoEdit", { required: { value: true, message: "Campo Necessário!" } })}
                                                        type="text"

                                                        defaultValue={fornecedorEditing?.contato}
                                                        placeholder="Contato"
                                                        className={`form-control ${errors.contato?.message != null ? "is-invalid" : ""}`}
                                                        id="exampleInputEmail1"
                                                        aria-describedby="emailHelp" />
                                                    {errors.descricao && <p className="text-danger">{errors.contato?.message}</p>}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-end align-items-end">
                                                <button onClick={cancelEditClient} className="btn btn-danger mx-1" type="button" >Cancelar</button>
                                                <button className="btn btn-primary mx-1" placeholder="" type="submit"> Editar fornecedor </button>
                                            </div>
                                        </form>
                                    }

                                    {isLoading &&
                                        <div className="h-100 d-flex justify-content-center align-items-center">
                                            <CircularProgress></CircularProgress>
                                        </div>
                                    }

                                </Card>
                            </div>
                            <div className="col-6">

                                <MUIDataTable
                                    title={"Lista De fornecedors"}
                                    data={fornecedors}
                                    columns={columns}
                                    options={options}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>


        </Layout>
    );
}

export default SuppliersPage;