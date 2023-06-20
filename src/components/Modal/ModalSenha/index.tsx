import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../services/api"
import { useState } from "react"
import { Input, Button } from "semantic-ui-react"
import { toast } from "react-toastify"

interface ModalConfirmProps {
    isOpen: boolean;
    onRequestClose: () => void;
    id: string;
}

export function ModalSenha({ isOpen, onRequestClose, id }: ModalConfirmProps) {

    const [senha, setNome] = useState("")

    async function handleUpdate() {
        const apiCliente = setupAPIClient();

        try {
            await apiCliente.put("/usuario/updatesenha", {
                id,
                senha
            })
            setNome("")
            location.reload()
        } catch {
            setNome("")
            toast.error("Erro na atualização")
        }

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
        width: "500px"
    }
}

return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>

        <div className={styles.container}>
            <h2>Atualizar senha</h2>
            <div>
                <Input type="password" placeholder="Nova senha" value={senha} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className={styles.content}>

                <Button onClick={handleUpdate} color="blue">
                    Atualizar
                </Button>
                <Button onClick={onRequestClose} className="react-modal-close" >
                    Cancelar
                </Button>
            </div>
        </div>

    </Modal>
)
}