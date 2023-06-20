import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../services/api"
import { useState } from "react"
import { ItemCadastroProps } from "../../../pages/prefeitura"
import { PerfilListProps } from "../../../pages/prefeitura/user"
import { toast } from "react-toastify"
import { UserProps } from "../../../pages/prefeitura/user"
import { Input, Button, Form, Dropdown, Image } from "semantic-ui-react"
import { ModalSenha } from "../ModalSenha"

interface ModalConfirmProps {
    isOpen: boolean;
    onRequestClose: () => void;
    user: UserProps;
    setorList: ItemCadastroProps[];
    departamentoList: ItemCadastroProps[];
    perfilList: PerfilListProps[];
}

export function ModalUserEdit({ isOpen, onRequestClose, user,perfilList,departamentoList,setorList }: ModalConfirmProps) {

    const [nome, setNome] = useState(user.nome)
    const [email, setEmail] = useState(user.email)
    const [value, setValue] = useState(user.avatar)
    const [ativo, setAtivo] = useState(user.ativo)

    const [modalSenhaOpen,setModalSenhaOpen] = useState(false)


    const ind = perfilList.map((item,index) =>{
        if(item.nome === user.nome_tipo){
            return(index)
        }
    })

    const [perfilSelect, setPerfilSelect] = useState(0)
    const [setorSelect, setSetorSelect] = useState(0)
    const [departametoSelect, setDepartamentoSelect] = useState(0)

    const [perfis, setPerfis] = useState(perfilList || [])
    const [departamentos, setDepartamentos] = useState(departamentoList || [])
    const [setores, setSetores] = useState(setorList || [])

    const [showDepartamento, setShowDepartamento] = useState(false)
    const [showSetor, setShowSetor] = useState(false)


    async function handleNewUser() {

        const apiClient = setupAPIClient();
        const perfil_id = perfis[perfilSelect].id;
        const departamento_id = departamentos[departametoSelect].id;
        const setor_id = setores[setorSelect].id;
        const avatar = value
        const id = user.id

        if (nome === "" || email === "" || value === "") {
            toast.error("campos não preenchidos")
            return

        }
        try {
            await apiClient.put("/usuario/update", {
                nome,
                email,
                avatar,
                ativo,
                id,
                perfil_id,
                departamento_id,
                setor_id,
            })
            location.reload()
        } catch (err) {
            toast.error("Não foi possível completar a ação")
            console.log(err.response)
        }

    }

    function handleSenha(){
        setModalSenhaOpen(true)
    }

    function closeModalSenha(){
        setModalSenhaOpen(false)
    }

    function handleChangeSetor(data) {
        setSetorSelect(data.value)
    }
    function handleChangeDepartamento(data) {
        setDepartamentoSelect(data.value)
    }
    function handleChangePerfil(data) {
        setPerfilSelect(data.value);

        if (perfis[data.value].nome === "admin") {
            setShowDepartamento(false)
            setShowSetor(false)
        }

        if (perfis[data.value].nome === "usuario prefeitura") {
            setShowDepartamento(false)
            setShowSetor(true)
        }

        if (perfis[data.value].nome === "usuario cartorio") {
            setShowDepartamento(true)
            setShowSetor(false)
        }
    }

    async function handleDelete(id: string) {
        const apiCliente = setupAPIClient();

        try {
            await apiCliente.delete("/usuario", {
                params: {
                    id: id
                }
            })
            location.reload()
        } catch {
            toast.error("erro ao deletar")
        }

    }

    function hadleChangeValue(data: string) {
        setValue(data)
    }

    function handleChangeAtivo() {
        setAtivo(!ativo)
    }

    const customStyles = {
        content: {
            top: "50%",
            bottom: "auto",
            left: "50%",
            rigth: "auto",
            padding: "30px",
            transform: "translate(-50%,-50%)",
            backgroundColor: "#F3F3F4",
            width: "1100px",
            height: "650px"

        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>

            <div className={styles.container}>
                <h2>Editar Usuario</h2>
                <div >
                    <Form  className={styles.content}>
                        <div className={styles.topSide}>
                            <div className={styles.inputs}>
                                <Input type="text" placeholder="nome" value={nome} onChange={(e) => setNome(e.target.value)} icon="user" />
                                <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} icon="at" />
                            </div>

                        </div>
                        
                        <div className={styles.inputs}>
                                <Dropdown selection name="tipo" id="tipo" value={perfilSelect} onChange={(e, data) => handleChangePerfil(data)} options={
                                    perfis.map((item, index) => {
                                        return (
                                            { key: item.id, value: index, text: item.nome }
                                        )
                                    })
                                }>
                                </Dropdown>
                                {showSetor && (
                                    <Dropdown selection name="setor" id="set" value={setorSelect} onChange={(e, data) => handleChangeSetor(data)} options={
                                        setores.map((item, index) => {
                                            return (
                                                { key: item.id, value: index, text: item.nome }
                                            )
                                        })
                                    }>

                                    </Dropdown>)}
                                {showDepartamento && (
                                    <Dropdown selection name="departamento" id="dep" value={departametoSelect} onChange={(e, data) => handleChangeDepartamento(data)}
                                        options={
                                            departamentos.map((item, index) => {
                                                return (
                                                    { key: item.id, value: index, text: item.nome }
                                                )
                                            })
                                        }>
                                    </Dropdown >
                                )}
                            </div>
                        <div className={styles.avatar} >
                            <div>
                                <Image src="/avatar1.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "1"} onChange={() => hadleChangeValue("1")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar2.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "2"} onChange={() => hadleChangeValue("2")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar3.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "3"} onChange={() => hadleChangeValue("3")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar4.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "4"} onChange={() => hadleChangeValue("4")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar5.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "5"} onChange={() => hadleChangeValue("5")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar6.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "6"} onChange={() => hadleChangeValue("6")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar7.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "7"} onChange={() => hadleChangeValue("7")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar8.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "8"} onChange={() => hadleChangeValue("8")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar9.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "9"} onChange={() => hadleChangeValue("9")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar10.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "10"} onChange={() => hadleChangeValue("10")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar11.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "11"} onChange={() => hadleChangeValue("11")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar12.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "12"} onChange={() => hadleChangeValue("12")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar13.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "13"} onChange={() => hadleChangeValue("13")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar14.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "14"} onChange={() => hadleChangeValue("14")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar15.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "15"} onChange={() => hadleChangeValue("15")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar16.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "16"} onChange={() => hadleChangeValue("16")}> </Form.Radio>
                            </div>
                            <div>
                                <Image src="/avatar17.png" size="tiny" />
                                <Form.Radio value={value} checked={value === "17"} onChange={() => hadleChangeValue("17")}> </Form.Radio>
                            </div>


                        </div>
                        <div>
                            <Form.Radio label="ativo" toggle checked={ativo} onChange={() => handleChangeAtivo()} />
                        </div>
                        <div className={styles.adicionar}>
                            <Button color="blue" type="submit" onClick={() => handleNewUser()}>
                                Atualizar
                            </Button>
                            <Button color="red" onClick={() => handleDelete(user.id)}>
                                Excluir
                            </Button>
                            <Button color="grey" onClick={() => handleSenha()}>
                                Trocar Senha
                            </Button>
                        </div>
                      
                    </Form>
            
                </div>
            </div>
            {modalSenhaOpen && (
                <ModalSenha isOpen={modalSenhaOpen} onRequestClose={closeModalSenha} id={user.id} />
            )}                            
        </Modal>
    )
}