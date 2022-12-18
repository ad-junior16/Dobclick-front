import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { ResponseModel } from "../../models/Response.model";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../../context/AuthContext";
import User from "../../models/User.model";





const apiURL = import.meta.env.VITE_APIURL;

const RegisterPage = () => {
  const { register, handleSubmit, reset, setError, clearErrors, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const SubmitRegisterForm = async (values: any) => {


    if (values.senha != values.confirmaSenha) {


      setError("confirmaSenha", { type: "custom", message: "Senhas Diferentes!" })

      return;
    }

    axios.post<ResponseModel<any>>(apiURL + "/usuarios/cadastrar", values).then(async (res) => {
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
      localStorage.setItem('AppUsuario', JSON.stringify(res.data.data));
        navigate("/Home");

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
      }
    })

  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleShowConfirmPassword = () =>{
    setShowConfirmPassword(!showConfirmPassword);
  }

  const ClearErrorForm = () => {
    clearErrors("confirmaSenha");
  }

  const handleLogin = () => {
    navigate("/");
  }



  useEffect(() => {


  }, []);

  return (
    <div
      className=""
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "#053259",
      }}
    >
      <div className="login-form">
        <div className="container-fluid" style={{ paddingTop: "5vh", paddingBottom: "5vh" }}>
          <div className="row  mx-auto">
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
            <div className="col-md-6 mx-auto">
              <div className="card pt-3 px-2 rounded shadow-lg">
                <h1 className="mb-0 text-center">
                  <strong>Cadastrar</strong>
                </h1>

                <div className="card-body pb-0 mb-0">
                  <form onSubmit={handleSubmit(SubmitRegisterForm)} className="form">
                    <div className="form-group">

                      <label className="py-2 text-center" htmlFor="">
                        Nome:
                      </label>


                      <input
                        {...register("nome", { required: { value: false, message: "Necessário informar o Nome" } })}
                        name="nome"
                        type="text"
                        className={`form-control rounded ${errors.nome?.message != null ? "is-invalid" : ""}`}
                        required
                      />
                      {errors.nome && <p className="text-danger">{errors.nome.message}</p>}

                    </div>
                    <div className="form-group">


                      <label className="py-2 text-center" htmlFor="">
                        Email:
                      </label>


                      <input
                        {...register("email", { required: { value: false, message: "Necessário informar o Email" } })}
                        name="email"
                        type="email"
                        className={`form-control rounded ${errors.email?.message != null ? "is-invalid" : ""}`}
                        required
                      />
                      {errors.email && <p className="text-danger">{errors.email.message}</p>}


                    </div>
                    <div className="row">
                      <div className="form-group col-11">
                        <label className="py-2 " htmlFor="senha">
                          Senha:
                        </label>
                        <input
                          {...register("senha", { pattern: { value: /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g, message: "Senha inválida! A Senha deve conter no mínimo 8 caracteres,sendo eles pelo menos 1 letra maiuscula, 1 letra minuscula, um numero e 1 caracter especial!" } })}
                          name="senha"
                          type={showPassword ? "text" : "password"}
                          className={`form-control rounded ${errors.senha?.message != null ? "is-invalid" : ""}`}
                          required
                        />
                        {errors.senha && <p className="text-danger">{errors.senha.message}</p>}

                      </div>
                      <div className="form-group  col-1">
                        <button type="button" onClick={handleShowPassword} className="btn btn-primary showPasswordBtn pt-2">{showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-11">

                        <label className="py-2 " htmlFor="senha">
                          Confirmar Senha:
                        </label>
                        <input
                          {...register("confirmaSenha",
                            {
                              pattern:
                              {
                                value: /(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g,
                                message: "Senha inválida! A Senha deve conter no mínimo 8 caracteres,sendo eles pelo menos 1 letra maiuscula, 1 letra minuscula, um numero e 1 caracter especial!"
                              }
                            })
                          }
                          name="confirmaSenha"
                          type={showConfirmPassword ? "text" : "password"}

                          className={`form-control rounded ${errors.confirmaSenha?.message != null ? "is-invalid" : ""}`}
                          required
                        />
                        {errors.confirmaSenha && <p className="text-danger">{errors.confirmaSenha.message}</p>}
                      </div>
                      <div className="form-group  col-1">
                        <button type="button" onClick={handleShowConfirmPassword} className="btn btn-primary showPasswordBtn pt-2">{showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</button>
                      </div>
                    </div>
                    <div className="pt-4 d-flex justify-content-center">
                      <button
                        className="btn btn-lg custom-login-btn"
                        type="submit"
                        style={{ backgroundColor: "#0b8ad9", color: "white" }}
                      >
                        <strong>Cadastrar-se</strong>
                      </button>
                    </div>
                    <div className="mt-3 text-sm text-center">
                      <p className="fs-6">
                        <a onClick={handleLogin} style={{ cursor: "pointer" }}>  Jà Tem uma Conta? Faço seu Login</a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
