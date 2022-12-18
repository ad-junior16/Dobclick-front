import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ResponseModel } from "../../models/Response.model";

const ChangePasswordPage = () => {
    const apiURL = import.meta.env.VITE_APIURL;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { id } = useParams();
    const [IsLoading, SetIsLoading] = useState(true);
    const [email, SetEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }


    useEffect(() => {
        SetIsLoading(false);


        if (id) {
            axios.post(apiURL + "/usuarios/validar-recuperar-senha", { token: id })
                .then((response: ResponseModel<any>) => {
                    if (response.data.success) {
                        SetIsLoading(false);
                        SetEmail(response.data.data.userEmail);
                    }
                }
                )
        }
    }, []);



    const SubmitChangePasswordForm = async (values: any) => {
        console.log(email);
        console.log(values.senha);


        await axios.put<ResponseModel<any>>(apiURL + '/usuarios/trocar-senha', { email: email, senha: values.senha })
            .then((response: any) => {
                console.log(response.data);
                if (response.data.success) {
                    toast.success(response.data.message, {
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

                    setTimeout(() => {
                        navigate("/");
                      },2000);
                }
            })


    }



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
            <div style={{ marginTop: "20vh", marginBottom: "20vh" }} >
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

                <div className=" w-100 " style={{ margin: "auto" }}>
                    <div className="col-md-6 mx-auto">
                        <div className="card pt-3 px-3 rounded shadow-lg">

                            {!IsLoading &&
                                <div>
                                    <h1 className="mb-0 text-center">
                                        <strong>Alterar Senha</strong>

                                    </h1>

                                    <div className="card-body pb-0 mb-0">
                                        <div className="d-flex justify-content-center text-center">
                                            <span className="text-muted">Informe Sua Nova Senha!</span>
                                        </div>
                                        <form onSubmit={handleSubmit(SubmitChangePasswordForm)} className="form pt-4">
                                            <div className="row">
                                                <div className="form-group col-11">
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

                                                </div>
                                            </div>

                                            <div className="py-4 d-flex justify-content-center">
                                                <button
                                                    className="btn btn-lg custom-login-btn"
                                                    type="submit"
                                                    style={{ backgroundColor: "#0b8ad9", color: "white" }}
                                                >
                                                    <strong>Alterar</strong>
                                                </button>
                                            </div>
                                            {/* <div className="mt-3 text-sm text-center">
                                                <p className="fs-6">
                                                    <a style={{ cursor: "pointer" }}> Faça Login! </a>                    </p>
                                            </div> */}
                                        </form>
                                    </div>

                                </div>
                            }
                            {IsLoading &&
                                <div className="d-flex justify-content-center text-center my-5">
                                    <CircularProgress />
                                </div>
                            }
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )

}

export default ChangePasswordPage;