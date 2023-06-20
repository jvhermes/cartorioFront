import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../../services/api"
import { useState } from "react"
import { ItemCadastroProps } from "../../../../pages/prefeitura"
import { Button, Dropdown } from "semantic-ui-react"
import { FiX } from "react-icons/fi"
import { toast } from "react-toastify"




interface ModalProcessProps {
    isOpen: boolean;
    onRequestClose: () => void;
    idAprovacao: string;
    setorList: ItemCadastroProps[];
    processo_id:number;
}

export function ModalReenvio({ isOpen, onRequestClose, idAprovacao, setorList,processo_id }: ModalProcessProps) {

    const [observacao, setObservacao] = useState("")

    const [setores, setSetores] = useState(setorList || []);
    const [setorSelect, setSetorSelect] = useState(0)

    async function handleReenvio(id: string) {

        const apiClient = setupAPIClient();
        const aprovacao_id = id

        const response = await apiClient.get("/me")
        const { setor } = response.data;

        const enviado_de = setor
        const setor_id = setores[setorSelect].id
        const nome = setores[setorSelect].nome
        try {
            await apiClient.post("reenvio", {
                aprovacao_id, enviado_de, nome, setor_id, observacao,processo_id
            })
            location.reload()
        } catch {
            toast.error("Erro ao enviar processo")
        }

    }

    function handleChangeSetor(data) {
        setSetorSelect(data.value)
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
            height: "520px",
            width: "1100px",
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <button onClick={onRequestClose} className="react-modal-close" style={{ background: "transparent", border: 0 }}>
                <FiX size={45} color="#000" />
            </button>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.selecao}>
                        <label htmlFor="encaminhar">Encaminhar para: (setores internos)</label>
                        <Dropdown selection id="encaminhar" onChange= { (e,data) => handleChangeSetor(data)} value={setorSelect} options={
                            setores.map((item, index) => {
                                return (
                                    { key: item.id, value: index, text: item.nome }
                                )
                            })
                        }>
                        </Dropdown>
                    </div>
                    <div className={styles.observacao}>
                        <label htmlFor="observacao">Observação:</label>
                        <textarea name="obs" id="observacao" value={observacao} maxLength={261} onChange={(e) => setObservacao(e.target.value)}></textarea>
                    </div>
                    <div className={styles.buttons}>
                        <Button color="blue" onClick={() => handleReenvio(idAprovacao)}>Enviar</Button>
                    </div>

                </div>
            </div>
        </Modal>
    )
}