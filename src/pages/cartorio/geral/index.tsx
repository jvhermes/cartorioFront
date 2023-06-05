import Head from "next/head"
import { canSSRAuth } from "../../../utils/canSSRAuth"
import { FormEvent, useState } from "react"
import { SidebarCartorio } from "../../../components/SidebarCartorio"
import styles from "./styles.module.scss"

import { Input, Button, Icon,Pagination } from 'semantic-ui-react'


import { ModalProcessCartorioEnviado } from "../../../components/Modal/Processo-Cartorio/ModalProcessCartorioEnviado"
import { ItemProcessoCartorioProps } from "../../prefeitura"

import Modal from "react-modal"

import { setupAPIClient } from "../../../services/api"
import moment from "moment"



interface DashboardProps {
    processList: ItemProcessoCartorioProps[];
    admin: boolean;
    avatar: string;
}

Modal.setAppElement("#__next")



export default function HistoricoCartorio({ processList, admin, avatar }: DashboardProps) {

    const [processos, setProcessos] = useState(processList || []);


    //filtro

    const [proprietario, setProprietario] = useState("")
    const [dataInicial, setDataInicial] = useState("")

    const [bairro, setBairro] = useState("")
    const [quadra, setQuadra] = useState("")
    const [lote, setLote] = useState("")

    const [tipoDataInicial, setTipoDataInicial] = useState("text")

    const [modalProcesso, setModalProcesso] = useState<ItemProcessoCartorioProps>()
    const [modalProcesoOpen, setModalProcessoOpen] = useState(false)


    const pag = processList.slice(0, 18)

    const [processoFilter, setProcessoFilter] = useState(pag)

    //paginas

    const maximo = processList.length / 18
    const [atual, setAtual] = useState(1)



    function closeModal() {
        setModalProcessoOpen(false);

    }

    function changePage(data) {

        setAtual(data.activePage)
        console.log(data.activePage)
        const calculo = data.activePage - 1
        const pagNova = processList.slice(calculo * 18, calculo * 18 + 18)
        setProcessoFilter(pagNova)

    }



    async function openProcessModal(id: string) {

        const apiCliente = setupAPIClient();


        const response = await apiCliente.get("/processocartorio/detalhe", {
            params: {
                id: id
            }
        })

        setModalProcesso(response.data);
        setModalProcessoOpen(true);

    }




    async function handleFilter(event: FormEvent) {
        event.preventDefault();
        if (proprietario === "" && dataInicial === "" && bairro === "" && quadra === "" && lote === "") {
            return
        }

        const searchInicial = dataInicial
        const searchPropr = proprietario.toLowerCase();
        const searchBairro = bairro.toLowerCase();
        const searchQuadra = quadra.toLowerCase();
        const searchLote = lote.toLowerCase();

        const newProcessFilter = processoFilter.filter((item, index) => {

            const prop = item.lote.proprietario;

            const bai = item.lote.bairro;

            const qua = item.lote.quadra;

            const lot = item.lote.lote;

            const ini = item.criado_em;



            return prop.includes(searchPropr) && bai.includes(searchBairro) && qua.includes(searchQuadra) && lot.includes(searchLote) && ini.includes(searchInicial);
        })

        setProcessoFilter(newProcessFilter)
        setBairro("")
        setQuadra("")
        setLote("")
        setProprietario("")
        setDataInicial("")
    }


    return (
        <>
            <Head>
                <title>MS CIT</title>

            </Head>

            <main>
                <SidebarCartorio avatar={avatar} admin={admin} />
                <div className={styles.container} >
                    <div className={styles.title}>
                        <div>
                            <h1>Processos Enviados</h1>
                            <p>Listagem de processos enviados para a prefeitura concluídos</p>
                        </div>
                    </div>
                    <section className={styles.content}>
                        <form className={styles.filter} onSubmit={handleFilter}>

                            <div className={styles.inputArea}>
                                <Input type="text" placeholder="Propietário" value={proprietario} onChange={(e) => { setProprietario(e.target.value) }} />

                            </div>

                            <div className={styles.inputArea}>
                                <Input type="search" list="bairro" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                                <datalist id="bairro" >
                                    {processos.map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote.bairro}></option>
                                        )
                                    })}
                                </datalist>
                            </div>
                            <div className={styles.inputArea}>
                                <Input type="search" list="quadra" placeholder="Quadra" value={quadra} onChange={(e) => setQuadra(e.target.value)} />
                                <datalist id="quadra" >
                                    {processos.filter((item) => {

                                        const searchBairro = bairro.toLowerCase();
                                        const bair = item.lote.bairro;

                                        return searchBairro && bair.includes(searchBairro);
                                    }).map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote.quadra}></option>
                                        )
                                    })}
                                </datalist>
                            </div>

                            <div className={styles.inputArea}>
                                <Input type="search" list="lote" placeholder="Lote" value={lote} onChange={(e) => setLote(e.target.value)} />
                                <datalist id="lote" >
                                    {processos.filter((item) => {

                                        const searchBairro = bairro.toLowerCase();
                                        const bair = item.lote.bairro;

                                        const searchQuadra = quadra.toLowerCase();
                                        const qua = item.lote.quadra;


                                        return searchBairro && bair.includes(searchBairro) && searchQuadra && qua.includes(searchQuadra);
                                    }).map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote.lote}></option>
                                        )
                                    })}
                                </datalist>
                            </div>
                            <div className={styles.inputArea}>

                                <Input type={tipoDataInicial} onFocus={() => { setTipoDataInicial("date") }} onBlur={() => { setTipoDataInicial("text") }}
                                    value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} placeholder="Data Inicial" />
                            </div>

                            <div className={styles.inputArea}>
                                <Button color="grey" onClick={() => setProcessoFilter(processos)}>
                                    Pesquisar
                                    <Icon className={styles.buttonIcon} name="search"></Icon>
                                </Button>
                            </div>

                        </form>

                        <div>
                            <ul>
                                <li className={styles.processTitle}>
                                    <span >Tipo de Processo</span>
                                    <span >Propietário</span>
                                    <span >Bairro</span>
                                    <span >Quadra</span>
                                    <span >Lote</span>
                                    <span >Criação</span>
                                    <span> Conclusão</span>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.processList}>
                            <ul>

                                {processoFilter.map((item, index) => {
                                    return (
                                        <li value={index} key={item.id} className={styles.processItem} >
                                            <button className={styles.processContent} onClick={() => openProcessModal(item.id)}>
                                                <span>{item.tipo.nome}</span>
                                                <span>{item.lote.proprietario}</span>
                                                <span>{item.lote.bairro}</span>
                                                <span>{item.lote.quadra}</span>
                                                <span>{item.lote.lote}</span>
                                                <span>{moment(item.criado_em).format("DD/MM/YYYY")}</span>
                                                <span>{item.respondido_em}</span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className={styles.pagination}>
                            <Pagination totalPages={maximo} activePage={atual} onPageChange={(e, data) => changePage(data)}></Pagination>
                        </div>
                    </section>

                </div>

            </main>
            <footer className={styles.footer}>
                <strong>Copyright</strong> SICART - CIT © 2023
            </footer>
            {modalProcesoOpen && (
                <ModalProcessCartorioEnviado isOpen={modalProcesoOpen} onRequestClose={closeModal} processo={modalProcesso} />

            )}




        </>
    )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)


    const response = await apiClient.get("/me")

    const { tipo, admin, avatar, departamento } = response.data;

    if (tipo === '1') {
        return {
            redirect: {
                destination: "/prefeitura/geral",
                permanent: false
            }
        }
    }

    const responseProcess = await apiClient.get('/processocartorio/geral', {
        params: {
            dep:departamento
        }
    })

    return {
        props: {
            processList: responseProcess.data,
            admin: admin,
            avatar: avatar
        }
    }

})