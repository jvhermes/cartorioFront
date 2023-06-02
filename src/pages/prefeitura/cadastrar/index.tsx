import Head from "next/head"
import { canSSRAuth } from "../../../utils/canSSRAuth"
import { useState } from "react"


import { Card, Button, Header } from "semantic-ui-react"
import styles from "./styles.module.scss"

import { SidebarPrefeitura } from "../../../components/SidebarPrefeitura"
import { AiOutlineUpload } from "react-icons/ai"


import { ModalCSV } from "../../../components/Modal/ModalCSV"
import { ModalCadastro } from "../../../components/Modal/Cadastro/ModalCadastro"

import { ItemCadastroProps } from "../"

import { setupAPIClient } from "../../../services/api"



interface CadastroProps {
    atividadeList: ItemCadastroProps[];
    departamentoList: ItemCadastroProps[];
    tipoList: ItemCadastroProps[];
    tipoCartorioList: ItemCadastroProps[];
    setorList: ItemCadastroProps[];
    admin: boolean;
    avatar:string
}

export default function Cadastrar({ atividadeList, departamentoList, tipoList, tipoCartorioList, setorList, admin,avatar }: CadastroProps) {

    const [atividade, setAtividade] = useState(atividadeList || []);
    const [departamento, setDepartamento] = useState(departamentoList || []);
    const [tipo, setTipo] = useState(tipoList || []);
    const [tipoCartorio, setTipoCartorio] = useState(tipoCartorioList || []);
    const [setor, setSetor] = useState(setorList || []);
    const [cadastro, setCadastro] = useState<ItemCadastroProps[]>([])


    const [showModalCadastro, setShowModalCadastro] = useState(false)
    const [showModalCSV, setShowModalCSV] = useState(false)


    const [confirmType, setConfirmType] = useState(0)

    function closeModal() {

        setShowModalCSV(false)
        setShowModalCadastro(false)
    }

    function handleCadastro(tipo: number, cadastro: ItemCadastroProps[]) {
        setCadastro(cadastro)
        setConfirmType(tipo)
        setShowModalCadastro(true)
    }



    function handleCSV() {
        setShowModalCSV(true)
    }
    return (
        <>
            <Head>
                <title>Cadastrar</title>
            </Head>
            <main>
                <SidebarPrefeitura admin={admin}  avatar={avatar}/>
                <div className={styles.title}>
                        <div>
                            <h1>Cadastros Gerais</h1>
                            <p>Edição das informações gerais do sistema </p>
                        </div>
                </div>
                <div className={styles.container}>
                    <Card.Group centered >
                        <Card centered className={styles.cadastroContent}>
                            <h2 >Atividades</h2>
                            <Button onClick={() => handleCadastro(1, atividade)}>Editar</Button>
                            <p></p>
                        </Card>
                        <Card centered className={styles.cadastroContent}>
                            <h2>Cartórios</h2>
                            <Button onClick={() => handleCadastro(2, departamento)}>Editar</Button>
                            <p></p>
                        </Card>
                        <Card centered className={styles.cadastroContent}>
                            <h2>Tipos de Processo - Prefeitura</h2>
                            <Button onClick={() => handleCadastro(3, tipo)}>Editar</Button>
                            <p></p>
                        </Card>
                        <Card centered className={styles.cadastroContent}>
                            <h2>Tipos de Processo - Cartorio</h2>

                            <Button onClick={() => handleCadastro(4, tipoCartorio)}>Editar</Button>
                            <p></p>
                        </Card >
                        <Card centered className={styles.cadastroContent}>
                            <h2>Setores (prefeitura)</h2>
                            <Button onClick={() => handleCadastro(5, setor)}>Editar</Button>
                            <p></p>
                        </Card>
                        <Card centered className={styles.cadastroContent}>
                            <h2>Base de Dados</h2>
                            <button className={styles.dados} onClick={() => handleCSV()}> Atualizar base de dados <AiOutlineUpload size={20} /></button>
                            <p></p>
                        </Card>
                    </Card.Group>
                </div>
            </main>
            <footer className={styles.footer}>
                    <strong>Copyright</strong> SICART - CIT © 2023
            </footer>
            <ModalCSV isOpen={showModalCSV} onRequestClose={closeModal} />
            <ModalCadastro isOpen={showModalCadastro} onRequestClose={closeModal} tipo={confirmType} cadastroList={cadastro} />

        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get("/me")

    const { admin,avatar,tipo } = response.data;

    if (tipo === '2' || tipo === "1") {
        return {
            redirect: {
                destination: "/cartorio",
                permanent: false
            }
        }
    }

    const [
        responseAtividade,
        responseDepartamento,
        responseTipo,
        responseSetor,
        responseTipoCartorio
    ] = await Promise.all([
        apiClient.get('/atividade/lista'),
        apiClient.get('/departamento/lista'),
        apiClient.get('/tipo/lista'),
        apiClient.get('setor/lista'),
        apiClient.get('/tipocartorio/lista'),
    ])

    return {
        props: {
            atividadeList: responseAtividade.data,
            departamentoList: responseDepartamento.data,
            tipoList: responseTipo.data,
            tipoCartorioList: responseTipoCartorio.data,
            setorList: responseSetor.data,
            admin: admin,
            avatar
        }
    }
})


