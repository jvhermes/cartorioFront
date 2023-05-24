import { GetServerSideProps , GetServerSidePropsContext , GetServerSidePropsResult} from "next";
import nookies from "nookies"
import { destroyCookie, parseCookies} from 'nookies'
import { setupAPIClient } from "../services/api";
import { AuthTokenError } from "../services/errors/AuthTokenError";


//funcao para usuarios logados 

export function canSSRAuth<P>(fn: GetServerSideProps <P>){
 
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx)

        const token = cookies["@nextauth.token"];

        const apiClient = setupAPIClient(ctx)

        
        if(!token){
            return{
                redirect:{
                    destination: "/",
                    permanent: false
                }
            }
        }


        try{
            const response = await apiClient.get("/me")
            const {tipo} = response.data;

            return await fn(ctx);
        }catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx,'@nextauth.token',{
                    path:"/"
                })
                return{
                    redirect:{
                        destination: "/",
                        permanent: false
                    }
                }
            }
        }

    }
}