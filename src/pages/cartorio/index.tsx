import Head from "next/head"

import { canSSRAuth } from "../../utils/canSSRAuth"
import { FormEvent, useState } from "react"
import { SidebarCartorio } from "../../components/SidebarCartorio"
import styles from "./style.module.scss"


import { Input, Button, Icon } from 'semantic-ui-react'


import { ModalProcessCartorioEnviado } from "../../components/Modal/Processo-Cartorio/ModalProcessCartorioEnviado"
import { ModalNewProcess } from "../../components/Modal/Processo-Cartorio/ModalNewProcess"
import { ItemProcessoCartorioProps, ItemCadastroProps, ItemLoteProps } from "../prefeitura"

import Modal from "react-modal"

import { setupAPIClient } from "../../services/api"
import moment from "moment"



interface DashboardProps {
    processList: ItemProcessoCartorioProps[];
    setorList: ItemCadastroProps[];
    tipoList: ItemCadastroProps[];
    admin: boolean;
    avatar: string
}

Modal.setAppElement("#__next")



export default function DashboardPrefeitura({ processList, setorList, tipoList, admin, avatar }: DashboardProps) {

    const [processos, setProcessos] = useState(processList || []);
    const [loteList, setLoteList] = useState<ItemLoteProps[]>()



    //filtro

    const [proprietario, setProprietario] = useState("")
    const [dataInicial, setDataInicial] = useState("")

    const [bairro, setBairro] = useState("")
    const [quadra, setQuadra] = useState("")
    const [lote, setLote] = useState("")

    const [tipoDataInicial, setTipoDataInicial] = useState("text")

    const [modalProcesso, setModalProcesso] = useState<ItemProcessoCartorioProps>()
    const [modalProcesoOpen, setModalProcessoOpen] = useState(false)

    const [modalNewProcessoOpen, setModalNewProcessoOpen] = useState(false)

    const [processoFilter, setProcessoFilter] = useState(processos)


    function closeModal() {
        setModalProcessoOpen(false);
        setModalNewProcessoOpen(false);

    }



    async function openProcessModal(id:number) {

        const apiCliente = setupAPIClient();


        const response = await apiCliente.get("/processocartorio/detalhe", {
            params: {
                id: id
            }
        })

        setModalProcesso(response.data);
        setModalProcessoOpen(true);

    }


    async function openNewProcessModal() {

        const apiClient = setupAPIClient()
        try {
            const responseLotes = await apiClient.get('lote/lista')
            setLoteList(responseLotes.data)
        } catch {
            return
        }

        setModalNewProcessoOpen(true)
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

            const prop = item.lote[0].lote.proprietario;

            const bai = item.lote[0].lote.bairro;

            const qua = item.lote[0].lote.quadra;

            const lot = item.lote[0].lote.lote;

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
                <title>SICART - CIT</title>

            </Head>
         
                <main className={styles.main} >
                    <SidebarCartorio avatar={avatar} admin={admin} />
                    <div className={styles.container} >
                        <div className={styles.title}>
                            <div>
                                <h1>Processos Enviados</h1>
                                <p>Listagem de processos enviados para a prefeitura não concluídos</p>
                            </div>
                            <Button color="blue" onClick={openNewProcessModal}>Novo Processo</Button>
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
                                                <option key={item.id} value={item.lote[0].lote.bairro}></option>
                                            )
                                        })}
                                    </datalist>
                                </div>
                                <div className={styles.inputArea}>
                                    <Input type="search" list="quadra" placeholder="Quadra" value={quadra} onChange={(e) => setQuadra(e.target.value)} />
                                    <datalist id="quadra" >
                                        {processos.filter((item) => {

                                            const searchBairro = bairro.toLowerCase();
                                            const bair = item.lote[0].lote.bairro;

                                            return searchBairro && bair.includes(searchBairro);
                                        }).map((item) => {
                                            return (
                                                <option key={item.id} value={item.lote[0].lote.quadra}></option>
                                            )
                                        })}
                                    </datalist>
                                </div>

                                <div className={styles.inputArea}>
                                    <Input type="search" list="lote" placeholder="Lote" value={lote} onChange={(e) => setLote(e.target.value)} />
                                    <datalist id="lote" >
                                        {processos.filter((item) => {

                                            const searchBairro = bairro.toLowerCase();
                                            const bair = item.lote[0].lote.bairro;

                                            const searchQuadra = quadra.toLowerCase();
                                            const qua = item.lote[0].lote.quadra;


                                            return searchBairro && bair.includes(searchBairro) && searchQuadra && qua.includes(searchQuadra);
                                        }).map((item) => {
                                            return (
                                                <option key={item.id} value={item.lote[0].lote.lote}></option>
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
                                    <li className={styles.processTitleEnv}>
                                        <span >Tipo de Processo</span>
                                        <span >Propietário</span>
                                        <span >Bairro</span>
                                        <span >Quadra</span>
                                        <span >Lote</span>
                                        <span >Criação</span>

                                    </li>
                                </ul>
                            </div>
                            <div className={styles.processList}>
                                <ul>

                                    {processoFilter.map((item, index) => {
                                        return (
                                            <li value={index} key={item.id} className={styles.processItem} >
                                                <button className={styles.processContentEnv} onClick={() => openProcessModal(item.id)}>
                                                    <span>{item.tipo.nome}</span>
                                                    <span>{item.lote[0].lote.proprietario}</span>
                                                    <span>{item.lote[0].lote.bairro}</span>
                                                    <span>{item.lote[0].lote.quadra}</span>
                                                    <span>{item.lote[0].lote.lote}</span>
                                                    <span>{moment(item.criado_em).format("DD/MM/YYYY")}</span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </section>

                    </div>

                </main>

            {modalProcesoOpen && (
                <ModalProcessCartorioEnviado isOpen={modalProcesoOpen} onRequestClose={closeModal} processo={modalProcesso} />

            )}
            {modalNewProcessoOpen && (
                <ModalNewProcess isOpen={modalNewProcessoOpen} onRequestClose={closeModal} tipoList={tipoList}
                    setorList={setorList} loteList={loteList} />
            )}



        </>
    )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)


    const response = await apiClient.get("/me")

    const { tipo, departamento, admin, avatar } = response.data;

    if (tipo === '1') {
        return {
            redirect: {
                destination: "/prefeitura",
                permanent: false
            }
        }
    }
    if (admin){
        const [
            responseProcess,
            responseSetor,
            responseTipo,
    
        ] = await Promise.all([
            apiClient.get('/processocartorio/admin/lista'),
            apiClient.get('/setor/lista'),
            apiClient.get('/tipo/lista'),
    
        ])
    
        return {
            props: {
                processList: responseProcess.data,
                setorList: responseSetor.data,
                tipoList: responseTipo.data,
                admin: admin,
                avatar: avatar
            }
        }
    }else{
        const [
            responseProcess,
            responseSetor,
            responseTipo,
    
        ] = await Promise.all([
            apiClient.get('/processocartorio/lista/departamento', {
                params: {
                    dep: departamento
                }
            }),
            apiClient.get('/setor/lista'),
            apiClient.get('/tipo/lista'),
    
        ])
    
        return {
            props: {
                processList: responseProcess.data,
                setorList: responseSetor.data,
                tipoList: responseTipo.data,
                admin: admin,
                avatar: avatar
            }
        }
    }
   

})