import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ResponseModel } from "../../models/Response.model";

const ForgotPasswordPage = () => {
    const apiURL = import.meta.env.VITE_APIURL;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const SubmitForgotPasswordForm = async (values:any) =>{
        
        await axios.post<ResponseModel<any>>(apiURL + '/usuarios/esqueceu-senha',values)
        .then((response:any)=>{
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
                            <h1 className="mb-0 text-center">
                                <strong>Recuperar Senha</strong>
                            </h1>

                            <div className="card-body pb-0 mb-0">
                                <div className="d-flex justify-content-center text-center">
                            <span className="text-muted">informe seu email cadastrado para que possamos ajudá-lo a recuperar sua senha!</span>
                                </div>
                                <form onSubmit={handleSubmit(SubmitForgotPasswordForm)} className="form pt-4">
                                    <div className="row">
                                        <div className="form-group col-11">
        

                                      
                                            <label className="py-2 text-center" htmlFor="">
                                                Email:{" "}
                                            </label>

                                            <input
                                                {...register("email", { required: { value: false, message: "Necessário informar o Email" }})}
                                                name="email"
                                                type="email"
                                                className={`form-control rounded ${errors.email?.message != null ? "is-invalid" : ""}`}
                                                required
                                            />

                                        </div>
                                    </div>
                    
                                    <div className="pt-4 d-flex justify-content-center">
                                        <button
                                            className="btn btn-lg custom-login-btn"
                                            type="submit"
                                            style={{ backgroundColor: "#0b8ad9", color: "white" }}
                                        >
                                            <strong>Recuperar</strong>
                                        </button>
                                    </div>
                                    <div className="mt-3 text-sm text-center">
                                        <p className="fs-6">
                                            <a style={{ cursor: "pointer" }}> Faça Login! </a>                    </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ForgotPasswordPage;