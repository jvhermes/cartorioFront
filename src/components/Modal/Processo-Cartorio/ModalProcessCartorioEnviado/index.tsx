import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../../services/api"
import { useState } from "react"
import { FiX } from "react-icons/fi"
import { ModalConfirm } from "../../ModalConfirmProcess"
import { ItemProcessoCartorioProps } from "../../../../pages/prefeitura"
import { Button, Tab, Table } from "semantic-ui-react"


interface ModalProcessProps {
    isOpen: boolean;
    onRequestClose: () => void;
    processo: ItemProcessoCartorioProps;
}

export function ModalProcessCartorioEnviado({ isOpen, onRequestClose, processo }: ModalProcessProps) {

    const [modalConfirmOpen, setModalConfirmOpen] = useState(false)

    function closeModal() {
        setModalConfirmOpen(false)
    }

    function openModalConfirm() {
        setModalConfirmOpen(true)
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
            width: "1000px",
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <button onClick={onRequestClose} className="react-modal-close" style={{ background: "transparent", border: 0 }}>
                <FiX size={45} color="#fff" />
            </button>
            <div className={styles.content}>

                <div className={styles.detalhes}>
                    <h2>Detalhes do Processo</h2>
                    <div className={styles.detalhesItem}>
                        <p>Criado em: <strong>{processo.criado_em}</strong></p>
                        <p>Tipo: <strong> {processo.tipo.nome}</strong></p>
                    </div>
                </div>
                <div className={styles.descricao}>
                    <h3>Nova(s) descrições do imóvel:</h3>
                    <div className={styles.tabelaContainer}>
                        <Table celled className={styles.tabela}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Nome</Table.HeaderCell>
                                    <Table.HeaderCell>CPF</Table.HeaderCell>
                                    <Table.HeaderCell>Telefone</Table.HeaderCell>
                                    <Table.HeaderCell>Email</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <tbody>
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

                            </tbody>
                        </Table >
                    </div>
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
                {processo.ativo && (
                    <div className={styles.button}>
                        <Button color="red" onClick={() => openModalConfirm()}>
                            Cancelar envio
                        </Button>
                    </div>
                )}
                

            </div>
            {modalConfirmOpen &&
                (<ModalConfirm isOpen={modalConfirmOpen} onRequestClose={closeModal} id={processo.id} type={2} />
                )}
        </Modal>
    )
}