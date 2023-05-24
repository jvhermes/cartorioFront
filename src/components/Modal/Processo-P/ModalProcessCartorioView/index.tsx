import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../../services/api"
import { Button, Table } from "semantic-ui-react"
import { FiX } from "react-icons/fi"

import { ItemProcessoCartorioProps } from "../../../../pages/prefeitura"
import { toast } from "react-toastify"

interface ModalProcessProps {
    isOpen: boolean;
    onRequestClose: () => void;
    processo: ItemProcessoCartorioProps;
}

export function ModalProcessCartorioView({ isOpen, onRequestClose, processo }: ModalProcessProps) {

    async function handleClose() {

        const apiCliente = setupAPIClient();

        try {
            await apiCliente.put("/processocartorio/fechar", {
                id: processo.id,
                exlcuido:false,
            })
            location.reload()
        } catch {
            toast.error("Nao foi possível concluir a ação")
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
            height: "620px",
            width: "900px",
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <button onClick={onRequestClose} className="react-modal-close" style={{ background: "transparent", border: 0 }}>
                <FiX size={45} color="#fff" />
            </button>
            <div className={styles.container}>

                <div className={styles.detalhes}>
                    <h3>Detalhes do Processo</h3>
                    <div className={styles.detalhesItem}>
                        <p>Criado em: <strong>{processo.criado_em}</strong></p>
                        <p>Tipo: <strong>{processo.tipo.nome}</strong></p>
                    </div>
                </div>
                <div className={styles.descricao}>
                    <h3>Descrições recebidas</h3>
                    <Table celled >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Nome</Table.HeaderCell>
                                <Table.HeaderCell>CPF</Table.HeaderCell>
                                <Table.HeaderCell>Telefone</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {processo.descricao.map((item) => {
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell><span>{item.nome}</span></Table.Cell>
                                        <Table.Cell><span>{item.cpf}</span></Table.Cell>
                                        <Table.Cell><span>{item.telefone}</span></Table.Cell>
                                        <Table.Cell><span>{item.email}</span></Table.Cell>
                                    </Table.Row>
                                )
                            })}

                        </Table.Body>
                    </Table>
                </div>


                <div className={styles.lotes} >
                    <h3>Dados do lote </h3>
                    <p>Bairro: <strong> {processo.lote.bairro} </strong> </p>
                    <p>Quadra: <strong> {processo.lote.quadra}</strong></p>
                    <p>Lote: <strong> {processo.lote.lote} </strong> </p>
                    <p>Proprietario: <strong> {processo.lote.proprietario} </strong> </p>
                    <p>Inscrição Imobiliária: <strong> {processo.lote.insc_imob} </strong> </p>
                    <p>Proprietário: <strong> {processo.lote.proprietario} </strong> </p>
                    <p>Número: <strong> {processo.lote.numero} </strong> </p>
                    <p>Logradouro: <strong> {processo.lote.logradouro} </strong> </p>
                </div>
                <div className={styles.text}>
                    <div className={styles.observacao}>
                        <div>
                            <h3>Memorando</h3>
                            <p className={styles.observacaoMemorando}>{processo.memorando}</p>
                        </div>
                        <div>
                            <h3>Observações</h3>
                            <p className={styles.observacaoMaior}>{processo.observacao}</p>
                        </div>
                    </div>

                </div>
                <div className={styles.button}>
                    <Button color="blue" onClick={() => handleClose()}>Concluir</Button>
                </div>
            </div>
        </Modal>
    )
}