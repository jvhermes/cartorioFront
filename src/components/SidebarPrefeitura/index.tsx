import { Sidebar, Icon, Menu, Button, Image } from 'semantic-ui-react'
import styles from "./styles.module.scss"
import Link from "next/link"
import { AuthContext } from "../../contexts/AuthContext"
import { useContext, useState } from "react"
import { RiLogoutBoxRLine } from "react-icons/ri"
import { HiOutlineMenu } from "react-icons/hi"

interface SideBarRequest {
    admin: boolean;
    avatar: string
}
export function SidebarPrefeitura({ admin, avatar }: SideBarRequest) {

    const { signOut } = useContext(AuthContext)
    const [visible, setVisible] = useState<boolean>(false)

    function toggleSidebar() {
        setVisible((prev) => !prev)
    }
    return (


        <div>
            <header className={styles.headerContainer}>
                <nav className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <Button className={styles.button} color='blue' size='mini' onClick={toggleSidebar}> <HiOutlineMenu size={17} /> </Button>
                    </div>
                    <div className={styles.headerRigth}>
                        <button onClick={signOut} className={styles.sair}>
                            <RiLogoutBoxRLine size={18} /> <span>Desconectar</span>
                        </button>
                    </div>
                </nav>
            </header>
            <Sidebar
                as={Menu}
                animation='push'
                inverted
                vertical
                onHide={() => setVisible(false)}
                visible={visible}
                className={styles.sidebar}
                pagination
            >
                <Menu.Item >
                    <Menu.Item header>
                        <Image circular centered src={`/avatar${avatar}.png`} size="tiny" />
                    </Menu.Item>
                    <Menu.Menu>
                        <Link href="/prefeitura/user"><Menu.Item link >Perfil</Menu.Item></Link>
                    </Menu.Menu>
                </Menu.Item>
                <Menu.Item >
                    <Menu.Item header>Processos Ativos </Menu.Item>
                    <Menu.Menu>
                        <Link href="/prefeitura"><Menu.Item link >Enviados</Menu.Item></Link>
                        <Link href="/prefeitura/recebidos"> <Menu.Item link>Recebidos</Menu.Item></Link>
                    </Menu.Menu>
                </Menu.Item>
                <Link href="/prefeitura/geral">
                    <Menu.Item link className={styles.menuItem}>
                        <Icon name='history' />
                        Histórico
                    </Menu.Item>
                </Link>

                {admin && (
                    <Link href="/prefeitura/cadastrar" >
                        <Menu.Item link className={styles.menuItem}>
                            <Icon name='configure' />
                            Configurações
                        </Menu.Item>
                    </Link>)}


                {admin && (
                    <Link href="/prefeitura/usuarios">
                        <Menu.Item link className={styles.menuItem}>
                            <Icon name='users' />
                            Usuarios
                        </Menu.Item>
                    </Link>
                )}
                {admin && (
                    <Link href="/cartorio">
                        <Menu.Item link className={styles.menuItem}>
                            <Icon name='building' />
                            Cartorio
                        </Menu.Item>
                    </Link>
                )}
            </Sidebar>


        </div>

    )
}


