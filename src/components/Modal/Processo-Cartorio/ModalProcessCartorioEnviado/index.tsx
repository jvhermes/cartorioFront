import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../../services/api"
import { useState } from "react"
import { FiX } from "react-icons/fi"
import { ModalConfirm } from "../ModalConfirmProcess"
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
                {processo.tipoLote && (
                    <div className={styles.descricao}>
                        <h3>Descrição Enviada:</h3>
                        <div className={styles.tableContainer}>
                            <Table celled className={styles.table} >
                                <Table.Header >
                                    <Table.Row>
                                        <Table.HeaderCell>Lote</Table.HeaderCell>
                                        <Table.HeaderCell>Area</Table.HeaderCell>
                                        <Table.HeaderCell>Testada</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {processo.descricaoLotes.map((item) => {
                                        return (
                                            <Table.Row key={item.id}>
                                                <Table.Cell><span>{item.lote}</span></Table.Cell>
                                                <Table.Cell><span>{item.area}</span></Table.Cell>
                                                <Table.Cell><span>{item.testada}</span></Table.Cell>
                                            </Table.Row>
                                        )
                                    })}

                                </Table.Body>
                            </Table>
                        </div>
                    </div>

                ) || (
                        <div className={styles.descricao}>
                            <h3>Descrição Enviada:</h3>
                            <div className={styles.tableContainer}>
                                <Table celled className={styles.table} >
                                    <Table.Header >
                                        <Table.Row>
                                            <Table.HeaderCell>Cpf</Table.HeaderCell>
                                            <Table.HeaderCell>Nome</Table.HeaderCell>
                                            <Table.HeaderCell>Email</Table.HeaderCell>
                                            <Table.HeaderCell>Telefone</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {processo.descricaoPessoas.map((item) => {
                                            return (
                                                <Table.Row key={item.id}>
                                                    <Table.Cell><span>{item.cpf}</span></Table.Cell>
                                                    <Table.Cell><span>{item.nome}</span></Table.Cell>
                                                    <Table.Cell><span>{item.email}</span></Table.Cell>
                                                    <Table.Cell><span>{item.telefone}</span></Table.Cell>
                                                </Table.Row>
                                            )
                                        })}

                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                    )}

                <div className={styles.lotesContent}>
                    <h3>Lotes relacionados</h3>
                    {processo.lote.map((item, index) => {
                        return (
                            <div className={styles.lotes} key={index}>
                                <h3>Dados do lote {index + 1}</h3>
                                <p>Lote: <strong> {item.lote.lote} </strong> </p>
                                <p>Quadra: <strong> {item.lote.quadra}</strong></p>
                                <p>Bairro: <strong> {item.lote.bairro} </strong> </p>
                                <p>Inscrição Imobiliária: <strong> {item.lote.insc_imob} </strong> </p>
                                <p>Código do imóvel: <strong> {item.lote.codigo_imovel} </strong> </p>
                                <p>Proprietário: <strong> {item.lote.proprietario} </strong> </p>
                                <p>Número: <strong> {item.lote.numero} </strong> </p>
                                <p>Logradouro: <strong> {item.lote.logradouro} </strong> </p>
                            </div>
                        )
                    })}
                </div>


                <div className={styles.observacao}>

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