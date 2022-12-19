import { SetStateAction, useContext, useEffect, useState } from "react";
import {
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails
} from "@mui/material";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Preloader from "../../components/preloader/Preloader";
import Layout from "../../components/layout/Layout/Layout";
import { useFetch } from "../../hooks/useFetch";
import axios from "axios";
import User from "../../models/User.model";
import { HttpRequestType } from "../../models/HttpRequest.model";
import { Produto } from "../../models/Produto.model";
import { ResponseModel } from "../../models/Response.model";
import { AuthContext } from "../../context/AuthContext";
import CurrencyInput from 'react-currency-input-field';
import jwtDecode from "jwt-decode";

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
    resetEdit();
    setopenModalEditProduto(false);
  }


  const ModalAddProdutoCancelar = () => {
    reset();
    setopenModalAddProduto(false);
  }

  const ModalEditarProdutoCancelar = () => {
    setProdutoEditing(new Produto());
    resetEdit();
    setopenModalEditProduto(false);
  }

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<{
    controls: {
      usuarioId: string,
      codigo: string,
      descricao: string,
      tamanho: string,
      genero: string,
      cor: string,
      marca: string,
      estoque: string,
      estoqueTotal: string,
      precoDisplay: string
    }[];
  }>({
    defaultValues: {
      controls: [
        {
          usuarioId: '',
          codigo: '',
          descricao: '',
          tamanho: '',
          genero: '',
          cor: '',
          marca: '',
          estoque: '',
          estoqueTotal: '',
          precoDisplay: ''
        }
      ],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "controls", // unique name for your Field Array
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm();


  const onSubmit = async (values: any) => {
    const campos = values.controls;
    setisLoading(true);

    if (userData?.Id == undefined) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
    }

    campos.forEach((formControl: any) => {
      console.log(formControl);

      formControl.usuarioId = userData?.Id;
      formControl.preco = _currencyService.Formatar(formControl?.precoDisplay as string);
    });

    await axios.post<ResponseModel<Produto[]>>(apiURL + '/produtos/cadastrar', {
      data: campos, validateStatus: function (status: number) {
        return status < 500;
      }
    })
      .then(async (response: any) => {
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
        }

      }).catch((error: ResponseModel<any>) => {
        console.log(error.message);
      }).finally(function () {
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
      .then((response: any) => {

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
          resetEdit();
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
        }

      }).catch((error: ResponseModel<any>) => {
        console.log(error.message);
      }).finally(function () {
        setisLoading(false);
        listarProdutos();
      });


  }

  const listarProdutos = async () => {
    if (userData?.Id == undefined) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
      listarProdutos();
      return;
    } else {
      await axios.post<ResponseModel<Produto[]>>(apiURL + "/produtos/listar", { "id": userData?.Id })
        .then((response: any) => {
          var novalista: Produto[] = [];
          response.data.data?.map((prod: any) => {
            novalista.push(prod);
          })
          setisLoading(false);
          setIsPageLoading(false);
          setProdutos(novalista);
          handleClose();
          reset();
          resetEdit();
        }).catch((error: any) => {
          console.log(error);
          setisLoading(false);
        });
    }
  }

  const removerProdutoCriar = (ev: any, index: number) => {
    ev.stopPropagation();
    fields.length == 1 ? '' : remove(index);
  }

  async function selecionarProduto(id: number) {

    setisLoading(true);
    await axios.get<ResponseModel<Produto>>(apiURL + "/produtos/consultar/" + id)
      .then(async (res: any) => {

        setIsPageLoading(false);
        setisLoading(false);
        ProdutoEditiingnew = res.data.data;
        setProdutoEditing(res.data.data);

      }).catch((error: any) => {
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
      .then((res: any) => {

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
      }).catch((error: any) => {
        console.log(error);
        setIsPageLoading(false);
      });
  }

  function exlcuirListasProdutos(listaIds: number[]) {

    setisLoading(true);
    axios.delete<ResponseModel<any>>(apiURL + '/produtos/deletarPorLista', {
      data: { "listaids": listaIds }
    })
      .then((res: any) => {

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
      }).catch((error: any) => {
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
              <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                <div className="row">
                  <div className="col-6 mb-3">
                    <input {...registerEdit("Id")} type="hidden" value={ProdutoEditing?.Id} />
                    <label
                      htmlFor="exampleInputPassword1"
                      className="form-label"
                    >Código
                    </label>
                    <input
                      {...registerEdit("codigo", { required: { value: true, message: "Campo Necessário!" } })}
                      type="text"
                      defaultValue={ProdutoEditing?.codigo}
                      placeholder="Código"
                      className={`form-control ${errorsEdit.codigo?.message != null ? "is-invalid" : ""}`}
                      id="exampleInputPassword1" />
                    {errorsEdit.codigo && <p className="text-danger">{errorsEdit.codigo.message}</p>}
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Descrição</label>
                    <input {...registerEdit("descricao", { required: { value: true, message: "Campo Necessário!" } })}
                      type="text"
                      defaultValue={ProdutoEditing?.descricao}
                      placeholder="Descrição"
                      className={`form-control ${errorsEdit.descricao?.message != null ? "is-invalid" : ""}`}
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp" />
                    {errorsEdit.descricao && <p className="text-danger">{errorsEdit.descricao?.message}</p>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-3 mb-3">
                    <label htmlFor="exampleInputEmail1"
                      className="form-label">Tamanho
                    </label>
                    <input
                      {...registerEdit("tamanho", { required: { value: true, message: "Campo Necessário!" } })}
                      type="text"
                      defaultValue={ProdutoEditing?.tamanho}
                      className={`form-control ${errorsEdit.tamanho?.message != null ? "is-invalid" : ""}`}
                      placeholder="Tamanho"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp" />
                  </div>
                  <div className="col-3 mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Gênero</label>
                    <select
                      {...registerEdit("genero", { required: { value: true, message: "Campo Necessário!" } })}
                      className={`form-select ${errorsEdit.genero?.message != null ? "is-invalid" : ""}`}
                      defaultValue={ProdutoEditing?.genero}
                    >
                      <option value=""  ></option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMININO">Feminino</option>
                      <option value="SEM GENERO">Sem Gênero</option>
                    </select>
                    {errorsEdit.genero && <p className="text-danger">{errorsEdit.genero?.message}</p>}
                  </div>
                  <div className="col-3 mb-3">
                    <label
                      htmlFor="exampleInputEmail1"
                      className="form-label">
                      Cor
                    </label>
                    <input
                      {...registerEdit("cor", { required: { value: true, message: "Campo Necessário!" } })}
                      type="text"
                      defaultValue={ProdutoEditing?.cor}
                      className={`form-control ${errorsEdit.cor?.message != null ? "is-invalid" : ""}`}
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
                      {...registerEdit("marca", { required: { value: true, message: "Campo Necessário!" } })}
                      className={`form-control ${errorsEdit.marca?.message != null ? "is-invalid" : ""}`}
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
                      {...registerEdit("estoque", { required: { value: true, message: "Campo Necessário!" } })}
                      type="number"
                      defaultValue={ProdutoEditing?.estoque}
                      className={`form-control ${errorsEdit.estoque?.message != null ? "is-invalid" : ""}`}
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
                      {...registerEdit("estoqueTotal", { required: { value: true, message: "Campo Necessário!" } })}
                      type="number"
                      defaultValue={ProdutoEditing?.estoqueTotal}
                      className={`form-control ${errorsEdit.estoque?.message != null ? "is-invalid" : ""}`}
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
                      {...registerEdit("precoDisplay", { required: { value: true, message: "Campo Necessário!" } })}
                      className={`form-control ${errorsEdit.precoDisplay?.message != null ? "is-invalid" : ""}`}
                    >
                    </CurrencyInput>
                  </div>
                </div>
                <div className="d-flex justify-content-end align-items-end">
                  <button className="btn btn-danger mx-1" type="button" onClick={ModalEditarProdutoCancelar}>Cancelar</button>
                  <button className="btn btn-primary mx-1" placeholder="" type="submit"> Alterar Produto </button>
                </div>
              </form>
            }
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

              <div>
                {fields.map((item, index) => {
                  var errorControls = errors.controls;

                  return (
                    <Accordion key={item.id} defaultExpanded={true}>
                      <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={faChevronDown} size={'1x'} />}
                        aria-controls={`produto-${index}-content`}
                        id={`produto-${index}-header`}
                      >
                        <Typography>
                          <button className="btn btn-danger mx-1" type="button" onClick={(ev) => removerProdutoCriar(ev, index)}><FontAwesomeIcon icon={faMinus} size={'1x'} /></button>
                          Produto - {index + 1}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="row">
                          <div className="col-6 mb-3">
                            <input type="hidden" value={userData?.Id} {...register(`controls.${index}.usuarioId`)} />
                            <label className="form-label">Código</label>
                            <input
                              {...register(`controls.${index}.codigo`, { required: { value: true, message: "Campo Necessário!" } })}
                              type="text"
                              placeholder="Código"
                              className={`form-control ${errorControls && errorControls[index]?.codigo != null ? "is-invalid" : ""}`}
                            />
                            {errorControls && errorControls[index]?.codigo &&
                              <p className="text-danger">{errorControls && errorControls[index]?.codigo?.message}</p>
                            }
                          </div>
                          <div className="col-6 mb-3">
                            <label className="form-label">Descrição</label>
                            <input {...register(`controls.${index}.descricao`, { required: { value: true, message: "Campo Necessário!" } })}
                              type="text"
                              placeholder="Descrição"
                              className={`form-control ${errorControls && errorControls[index]?.descricao != null ? "is-invalid" : ""}`}
                              aria-describedby="emailHelp" />
                            {errorControls && errorControls[index]?.descricao &&
                              <p className="text-danger">{errorControls && errorControls[index]?.descricao?.message}</p>
                            }
                          </div>
                          <div className="col-3 mb-3">
                            <label className="form-label">Tamanho</label>
                            <input
                              {...register(`controls.${index}.tamanho`, { required: { value: true, message: "Campo Necessário!" } })}
                              type="text"
                              className={`form-control ${errorControls && errorControls[index]?.tamanho != null ? "is-invalid" : ""}`}
                              placeholder="Tamanho"
                              aria-describedby="emailHelp" />
                            {errorControls && errorControls[index]?.tamanho &&
                              <p className="text-danger">{errorControls && errorControls[index]?.tamanho?.message}</p>
                            }
                          </div>
                          <div className="col-3 mb-3">
                            <label className="form-label">Gênero</label>
                            <select
                              {...register(`controls.${index}.genero`, { required: { value: true, message: "Campo Necessário!" } })}
                              className={`form-select ${errorControls && errorControls[index]?.genero?.message != null ? "is-invalid" : ""}`}
                            >
                              <option value=""  ></option>
                              <option value="MASCULINO">Masculino</option>
                              <option value="FEMININO">Feminino</option>
                              <option value="SEM GENERO">Sem Gênero</option>
                            </select>
                            {errorControls && errorControls[index]?.genero &&
                              <p className="text-danger">{errorControls && errorControls[index]?.genero?.message}</p>
                            }
                          </div>
                          <div className="col-3 mb-3">
                            <label className="form-label">Cor</label>
                            <input
                              {...register(`controls.${index}.cor`, { required: { value: true, message: "Campo Necessário!" } })}
                              type="text"
                              className={`form-control ${errorControls && errorControls[index]?.cor != null ? "is-invalid" : ""}`}
                              placeholder="Cor"
                              aria-describedby="emailHelp" />
                            {errorControls && errorControls[index]?.cor &&
                              <p className="text-danger">{errorControls && errorControls[index]?.cor?.message}</p>
                            }
                          </div>
                          <div className="col-3 mb-3">
                            <label className="form-label">Marca</label>
                            <input
                              {...register(`controls.${index}.marca`, { required: { value: true, message: "Campo Necessário!" } })}
                              className={` form-control ${errorControls && errorControls[index]?.marca != null ? "is-invalid" : ""}`}
                            />
                            {errorControls && errorControls[index]?.marca &&
                              <p className="text-danger">{errorControls && errorControls[index]?.marca?.message}</p>
                            }
                          </div>
                          <div className="col-4 mb-3">
                            <label className="form-label">Estoque Total</label>
                            <input
                              {...register(`controls.${index}.estoqueTotal`, { required: { value: true, message: "Campo Necessário!" } })}
                              type="number"
                              className={` form-control ${errorControls && errorControls[index]?.estoqueTotal != null ? "is-invalid" : ""}`}
                            />
                            {errorControls && errorControls[index]?.estoqueTotal &&
                              <p className="text-danger">{errorControls && errorControls[index]?.estoqueTotal?.message}</p>
                            }
                          </div>
                          <div className="col-4 mb-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label">
                              Estoque Atual
                            </label>
                            <input
                              {...register(`controls.${index}.estoque`, { required: { value: true, message: "Campo Necessário!" } })}
                              type="number"
                              className={` form-control ${errorControls && errorControls[index]?.estoque != null ? "is-invalid" : ""}`}
                            />
                            {errorControls && errorControls[index]?.estoque &&
                              <p className="text-danger">{errorControls && errorControls[index]?.estoque?.message}</p>
                            }
                          </div>

                          <div className="col-4 mb-3">
                            <label className="form-label">Preço UN</label>
                            <CurrencyInput
                              id="input-example"
                              decimalSeparator=","
                              groupSeparator=""
                              placeholder="R$ 0.00"
                              intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                              onKeyDown={(e) => {
                                if (e.ctrlKey && e.key === "Tab") {
                                  console.log("Tab");
                                }

                              }}
                              {...register(`controls.${index}.precoDisplay`, { required: { value: true, message: "Campo Necessário!" } })}
                              className={` form-control ${errorControls && errorControls[index]?.precoDisplay != null ? "is-invalid" : ""}`}
                            >
                            </CurrencyInput>
                            {errorControls && errorControls[index]?.precoDisplay &&
                              <p className="text-danger">{errorControls && errorControls[index]?.precoDisplay?.message}</p>
                            }
                          </div>

                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )
                })}

                <div className="d-flex justify-content-between align-items-end" style={{
                  position: 'sticky',
                  bottom: '-24px',
                  background: 'white',
                  padding: '20px 24px',
                  margin: '6px -20px 0 -24px'
                }}>
                  <button className="btn btn-primary mx-1" type="button" onClick={() => append({
                    usuarioId: '',
                    codigo: '',
                    descricao: '',
                    tamanho: '',
                    genero: '',
                    cor: '',
                    marca: '',
                    estoque: '',
                    estoqueTotal: '',
                    precoDisplay: ''
                  })}>Adicionar Produto</button>
                  <div className="d-flex justify-content-end align-items-end">
                    <button className="btn btn-danger mx-1" type="button" onClick={ModalAddProdutoCancelar}>Cancelar</button>
                    <button className="btn btn-success mx-1" placeholder="" type="submit"> Criar Produtos </button>
                  </div>
                </div>
              </div>
            </form>
          }
        </DialogContent>
      </Dialog>
    </Layout >
  )
}

export default EstoquePage