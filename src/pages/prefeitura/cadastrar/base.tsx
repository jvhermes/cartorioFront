import Head from "next/head"
import { canSSRAuth } from "../../../utils/canSSRAuth"
import { useState, ChangeEvent } from "react"
import { toast } from "react-toastify"
import { FiUpload } from 'react-icons/fi'
import { Button } from "semantic-ui-react"
import styles from "./styles.module.scss"

import { SidebarPrefeitura } from "../../../components/SidebarPrefeitura"


import { setupAPIClient } from "../../../services/api"



interface CadastroProps {

    admin: boolean;
    avatar: string
}

export default function Cadastrar({ admin, avatar }: CadastroProps) {

    const [file, setFile] = useState(null)

    async function handleNewCSVCadastro() {


        try {
            const data = new FormData();

            data.append('file', file)

            const apiClient = setupAPIClient();

            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            }

            await apiClient.post('/lote', data, config)

            toast.success('Base atualizada com Sucesso')
        } catch (err) {
            toast.error("erro ao atualizar base de dados")
            console.log(err)
        }

    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {



        if (!e.target.files) {
            return;
        }

        const fileSource = e.target.files[0];

        if (!fileSource) {
            return;
        }


        setFile(fileSource);

    }
    return (
        <>
            <Head>
                <title>Base de dados</title>
            </Head>
            <main className={styles.main}>
                <SidebarPrefeitura admin={admin} avatar={avatar} />
                <div className={styles.title}>
                    <div>
                        <h1>Base de dados</h1>
                        <p>Atualizar base de dados referente aos lotes cadastrados no sistema </p>
                    </div>
                  

                </div>
                <div className={styles.baseContainer}>
                    <h2>Atualizar base de dados</h2>
                    <p>*documento do tipo .csv</p>
                    <label className={styles.labelIcon}>
                        <span>
                            <FiUpload size={25} color="#000" />
                        </span>
                        <input  className={styles.baseIcon} type="file" accept=".csv,text/csv" onChange={(e) => handleChange(e)} />
                    </label>

                    <div className={styles.baseContent}>
                        <Button color="blue" onClick={handleNewCSVCadastro} className={styles.atualizar}>
                            Atualizar
                        </Button>
                    </div>
                </div>
            </main>
            <footer className={styles.footer}>
                <strong>Copyright</strong> SICART - CIT © 2023
            </footer>
          
        </>

    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get("/me")

    const { admin, avatar, tipo } = response.data;

    if (tipo === '2') {
        return {
            redirect: {
                destination: "/cartorio/recebidos",
                permanent: false
            }
        }
    }
    if (tipo === "1") {
        return {
            redirect: {
                destination: "/prefeitura/recebidos",
                permanent: false
            }
        }
    }


    return {
        props: {

            admin: admin,
            avatar
        }
    }
})


