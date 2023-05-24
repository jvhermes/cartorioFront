import Head from "next/head"
import { canSSRAuth } from "../../../utils/canSSRAuth"
import { useState } from "react"
import Modal from "react-modal"
import styles from "./styles.module.scss"
import { ModalUserEdit } from "../../../components/Modal/ModalUserEdit"
import { ModalUser } from "../../../components/Modal/ModalUser"
import { ItemCadastroProps } from ".."
import { UpdateButton, DeleteButton } from "../../../components/UI/LittleButton"
import { setupAPIClient } from "../../../services/api"
import { SidebarPrefeitura } from "../../../components/SidebarPrefeitura"
import { Image, Button } from "semantic-ui-react"


export type UserListProps = {
    id: string;
    nome: string;
    email: string;
    ativo: boolean;
    avatar: string;
    perfil: {
        tipo: string;
        nome: string
    }
}

export type PerfilListProps = {
    id: string;
    nome: string;
    tipo: number;
}
interface TelaUsuarioProps {

    userList: UserListProps[];
    perfilList: PerfilListProps[];
    setorList: ItemCadastroProps[];
    departamentoList: ItemCadastroProps[];
    admin: boolean;
    avatar:string
}

Modal.setAppElement("#__next")
export default function Seguranca({ userList, perfilList, setorList, departamentoList, admin,avatar }: TelaUsuarioProps) {


    const [usuarioList, setUsuarioList] = useState(userList || [])

    const [modalUserOpen, setModalUserOpen] = useState(false)
    const [modalUserEditOpen, setModalUserEditOpen] = useState(false)
    const [user,setUser] = useState<UserListProps>()

    function openModal() {
        setModalUserOpen(true)
    }

    async function openModalUserEdit(id:string) {

        const apiCliente = setupAPIClient();

        const response = await apiCliente.get("/usuario", {
            params: {
                id: id
            }
        })
        setUser(response.data)
        setModalUserEditOpen(true)
    }

    function closeModal() {
        setModalUserOpen(false)
        setModalUserEditOpen(false)
    }
    return (
        <>
            <Head>
                <title>Usuário</title>

            </Head>
            <main className={styles.main}>
                <SidebarPrefeitura admin={admin} avatar={avatar} />
                <div className={styles.title}>
                    <div>
                        <h1>Usuários</h1>
                        <p>Listagem de usuários </p>
                    </div>
                    <div className={styles.adicionar}>
                        <Button color="blue" onClick={openModal}>Adicionar Usuario</Button>
                    </div>

                </div>
                <div className={styles.container}>


                    <div>
                        <ul>
                            <li className={styles.userTitle}>
                                <span >Nome</span>
                                <span >Email</span>
                                <span >Tipo</span>
                                <span >Ativo</span>
                                <span >Avatar</span>
                               
                            </li>
                        </ul>
                    </div>
                    <div className={styles.userList}>
                        <ul>

                            {usuarioList.map((item, index) => {
                                return (
                                    <li value={index} key={item.id} className={styles.userItem} >
                                        <button className={styles.userContent} onClick={ () => openModalUserEdit(item.id)}>
                                            <span>{item.nome}</span>
                                            <span>{item.email}</span>
                                            <span>{item.perfil.nome}</span>
                                            <span >{item.ativo && (<span className={styles.ativo}>Sim</span>) || (<span className={styles.inativo}>Não</span>)}</span>
                                            <span> <Image src={`/avatar${item.avatar}.png`} size="mini"/></span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </main>
            {modalUserOpen && (
            <ModalUser isOpen={modalUserOpen} onRequestClose={closeModal} perfilList={perfilList} setorList={setorList} departamentoList={departamentoList} />
            )}
            {modalUserEditOpen && (
                  <ModalUserEdit isOpen={modalUserEditOpen} onRequestClose={closeModal} user={user}/>
            )}
          
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

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
        responseUserList,
        responsePerfil,
        responseDepartamento,
        responseSetor
    ] = await Promise.all([

        apiClient.get('/usuario/lista'),
        apiClient.get('/perfil'),
        apiClient.get('/departamento/lista'),
        apiClient.get('/setor/lista')
    ])

    return {
        props: {

            userList: responseUserList.data,
            perfilList: responsePerfil.data,
            setorList: responseSetor.data,
            departamentoList: responseDepartamento.data,
            admin: admin,
            avatar:avatar
        }
    }
})