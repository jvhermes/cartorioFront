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

export function SidebarCartorio({ admin, avatar }: SideBarRequest) {

    const { signOut } = useContext(AuthContext)
    const [visible, setVisible] = useState<boolean>(true)



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

                    <Link href="/prefeitura/user"><Menu.Item link >Perfil</Menu.Item></Link>

                </Menu.Item>
                <Menu.Item>
                    <Menu.Item header>
                        <Icon name='box'></Icon>
                        Processos Ativos
                    </Menu.Item>

                    <Link href="/cartorio"><Menu.Item link >Enviados</Menu.Item></Link>
                    <Link href="/cartorio/recebidos"> <Menu.Item link>Recebidos</Menu.Item></Link>

                </Menu.Item>
                <Menu.Item>
                    <Link href="/cartorio/geral">
                        <Menu.Item link className={styles.menuItem}>
                            <Icon name='history' />
                            Histórico
                        </Menu.Item>
                    </Link>

                </Menu.Item>
                {admin && (
                    <Menu.Item>
                        <Menu.Item header>
                            <Icon name='configure' />
                            Configurações
                        </Menu.Item>
                        <Link href="/prefeitura/cadastrar/atividades"><Menu.Item link >Atividades</Menu.Item></Link>
                        <Link href="/prefeitura/cadastrar/setores"> <Menu.Item link>Setores</Menu.Item></Link>
                        <Link href="/prefeitura/cadastrar/cartorios"> <Menu.Item link>Cartórios</Menu.Item></Link>
                        <Link href="/prefeitura/cadastrar/tipos"> <Menu.Item link>Tipos de Processo</Menu.Item></Link>
                        <Link href="/prefeitura/cadastrar/base"> <Menu.Item link>Base de Dados</Menu.Item></Link>
                    </Menu.Item>
                )}
                 <Menu.Item>
    
                    {admin && (
                        <Link href="/prefeitura/usuarios">
                            <Menu.Item link className={styles.menuItem}>
                                <Icon name='users' />
                                Usuarios
                            </Menu.Item>
                        </Link>
                    )}
                    {admin && (
                        <Link href="/prefeitura">
                            <Menu.Item link className={styles.menuItem}>
                                <Icon name='building' />
                                Prefeitura
                            </Menu.Item>
                        </Link>
                    )}
                </Menu.Item>
            </Sidebar>
        </div>
    )
}
