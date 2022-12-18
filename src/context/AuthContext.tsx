import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState, createContext, useEffect } from "react";
import { ResponseModel } from "../models/Response.model";
import User from "../models/User.model";

const apiURL = import.meta.env.VITE_APIURL;

interface contextInterface {
    user: User | null,
    Login: (user: User) => Promise<ResponseModel<any>>,
    Logout: () => void,
    defineUser : (user:User) => void,
    isAuthenticated: boolean
}

export const AuthContext = createContext<contextInterface>({} as contextInterface);

export const AuthProvider = (props: any) => {
    const [user, setUser] = useState<User | null>(new User());


    useEffect(() => {
        var usu = JSON.parse(localStorage.getItem("AppUsuario") || "null") as User;

        if(usu != null){
            console.log(usu);
            setUser(usu);
        }
      }, []);
    

    async function Login(user: User): Promise<ResponseModel<any>> {
        const response = await axios.post<ResponseModel<any>>(apiURL + "/usuarios/login", user);

        if (response.data.success == true) {
            var userdata: User = jwtDecode(response.data.data);
            setUser(userdata);
            localStorage.setItem("AppUsuario", JSON.stringify(userdata));
            return response;
        } else {
            return response;
        }


    }

    function Logout() {
        localStorage.removeItem("AppUsuario");
        setUser(null);
    }

    function defineUser(user:User){
        localStorage.setItem("AppUsuario", JSON.stringify(user));
        setUser(user);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: Boolean(user), user, Login, Logout,defineUser }}>
            {props.children}
        </AuthContext.Provider>
    )


}