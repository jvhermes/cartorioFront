import Head from "next/head"
import { canSSRAuth } from "../../../utils/canSSRAuth"
import { useState } from "react"
import Modal from "react-modal"
import styles from "./styles.module.scss"
import { SidebarPrefeitura } from "../../../components/SidebarPrefeitura"
import { List,Image,Button } from "semantic-ui-react"
import { setupAPIClient } from "../../../services/api"
import { ModalSenha } from "../../../components/Modal/ModalSenha"

type UserProps = {
    id: string;
    nome: string;
    email: string;
    tipo: string;
    nome_tipo: string;
    setor: string;
    departamento: string;
    avatar:string;
}
export type PerfilListProps = {
    id: string;
    nome: string;
    tipo: number;
}
interface TelaUsuarioProps {
    user: UserProps;
    admin: boolean;
    avatar:string
}

Modal.setAppElement("#__next")
export default function User({ user, admin,avatar }: TelaUsuarioProps) {

    const [usuario, setUsuario] = useState(user)
    const [modalSenhaOpen,setModalSenhaOpen] = useState(false)

    function openModal(){
        setModalSenhaOpen(true)
    }

    function closeModal(){
        setModalSenhaOpen(false)
    }
    return (
        <>
            <Head>
                <title>Usuário</title>
            </Head>
            <main className={styles.main}>
                <SidebarPrefeitura admin={admin} avatar={avatar}/>
                <div className={styles.title}>
                    <div>
                        <h1>Usuário</h1>
                        <p>Detalhes do perfil</p>
                    </div>
                    <div className={styles.adicionar}>
                        <Button color="blue" onClick={openModal} >Mudar senha</Button>
                    </div>
                </div>
                <section className={styles.container} >
                    <div className={styles.content}>
                        <List size="large" >
                            <List.Item>
                                <Image className={styles.image} src={`/avatar${usuario.avatar}.png`} size="small"></Image>
                            </List.Item>
                            <List.Item>
                                <List.Icon name="user" />
                                <List.Content>
                                    Nome: <strong> {usuario.nome}</strong>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='mail' />
                                <List.Content> Email: <strong> {usuario.email}</strong></List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name="cog"/>
                                <List.Content>
                                    Categoria: <strong>{usuario.nome_tipo}</strong>
                                </List.Content>
                            </List.Item>
                            {usuario.tipo === '1' && (
                                <List.Item>
                                    <List.Icon name="home" />
                                    <List.Content>
                                        Setor: <strong>{usuario.setor}</strong>
                                    </List.Content>
                                </List.Item>
                            )}
                            {usuario.tipo === '2' && (
                                <List.Item>
                                    <List.Icon name="home"  />
                                    <List.Content>
                                        Departamento: <strong>{usuario.departamento}</strong>
                                    </List.Content>
                                </List.Item>
                            )}
                        </List>
                    </div>
                </section>
            </main >
            <footer className={styles.footer}>
                    <strong>Copyright</strong> SICART - CIT © 2023
            </footer>
        {modalSenhaOpen && (
            <ModalSenha isOpen={modalSenhaOpen} onRequestClose={closeModal} id={user.id} />
        )}
        
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

    const [
        responseUser,

    ] = await Promise.all([
        apiClient.get('/me')
    ])

    const { admin,avatar } = responseUser.data
    return {
        props: {
            user: responseUser.data,
            admin: admin,
            avatar:avatar
        }
    }
})