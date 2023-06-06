import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../../services/api"
import { useState } from "react"

import { FiX } from "react-icons/fi"
import { toast } from "react-toastify"

import { ModalConfirm } from "../ModalConfirmation"
import { ModalUpdate } from "../ModalUpdate"
import { Input, Button,List } from "semantic-ui-react"
import { ItemCadastroProps } from "../../../../pages/prefeitura"
import { DeleteButton, UpdateButton } from "../../../UI/LittleButton"

interface ModalProcessProps {
    isOpen: boolean;
    onRequestClose: () => void;
    cadastroList: ItemCadastroProps[];
    tipo: number
}

export function ModalCadastro({ isOpen, onRequestClose, cadastroList, tipo }: ModalProcessProps) {

    const [confirmId, setConfirmId] = useState("")
    const [confirmIndex, setConfirmIndex] = useState(0)
    const [confirmType, setConfirmType] = useState(0)

    const [showModalConfirm, setShowModalConfirm] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)

    const [nome, setNome] = useState("")

    async function handleNew() {
        const apiCliente = setupAPIClient();

        if (tipo === 1) {
            try {
                await apiCliente.post("/atividade", {
                    nome
                })
                setNome("")
          
            } catch {
                setNome("")
                toast.error("Não foi possível completar a ação")
            }


        }
        if (tipo === 2) {
            try {
                await apiCliente.post("/departamento", {

                    nome
                })
                setNome("")
                location.reload()
            } catch {
                setNome("")
                toast.error("Não foi possível completar a ação")
            }

        }
        if (tipo === 3) {

            try {
                await apiCliente.post("/tipo", {

                    nome

                })
                setNome("")
                location.reload()
            } catch {
                toast.error("Não foi possível completar a ação")
                setNome("")
            }

        }
        if (tipo === 4) {

            try {
                await apiCliente.post("/tipocartorio", {

                    nome

                })
                setNome("")
                location.reload()
            } catch {
                toast.error("Não foi possível completar a ação")
                setNome("")
            }

        }
        if (tipo === 5) {

            try {
                await apiCliente.post("/setor", {
                    nome
                })
                setNome("")
                location.reload()
            } catch {
                toast.error("Não foi possível completar a ação")
                setNome("")
            }

        }

    }

    function closeModal() {
        setShowModalConfirm(false);
        setShowModalUpdate(false);

    }

    function handleDelete(id: string, tipo: number, index: number) {

        setConfirmId(id);
        setConfirmIndex(index);
        setConfirmType(tipo);
        setShowModalConfirm(true);
    }

    function handleUpdate(id: string, tipo: number, index: number) {

        setConfirmId(id);
        setConfirmIndex(index);
        setConfirmType(tipo);
        setShowModalUpdate(true)
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
            width: "1000px",
            height: "670px"
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <button onClick={onRequestClose} className="react-modal-close" style={{ background: "transparent", border: 0 }}>
                <FiX size={45} color="#000" />
            </button>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h2>Listagem</h2>
                    <ul className={styles.cadastroElement}>
                        {cadastroList.map((item, index) => {
                            return (
                                <li value={index} key={item.id} className={styles.cadastroItem} >
                                    <p>{item.nome}</p>
                                    <div className={styles.cadastroButton}>
                                        <UpdateButton onClick={() => handleUpdate(item.id, tipo, index)} />
                                        <DeleteButton onClick={() => handleDelete(item.id, tipo, index)} />
                                    </div>
                                </li>
                            )
                        })}
                    </ul>

                </div>
                <div className={styles.content}>
                    <h2>Novo</h2>
                    <div className={styles.botao}>
                        <Input type="text" value={nome} placeholder="Novo nome" onChange={(e) => { setNome(e.target.value) }} />
                        <Button color="blue"  onClick={handleNew}>Adicionar</Button>
                    </div>
                </div>
            </div>
            <ModalConfirm isOpen={showModalConfirm} onRequestClose={closeModal} index={confirmIndex} id={confirmId} type={confirmType} />
            <ModalUpdate isOpen={showModalUpdate} onRequestClose={closeModal} index={confirmIndex} id={confirmId} type={confirmType} />
        </Modal>
    )
}