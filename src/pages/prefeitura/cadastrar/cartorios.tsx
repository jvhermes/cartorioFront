import Head from "next/head"
import { canSSRAuth } from "../../../utils/canSSRAuth"
import { useState } from "react"

import { ModalNewCadastro } from "../../../components/Modal/Cadastro/ModalNew"
import { ModalEditCadastro } from "../../../components/Modal/Cadastro/ModalEdit"


import { Button } from "semantic-ui-react"
import styles from "./styles.module.scss"

import { SidebarPrefeitura } from "../../../components/SidebarPrefeitura"

import { ItemCadastroProps } from "../"

import { setupAPIClient } from "../../../services/api"



interface CadastroProps {
    departamentoList: ItemCadastroProps[];
    admin: boolean;
    avatar: string
}

export default function Cadastrar({ departamentoList, admin, avatar }: CadastroProps) {


    const [modalNewOpen,setModalNewOpen] = useState(false)
    const [modalEditOpen,setModalEditOpen] = useState(false)

    const [id,setId] = useState("")
    const [nome,setNome] = useState("")
    const [index,setIndex] = useState(0)

    function openNew(){
        setModalNewOpen(true)
    }

    function openEdit(id:string,index:number,nome:string){
        setModalEditOpen(true)
        setId(id)
        setIndex(index)
        setNome(nome)
    }
    function closeModal(){
        setModalNewOpen(false)
        setModalEditOpen(false)
    }


    return (
        <>
            <Head>
                <title>Cartórios</title>
            </Head>
            <main className={styles.main}>
                <SidebarPrefeitura admin={admin} avatar={avatar} />
                <div className={styles.title}>
                    <div>
                        <h1>Cartórios</h1>
                        <p>Listagem de cartórios aptos a receber processos</p>
                    </div>
                    <div className={styles.adicionar}>
                        <Button color="blue"  onClick={() => openNew()} >Adicionar Novo</Button>
                    </div>

                </div>
                <div className={styles.container}>
                    <div>
                        <ul>
                            <li className={styles.cadastroTitle}>
                                <span >Nome</span>

                            </li>
                        </ul>
                    </div>
                    <div className={styles.cadastroList}>
                        <ul>

                            {departamentoList.map((item, index) => {
                                return (
                                    <li value={index} key={item.id} className={styles.cadastroItem} onClick={ () => openEdit(item.id,index,item.nome)} >
                                        <button className={styles.cadastroContent} >
                                            <span>{item.nome}</span>

                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </main>
            <footer className={styles.footer}>
                <strong>Copyright</strong> SICART - CIT © 2023
            </footer>
            {modalNewOpen && (
                <ModalNewCadastro tipo={2} isOpen={modalNewOpen} onRequestClose={closeModal} />
            )}
            {modalEditOpen && (
                <ModalEditCadastro type={2} isOpen={modalEditOpen} onRequestClose={closeModal} id={id} nomeAtual={nome} index={index}/>
            )}
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

    const responseDepartamento = await apiClient.get('/departamento/lista')


    return {
        props: {
            departamentoList: responseDepartamento.data,
            admin: admin,
            avatar
        }
    }
})


