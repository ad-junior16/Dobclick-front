import { Card, Chip, Dialog, DialogContent, DialogTitle, Table } from "@mui/material";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Preloader from "../../components/preloader/Preloader";
import { useFetch } from "../../hooks/useFetch";
import { HttpRequestType } from "../../models/HttpRequest.model";
import { Produto } from "../../models/Produto.model";
import axios from "axios";
import { ResponseModel } from "../../models/Response.model";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../../components/layout/Layout/Layout";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import User from "../../models/User.model";
import { AuthContext } from "../../context/AuthContext";
import CurrencyInput from 'react-currency-input-field';
import CurrencyService from "../../services/CurrencyService";


const EstoquePage = () => {
  const apiURL = import.meta.env.VITE_APIURL;
  const _currencyService = new CurrencyService();
  let userData: User | null = new User();
  const context = useContext(AuthContext);

  //Data Table Options
  const [produtos, setProdutos] = useState<Produto[]>([]);
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
      name: "codigo",
      label: "Código",
      options: {
        filter: true,
        sort: true,
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
      name: "tamanho",
      label: "Tamanho",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "marca",
      label: "Marca",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "cor",
      label: "Cor",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "genero",
      label: "Gênero",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "estoque",
      label: "Estoque Atual",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "estoqueTotal",
      label: "Estoque Total",
      options: {
        filter: false,
        sort: false,
      }
    },
  ]

  var idsSelecionados: number[] = [];

  const options: MUIDataTableOptions = {
    filterType: 'checkbox',
    onRowClick: ((rowdata, rowmeta) => {
      setIsPageLoading(true);
      selecionarProduto(Number(rowdata[0]));

    }),
    onRowsDelete: ((rowsDeleted, newTableData) => {
      var listaIndices: number[] = [];

      rowsDeleted.data.map((values) => {
        listaIndices.push(values.index);
      });

      var listaIds: any[] = [];

      listaIndices.map((indice) => {
        listaIds?.push(produtos[indice].Id);
      });


      exlcuirProduto(listaIds);
    }),
    rowsSelected: idsSelecionados,
    print: false,
    download: false,
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


  //  /DataTableOptions


  const [openModalAddProduto, setopenModalAddProduto] = useState(false);
  const [openModalEditarProduto, setopenModalEditProduto] = useState(false);
  const [ProdutoEditing, setProdutoEditing] = useState<Produto>();

  let ProdutoEditiingnew: SetStateAction<Produto | undefined>;

  const [isLoading, setisLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const handleClickOpen = () => {
    setopenModalAddProduto(true);
  };

  const handleClose = () => {
    reset();
    setopenModalAddProduto(false);
  };

  const handleCloseEdit = () => {
    setProdutoEditing(new Produto());
    reset();
    setopenModalEditProduto(false);
  }


  const ModalAddProdutoCancelar = () => {
    reset();
    setopenModalAddProduto(false);
  }

  const ModalEditarProdutoCancelar = () => {
    setProdutoEditing(new Produto());
    reset();
    setopenModalEditProduto(false);
  }


  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  const onSubmit = async (values: any) => {
    if (userData?.Id == undefined) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
    }
    values.usuarioId = userData?.Id;
    values.preco = _currencyService.Formatar(values?.precoDisplay as string);

    await axios.post<ResponseModel<Produto[]>>(apiURL + '/produtos/cadastrar', {
      data: values, validateStatus: function (status: number) {
        return status < 500;
      }
    })
      .then(async (response) => {
        setisLoading(false);
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
          handleClose();
          listarProdutos();
        } else {
          toast.error(response.data.message, {
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
          setisLoading(false);

        }


      }).catch((error: ResponseModel<any>) => {
        console.log(error.message);
        setisLoading(false);
        listarProdutos();
      });

  }

  const onSubmitEdit = async (values: any) => {
    setisLoading(true);
    if (userData?.Id == undefined) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
    }
    values.usuarioId = userData?.Id;
    values.preco = _currencyService.Formatar(values?.precoDisplay as string);

    await axios.put<ResponseModel<any>>(apiURL + "/produtos/editar", {
      data: values
    })
      .then((response) => {
        setisLoading(false);

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
          handleCloseEdit();
          reset();
          listarProdutos();
        } else {

          toast.error(response.data.message, {
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
          listarProdutos();


        }


      }).catch((error) => {

      });


  }

  const listarProdutos = async () => {
    if (userData?.Id == undefined) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
      listarProdutos();
      return;
    } else {
      await axios.post<ResponseModel<Produto[]>>(apiURL + "/produtos/listar", { "id": userData?.Id })
        .then((response) => {
          var novalista: Produto[] = [];
          response.data.data?.map((prod) => {
            novalista.push(prod);
          })
          setisLoading(false);
          setIsPageLoading(false);
          setProdutos(novalista);
          handleClose();
          reset();
        }).catch((error) => {
          console.log(error);
          setisLoading(false);
        });
    }



  }



  async function selecionarProduto(id: number) {

    setisLoading(true);
    await axios.get<ResponseModel<Produto>>(apiURL + "/produtos/consultar/" + id)
      .then(async (res) => {

        setIsPageLoading(false);
        setisLoading(false);
        ProdutoEditiingnew = res.data.data;
        setProdutoEditing(res.data.data);

      }).catch((error) => {
        console.log(error);
      })

    setopenModalEditProduto(true);
  }

  function exlcuirProduto(listaIds: number[]) {
    setIsPageLoading(true);
    if (listaIds.length == 1) {

      excluirUnicoProduto(listaIds[0]);
    } else {
      exlcuirListasProdutos(listaIds);
    }
  }

  function excluirUnicoProduto(id: number) {
    setisLoading(true);
    axios.delete<ResponseModel<any>>(apiURL + '/produtos', {
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
          listarProdutos();
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
          listarProdutos();
          setIsPageLoading(false);
        }
      }).catch((error) => {
        console.log(error);
        setIsPageLoading(false);
      });
  }

  function exlcuirListasProdutos(listaIds: number[]) {

    setisLoading(true);
    axios.delete<ResponseModel<any>>(apiURL + '/produtos/deletarPorLista', {
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
          listarProdutos();
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
          listarProdutos();
          setIsPageLoading(false);
        }
      }).catch((error) => {
        console.log(error);
        setIsPageLoading(false);
      });

  }

  useEffect(() => {
    userData = context.user;
    setisLoading(true);
    setIsPageLoading(true);
    listarProdutos();


  }, []);



  useEffect(() => {
    if (ProdutoEditing?.Id != 0 && ProdutoEditing?.Id != null) {
      setopenModalEditProduto(true);

    }
  }, [ProdutoEditing])


  const CustomChip = ({ }) => {
    return (
      <Chip
        variant="outlined"
        color="secondary"

      />
    );
  };

  return (
    <Layout>

      {isPageLoading && <Preloader />}
      <h2> Produto </h2>
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
      <div className="row">
        <div className="col-md-12 p-3">
          <button className="btn btn-primary" onClick={handleClickOpen}> Adicionar Produto</button>
        </div>
      </div>

      {/* Modal de editar Produto */}
      {openModalEditarProduto &&
        <Card raised={true} sx={{ marginBottom: 10 }} >
          {!isLoading &&
            <DialogTitle sx={{ textAlign: "center" }}>Editar Produto</DialogTitle>
          }
          <DialogContent>
            {isLoading &&
              <div className="m-5 p-5">
                <Preloader />
              </div>
            }

            {!isLoading &&
              <form onSubmit={handleSubmit(onSubmitEdit)}>
                <div className="row">
                  <div className="col-6 mb-3">
                    <input {...register("Id")} type="hidden" value={ProdutoEditing?.Id} />
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >Código
                    </label>
                    <input
                      {...register("codigo", { required: { value: true, message: "Campo Necessário!" } })}
                      type="text"
                      defaultValue={ProdutoEditing?.codigo}
                      placeholder="Código"
                      className={`form-control ${errors.codigo?.message != null ? "is-invalid" : ""}`}
                      id="exampleInputPassword1" />
                    {errors.codigo && <p className="text-danger">{errors.codigo.message}</p>}
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Descrição</label>
                    <input {...register("descricao", { required: { value: true, message: "Campo Necessário!" } })}
                      type="text"
                      defaultValue={ProdutoEditing?.descricao}
                      placeholder="Descrição"
                      className={`form-control ${errors.descricao?.message != null ? "is-invalid" : ""}`}
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp" />
                    {errors.descricao && <p className="text-danger">{errors.descricao?.message}</p>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-3 mb-3">
                    <label htmlFor="exampleInputEmail1"
                      className="form-label">Tamanho
                    </label>
                    <input
                      {...register("tamanho", { required: { value: true, message: "Campo Necessário!" } })}
                      type="text"
                      defaultValue={ProdutoEditing?.tamanho}
                      className={`form-control ${errors.tamanho?.message != null ? "is-invalid" : ""}`}
                      placeholder="Tamanho"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp" />
                  </div>
                  <div className="col-3 mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Gênero</label>
                    <select
                      {...register("genero", { required: { value: true, message: "Campo Necessário!" } })}
                      className={`form-select ${errors.genero?.message != null ? "is-invalid" : ""}`}
                      defaultValue={ProdutoEditing?.genero}
                    >
                      <option value=""  ></option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO">Feminino</option>
                      <option value="SEM GENERO">Sem Gênero</option>
                    </select>
                    {errors.genero && <p className="text-danger">{errors.genero?.message}</p>}
                  </div>
                  <div className="col-3 mb-3">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label">
                      Cor
                    </label>
                    <input
                      {...register("cor", { required: { value: true, message: "Campo Necessário!" } })}
                      type="text"
                      defaultValue={ProdutoEditing?.cor}
                      className={`form-control ${errors.cor?.message != null ? "is-invalid" : ""}`}
                      placeholder="Cor"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp" />
                  </div>
                  <div className="col-3 mb-3">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label">
                      Marca
                    </label>
                    <input
                      {...register("marca", { required: { value: true, message: "Campo Necessário!" } })}
                      className={`form-control ${errors.marca?.message != null ? "is-invalid" : ""}`}
                      defaultValue={ProdutoEditing?.marca}
                    >
                
                    </input>

                  </div>

                </div>
                <div className="row">
                  <div className="col-4 mb-3">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label">
                      Estoque Atual
                    </label>
                    <input
                      {...register("estoque", { required: { value: true, message: "Campo Necessário!" } })}
                      type="number"
                      defaultValue={ProdutoEditing?.estoque}
                      className={`form-control ${errors.estoque?.message != null ? "is-invalid" : ""}`}
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp" />
                  </div>
                  <div className="col-4 mb-3">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label">
                      Estoque total
                    </label>
                    <input
                      {...register("estoqueTotal", { required: { value: true, message: "Campo Necessário!" } })}
                      type="number"
                      defaultValue={ProdutoEditing?.estoqueTotal}
                      className={`form-control ${errors.estoque?.message != null ? "is-invalid" : ""}`}
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp" />
                  </div>
                  <div className="col-4 mb-3">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label">
                      Preço UN
                    </label>
                    <CurrencyInput
                      id="input-example"
                      decimalSeparator=","
                      groupSeparator=""
                      defaultValue={ProdutoEditing?.preco}
                      placeholder="R$ 0.00"
                      intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                      {...register("precoDisplay", { required: { value: true, message: "Campo Necessário!" } })}
                      className={`form-control ${errors.precoDisplay?.message != null ? "is-invalid" : ""}`}
                    >
                    </CurrencyInput>
                  </div>
                </div>
                <div className="d-flex justify-content-end align-items-end">
                  <button className="btn btn-danger mx-1" type="button" onClick={ModalEditarProdutoCancelar}>Cancelar</button>
                  <button className="btn btn-primary mx-1" placeholder="" type="submit"> Alterar Produto </button>
                </div>
              </form>}


          </DialogContent>
        </Card>}

      {/* <TableComponent  data={produtos} colunas={columns} /> */}
      <MUIDataTable
        title={"Lista De Produtos"}
        data={produtos}
        columns={columns}
        options={options}
      />





      {/* Modal de Adicionar Produto */}
      <Dialog open={openModalAddProduto} onClose={handleClose} fullWidth={true} maxWidth={"lg"}>
        {!isLoading &&
          <DialogTitle sx={{ textAlign: "center" }}>Cadastrar Produtos</DialogTitle>
        }
        <DialogContent>
          {isLoading &&
            <div className="m-5 p-5">
              <Preloader />
            </div>
          }

          {!isLoading &&
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-6 mb-3">
                  <input type="hidden" value={userData?.Id} {...register("usuarioId")} />
                  <label
                    htmlFor="exampleInputPassword1"
                    className="form-label"
                  >Código
                  </label>
                  <input
                    {...register("codigo", { required: { value: true, message: "Campo Necessário!" } })}
                    type="text"
                    placeholder="Código"
                    className={`form-control ${errors.codigo?.message != null ? "is-invalid" : ""}`}
                    id="exampleInputPassword1" />
                  {errors.codigo && <p className="text-danger">{errors.codigo.message}</p>}
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Descrição</label>
                  <input {...register("descricao", { required: { value: true, message: "Campo Necessário!" } })}
                    type="text"
                    placeholder="Descrição"
                    className={`form-control ${errors.descricao?.message != null ? "is-invalid" : ""}`}
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp" />
                  {errors.descricao && <p className="text-danger">{errors.descricao?.message}</p>}
                </div>
              </div>
              <div className="row">
                <div className="col-3 mb-3">
                  <label htmlFor="exampleInputEmail1"
                    className="form-label">Tamanho
                  </label>
                  <input
                    {...register("tamanho", { required: { value: true, message: "Campo Necessário!" } })}
                    type="text"

                    className={`form-control ${errors.tamanho?.message != null ? "is-invalid" : ""}`}
                    placeholder="Tamanho"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp" />
                </div>
                <div className="col-3 mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Gênero</label>
                  <select
                    {...register("genero", { required: { value: true, message: "Campo Necessário!" } })}
                    className={`form-select ${errors.genero?.message != null ? "is-invalid" : ""}`}
                  >
                    <option value=""  ></option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                    <option value="SEM GENERO">Sem Gênero</option>
                  </select>
                  {errors.genero && <p className="text-danger">{errors.genero?.message}</p>}
                </div>
                <div className="col-3 mb-3">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label">
                    Cor
                  </label>
                  <input
                    {...register("cor", { required: { value: true, message: "Campo Necessário!" } })}
                    type="text"
                    className={`form-control ${errors.cor?.message != null ? "is-invalid" : ""}`}
                    placeholder="Cor"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp" />
                </div>
                <div className="col-3 mb-3">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label">
                    Marca
                  </label>
                  <input
                    {...register("marca", { required: { value: true, message: "Campo Necessário!" } })}
                    className={` form-control ${errors.marca?.message != null ? "is-invalid" : ""}`}
                  >
           
                  </input>

                </div>
              </div>
              <div className="row">
              <div className="col-4 mb-3">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label">
                    Estoque Total
                  </label>

                  <input
                    {...register("estoqueTotal", { required: { value: true, message: "Campo Necessário!" } })}
                    type="number"
                    className={`form-control ${errors.estoque?.message != null ? "is-invalid" : ""}`}
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp" />
                </div>
                <div className="col-4 mb-3">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label">
                    Estoque Atual
                  </label>
                  <input
                    {...register("estoque", { required: { value: true, message: "Campo Necessário!" } })}
                    type="number"
                    className={`form-control ${errors.estoque?.message != null ? "is-invalid" : ""}`}
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp" />
                </div>
         
                <div className="col-4 mb-3">
                  <label
                    htmlFor="exampleInputEmail1"
                    className="form-label">
                    Preço UN
                  </label>

                  <CurrencyInput
                    id="input-example"
                    decimalSeparator=","
                    groupSeparator=""
                    placeholder="R$ 0.00"
                    intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                    {...register("precoDisplay", { required: { value: true, message: "Campo Necessário!" } })}
                    className={`form-control ${errors.precoDisplay?.message != null ? "is-invalid" : ""}`}
                  >
                  </CurrencyInput>
                </div>

              </div>
              <div className="d-flex justify-content-end align-items-end">
                <button className="btn btn-danger mx-1" type="button" onClick={ModalAddProdutoCancelar}>Cancelar</button>
                <button className="btn btn-success mx-1" placeholder="" type="submit"> Criar Produto </button>
              </div>
            </form>}
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export default EstoquePage;