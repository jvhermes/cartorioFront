import { GetServerSideProps , GetServerSidePropsContext , GetServerSidePropsResult} from "next";
import nookies from "nookies"

//funcao para usuarios nao logados

export function canSSRGuest<P> (fn: GetServerSideProps <P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = nookies.get(ctx);

        if(cookies["@nextauth.token"]){
            return{
                redirect:{
                    destination:"/prefeitura",
                    permanent: false
                }
            }
        }

        return await fn(ctx);
    }
}