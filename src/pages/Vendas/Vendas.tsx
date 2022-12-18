import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { Autocomplete, Box, Card, Dialog, DialogContent, DialogTitle, MenuItem, Select, SelectChangeEvent, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState, useContext } from "react";
import Layout from "../../components/layout/Layout/Layout"
import Venda, { FormaPagamentoEnum } from "../../models/Venda.model";
import Preloader from "../../components/preloader/Preloader";
import User from "../../models/User.model";
import './Vendas.css';
import { AuthContext } from "../../context/AuthContext";
import { VendasColumns } from './VendasColumns';



import { Produto } from "../../models/Produto.model";
const apiURL = import.meta.env.VITE_APIURL;
import { ResponseModel } from "../../models/Response.model";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
import CurrencyService from "../../services/CurrencyService";
import { toast, ToastContainer } from "react-toastify";
import Compra from "../../models/Compra.model";
import { ComprasColumns } from "./ComprasColumns";
import Cliente from "../../models/Cliente.model";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const Vendas = () => {

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [openModalAddVenda, setopenModalAddVenda] = useState(false);
  const [openModalAddCompras, setOpenModalAddCompras] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [vendas, setVenda] = useState<Venda[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [value, setValue] = useState(0);

  const [totalBrutoValue, setTotalBruto] = useState<number>(0);
  const [quantidadeSelect, SetQuantidade] = useState<number>(0);
  const [ProdutoSelect, setProdutoSelect] = useState<Produto>(new Produto());
  const [ClienteSelect, setCliente] = useState<Cliente>();
  const _currencyService = new CurrencyService();

  const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  var idsSelecionados: number[] = [];
  let userData: User | null = new User();

  var column = VendasColumns;
  var comprasColumn = ComprasColumns;

  const context = useContext(AuthContext);

  const handleClickOpen = () => {

    setopenModalAddVenda(!openModalAddVenda);
  };

  const handlClickCompraOpen = () => {

    setOpenModalAddCompras(!openModalAddCompras);
  }

  const ModalAddProdutoCancelar = () => {
    setTotalBruto(0);
    reset();
    setopenModalAddVenda(false);
  }

  const ModalAddCompraCancelar = () => {
    reset();
    setOpenModalAddCompras(false);
  }

  useEffect(() => {
    userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
    setisLoading(true);
    setIsPageLoading(true);
    getProdutos();
    getClientes();
    listarVendas();
    listarCompras();



  }, []);



  async function listarVendas() {
    if (userData?.Id == undefined) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
      listarVendas();
      return;
    } else {
      await axios.post<ResponseModel<Venda[]>>(apiURL + "/vendas/listar", { "id": userData?.Id })
        .then((response) => {
          var novalista: Venda[] = [];
          response.data.data?.map((prod) => {
            prod.formaPagamentoDisplay = FormaPagamentoEnum[prod.formaPagamento];
            novalista.push(prod);
          })
          setisLoading(false);
          setIsPageLoading(false);
          setVenda(novalista);
          console.log(response.data.data)
          reset();
        }).catch((error) => {
          console.log(error);
          setisLoading(false);
          setIsPageLoading(false);
        });
    }
  }

  async function listarCompras() {

    if (userData?.Id == undefined) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
      listarCompras()
      return;
    } else {
      await axios.post<ResponseModel<Venda[]>>(apiURL + "/compras/listar", { "usuarioId": userData?.Id })
        .then((response) => {
          var novalista: Compra[] = [];
          response.data.data?.map((Compra) => {
            Compra.formaPagamentoDisplay = FormaPagamentoEnum[Compra.formaPagamento];
            novalista.push(Compra);
          })
          setisLoading(false);
          setIsPageLoading(false);
          setCompras(novalista);
          // console.log(novalista);

          reset();
        }).catch((error) => {
          console.log(error);
          setisLoading(false);
          setIsPageLoading(false);
        });
    }


  }

  const handleProductChange = (prod: Produto) => {
    setProdutoSelect(prod);
  }

  const handleClienteChange = (cliente: Cliente) => {
    setCliente(cliente);
  }

  const getProdutos = async () => {
    var listaProdutos: Produto[] | null = [];
    if (userData?.Id == undefined) {
      
    } else {
      await axios.post<ResponseModel<Produto[]>>(apiURL + "/produtos/listar", { "id": userData?.Id })
        .then((response) => {
          var novalista: Produto[] = [];
          response.data.data?.map((prod) => {
            novalista.push(prod);
          })

          listaProdutos = novalista;
        }).catch((error) => {
          console.log(error);

        });
    }
    setProdutos(listaProdutos);

  }

  const getClientes = async () => {
    if (userData?.Id == undefined) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User; 
    } else {
      await axios.get<ResponseModel<any[]>>(apiURL + "/usuarios/listar-clientes/" + userData.Id)
      .then((response) => {
          var novalista: any[] = [];
          response.data.data?.map((prod) => {
              novalista.push(prod);
          })
          setisLoading(false);
          setIsPageLoading(false);
          setClientes(novalista);
          //   handleClose();
          reset();
      }).catch((error) => {
          console.log(error);
          setisLoading(false);
      });
    }
  }
  // useEffect(() => {
  //   if (ProdutoEditing?.Id != 0 && ProdutoEditing?.Id != null) {
  //     setopenModalEditProduto(true);

  //   }
  // }, [ProdutoEditing])



  const onSubmit = async (values: any) => {
    setIsPageLoading(true);
    setisLoading(false);


    if (userData?.Id == null) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
    }
    values.produtoId = ProdutoSelect.Id as number;
    values.usuarioId = userData?.Id as number;
    values.valorTotal = _currencyService.Formatar(values?.valorTotalDisplay as string);
    const data = {...values, "cliente": ClienteSelect};

    await axios.post<ResponseModel<Venda>>(apiURL + '/vendas/cadastrar', { data: data }).then((response) => {

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
        listarVendas();
        reset();
        setProdutoSelect(new Produto());
        setisLoading(false);
        setopenModalAddVenda(false)
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
        listarVendas();
        reset();
        setProdutoSelect(new Produto());
        setisLoading(false);
        setopenModalAddVenda(false)
      }

    });
  }

  const onSubmitCompra = async (values: any) => {
    setIsPageLoading(true);
    setisLoading(true);

    if (userData?.Id == null) {
      userData = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;
    }
    values.produtoId = ProdutoSelect.Id as number;
    values.usuarioId = userData?.Id as number;
    values.valorCompra = _currencyService.Formatar(values?.valorCompraDisplay as string);

    await axios.post<ResponseModel<any>>(apiURL + '/compras/cadastrar', {
      data: values
    }).then((response) => {

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
        listarCompras();
        reset();
        setProdutoSelect(new Produto());
        setisLoading(false);
        setOpenModalAddCompras(false)
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
        listarCompras();
        reset();
        setProdutoSelect(new Produto());
        setisLoading(false);
        setOpenModalAddCompras(false)
      }

    });


  };

  const optionsSelect = produtos.map(function (prod: Produto) {
    prod.label = prod.codigo + " - " + prod.descricao + " - " + prod.cor + " - " + prod.genero + " - " + prod.marca;
    return prod;

  })

  const clientesSelection = clientes.map(function(cliente: Cliente)  {
    cliente.label = cliente.nome+ " - " + cliente.contato
    return cliente;
  })

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }




  const options: MUIDataTableOptions = {
    filterType: 'checkbox',
    onRowClick: ((rowdata, rowmeta) => {
      setIsPageLoading(true);
    }),
    onRowsDelete: ((rowsDeleted, newTableData) => {
      var listaIndices: number[] = [];

      rowsDeleted.data.map((values) => {
        listaIndices.push(values.index);
      });

      var listaIds: any[] = [];

      listaIndices.map((indice) => {
        listaIds?.push(vendas[indice].Id);
      });


      exlcuirVenda(listaIds);
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

  const optionsCompra: MUIDataTableOptions = {
    filterType: 'checkbox',
    onRowClick: ((rowdata, rowmeta) => {

    }),
    onRowsDelete: ((rowsDeleted, newTableData) => {
      var listaIndices: number[] = [];

      rowsDeleted.data.map((values) => {
        listaIndices.push(values.index);
      });

      var listaIds: any[] = [];

      listaIndices.map((indice) => {
        listaIds?.push(compras[indice].Id);
      });


      exlcuirCompras(listaIds);
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

  function exlcuirCompras(listaIds: number[]) {
    setIsPageLoading(true);
    if (listaIds.length == 1) {
      excluirUnicaCompra(listaIds[0]);
    } else {
      excluirListasCompras(listaIds);
    }
  }

  function excluirUnicaCompra(id: number) {

    axios.delete<ResponseModel<any>>(apiURL + '/compras/delete', {
      data: { "id": id }
    }).then((response) => {

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
        listarCompras();
        setIsPageLoading(false);
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
        listarCompras();
        setIsPageLoading(false);
      }

    }).catch((error) => {
      console.log(error);
      setIsPageLoading(false);
    });

  }


  function excluirListasCompras(listaids: number[]) {

    axios.delete<ResponseModel<any>>(apiURL + '/compras/deleteporLista', {
      data: { "listaids": listaids }
    }).then((response) => {

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
        listarCompras();
        setIsPageLoading(false);
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
        listarCompras();
        setIsPageLoading(false);
      }

    }).catch((error) => {
      console.log(error);
      setIsPageLoading(false);
    });

  }


  function exlcuirVenda(listaIds: number[]) {
    setIsPageLoading(true);
    if (listaIds.length == 1) {

      excluirUnicaVenda(listaIds[0]);
    } else {
      exlcuirListasVendas(listaIds);
    }
  }

  function excluirUnicaVenda(id: number) {
    setIsPageLoading(true);

    axios.delete<ResponseModel<any>>(apiURL + '/vendas/delete', {
      data: { "id": id }
    }).then((response) => {

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
        listarVendas();
        setIsPageLoading(false);
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
        listarVendas();
        setIsPageLoading(false);
      }

    }).catch((error) => {
      console.log(error);
      setIsPageLoading(false);
    });

  }

  function exlcuirListasVendas(listaids: number[]) {

    setisLoading(true);

    axios.delete<ResponseModel<any>>(apiURL + '/vendas/deleteporLista', {
      data: { "listaids": listaids }
    }).then((response) => {

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
        listarVendas();
        setIsPageLoading(false);
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
        listarVendas();
        setIsPageLoading(false);
      }

    });

  }


  return (
    <Layout>
      <div className="">
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
        <Card>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleTabsChange} aria-label="basic tabs example">
                <Tab label="Vendas de Produtos" />
                <Tab label="Compras de Produtos" />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div>
                <div className="row">
                  <div className="col-md-12 p-3">
                    {!openModalAddVenda && <button className="btn btn-primary" onClick={handleClickOpen}> Registrar Venda</button>}                    
                    {openModalAddVenda && <button className="btn btn-primary" onClick={handleClickOpen}> Fechar</button>}
                  </div>                  
                </div>
                
                {isLoading &&
                  <div className="m-5 p-5">
                    <Preloader />
                  </div>
                }
                {!isLoading && openModalAddVenda &&
                  <form onSubmit={handleSubmit(onSubmit)} className="my-4 p-4 border border-2">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <input type="hidden" value={userData?.Id} {...register("usuarioId")} />
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label"
                        >Produto
                        </label>
                        <Autocomplete
                          onChange={(event: React.SyntheticEvent, value: any, reason: any, details: any) => {
                            var produto = value as Produto;
                            handleProductChange(produto);
                          }}

                          value={ProdutoSelect}
                          disablePortal
                          id="combo-box-demo"
                          options={optionsSelect}
                          renderInput={(params) => <TextField {...params} required={true} label="Produto" />}

                        />
                        {/* {errors.produto && <p className="text-danger">{errors.produto?.message}</p>} */}

                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4">
                        <label htmlFor="datavenda">Data de Venda</label>
                        <input
                          {...register("datavenda", { required: { value: true, message: "Campo Necessário!" } })}
                          type="date" className="form-control" name="datavenda" />
                      </div>
                      <div className="col-4">
                        <label htmlFor="quantidade">Quantidade</label>
                        <input
                          {...register("quantidade", { required: { value: true, message: "Campo Necessário!" } })}

                          type="number" step={1} min={0} className="form-control" name="quantidade" />
                      </div>
                      <div className="col-4">
                        <label htmlFor="quantidade">Forma Pagam.</label>
                        <select
                          {...register("formaPag", { required: { value: true, message: "Campo Necessário!" } })}
                          className="form-control"

                        >
                          <option key={''} value={''}></option>
                          <option key={1} value={0}>Dinheiro</option>
                          <option key={2} value={1}>Crédito</option>
                          <option key={3} value={2}>Débito</option>
                          <option key={4} value={3}>Cheque</option>


                        </select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col 4">
                      <label htmlFor="cliente">Cliente</label>
                        
                        <Autocomplete
                          onChange={(event: React.SyntheticEvent, value: any, reason: any, details: any) => {
                            var cliente = value as Cliente;
                            handleClienteChange(cliente);
                          }}

                          value={ClienteSelect}
                          disablePortal
                          options={clientesSelection}
                          renderInput={(params) => <TextField {...params} required={true} label="Cliente" />}

                        />
                      </div>
                      {/* <div className="col 4">
                        <label htmlFor="contatoCliente">Tel. Cliente</label>
                        <input
                          {...register("contatoCliente", { required: { value: true, message: "Campo Necessário!" } })}
                          className="form-control" type="text" />
                      </div> */}
                      <div className="col-4">
                        <label htmlFor="valorpago">Valor a ser Pago</label>
                        <CurrencyInput
                          id="input-example"
                          decimalSeparator=","
                          groupSeparator=""
                          placeholder="R$ 0.00"
                          intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                          {...register("valorTotalDisplay", { required: { value: true, message: "Campo Necessário!" } })}
                          className={`form-control ${errors.precoDisplay?.message != null ? "is-invalid" : ""}`}
                        >
                        </CurrencyInput>
                      </div>

                    </div>
                    <div className="d-flex justify-content-end align-items-end">
                      <button className="btn btn-danger mx-1" type="button" onClick={ModalAddProdutoCancelar}>Cancelar</button>
                      <button className="btn btn-success mx-1" placeholder="" type="submit">Registrar Venda </button>                      
                    </div>
                  </form>}


                <MUIDataTable
                  title={"Vendas"}
                  data={vendas}
                  columns={column}
                  options={options}
                />
              </div>
              
              <button className="relat">Gerar relatório</button>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div>
                <div className="row">
                  <div className="col-md-12 p-3 alignBTN">
                    {!openModalAddCompras && <button className="btn btn-primary" onClick={handlClickCompraOpen}> Registrar Compra</button>}                    
                    {openModalAddCompras && <button className="btn btn-primary" onClick={handlClickCompraOpen}> Fechar</button>}
                  </div>
                </div>

                {!isLoading && openModalAddCompras &&
                  <form onSubmit={handleSubmit(onSubmitCompra)} className="my-4 p-4 border border-2">

                    <div className="row">
                      <div className="col-12 mb-3">
                        <input type="hidden" value={userData?.Id} {...register("usuarioId")} />
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label"
                        >Produto
                        </label>
                        <Autocomplete
                          onChange={(event: React.SyntheticEvent, value: any, reason: any, details: any) => {
                            var produto = value as Produto;
                            handleProductChange(produto);
                          }}
                          disablePortal
                          value={ProdutoSelect}
                          id="combo-box-demo"
                          options={optionsSelect}
                          renderInput={(params) => <TextField {...params} required={true} label="Produto" />}

                        />
                      </div>
                    </div>
                          
                    <div className="row mb-2">
                      <div className="col-4">
                        <label htmlFor="dataCompra">Data da Compra</label>
                        <input
                          {...register("dataCompra", { required: { value: true, message: "Campo Necessário!" } })}
                          type="date" className="form-control" name="dataCompra" />
                      </div>
                      <div className="col-4">
                        <label htmlFor="quantidade">Quantidade</label>
                        <input
                          {...register("quantidade", { required: { value: true, message: "Campo Necessário!" } })}

                          type="number" step={1} min={0} className="form-control" name="quantidade" />
                      </div>
                      <div className="col-4">
                        <label htmlFor="quantidade">Forma Pagam.</label>
                        <select
                          {...register("formaPagamento", { required: { value: true, message: "Campo Necessário!" } })}
                          className="form-control"

                        >
                          <option key={''} value={''}></option>
                          <option key={1} value={0}>Dinheiro</option>
                          <option key={2} value={1}>Crédito</option>
                          <option key={3} value={2}>Débito</option>
                          <option key={4} value={3}>Cheque</option>


                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col 4">
                        <label htmlFor="cliente">Fornecedor</label>
                        <input
                          {...register("fornecedor", { required: { value: true, message: "Campo Necessário!" } })}
                          className="form-control" type="text" />
                      </div>
                      <div className="col 4">
                        <label htmlFor="contatoCliente">Tel. Fornecedor</label>
                        <input
                          {...register("fornecedorContato", { required: { value: true, message: "Campo Necessário!" } })}
                          className="form-control" type="text" />
                      </div>
                      <div className="col-4">
                        <label htmlFor="valorpago">Valor a ser Pago</label>
                        <CurrencyInput
                          id="input-example"
                          decimalSeparator=","
                          groupSeparator=""
                          placeholder="R$ 0.00"
                          intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                          {...register("valorCompraDisplay", { required: { value: true, message: "Campo Necessário!" } })}
                          className={`form-control ${errors.precoDisplay?.message != null ? "is-invalid" : ""}`}
                        >
                        </CurrencyInput>
                      </div>

                    </div>


                    <div className="d-flex justify-content-end align-items-end">
                      <button className="btn btn-danger mx-1" type="button" onClick={ModalAddCompraCancelar}>Cancelar</button>
                      <button className="btn btn-success mx-1" placeholder="" type="submit">Registrar Compra </button>                      
                    </div>
                  </form>}

                          

                <MUIDataTable
                  title={"Compras"}
                  data={compras}
                  columns={comprasColumn}
                  options={optionsCompra}
                />
              </div>
              <button className="relat"> Gerar relatório </button>
            </TabPanel>
                          
          </Box>
        </Card>

      </div>

    </Layout>
  );



}



export default Vendas