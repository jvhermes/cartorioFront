import { createContext,ReactNode, useState , useEffect} from "react";
import { destroyCookie, setCookie, parseCookies} from 'nookies'

import Router from "next/router";
import { api } from "../services/apiClient";
import {toast} from "react-toastify"

type AuthContextData={
    user: UserPros;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps )=> Promise<void>;
    signOut: () => void;
}

type UserPros= {
    id:string;
    nome:string;
    email: string;
    tipo:string;
}

type SignInProps = {
    email: string;
    senha: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export  function signOut(){
    try{
        destroyCookie({},'@nextauth.token',{
            path:"/"
        })
        Router.push("/")
    }catch{
        console.log("erro ao deslogar")
    }
}

export function AuthProvider({children}: AuthProviderProps){
     
    const [user, setUser] = useState<UserPros>()

    const isAuthenticated = !!user;

    useEffect( () => {

        const { "@nextauth.token" : token} = parseCookies();

        if(token){
            api.get("/me")
            .then( response => {
                const {id , nome ,email ,tipo} = response.data;

                setUser({
                    id,nome,email,tipo
                })
            })
            .catch( () => {
                signOut();
            })
        }
    },[])

    async function signIn({email,senha}: SignInProps){
        try{
            const response = await api.post("/login",{
                email,senha
            })

            const { id , nome , token,tipo} = response.data;

            setCookie(undefined,"@nextauth.token",token ,{
                maxAge: 2 * 24 * 60 * 60,  // 1 mes
                path: "/", //acesso ao cookie
            });
    
            setUser({id,nome,email,tipo})

            //passando o token para as proximas requisições

            api.defaults.headers["Authorization"] = `Bearer ${token}`

            if(tipo === "2"){
                Router.push("/cartorio/recebidos")
            }else{
                Router.push("/prefeitura/recebidos")
            }
        }catch(err){
            toast.error("Usuario não cadastrado!!!")
            
        }
    }
    
    return(

        <AuthContext.Provider value={{user, isAuthenticated, signIn,signOut}}>
            {children}
        </AuthContext.Provider>
     )
}