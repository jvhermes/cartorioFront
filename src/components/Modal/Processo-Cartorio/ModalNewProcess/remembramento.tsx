import styles from "./styles.module.scss"
import { ItemCadastroProps, ItemLoteProps } from "../../../../pages/prefeitura"
import { useState } from "react"
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"
import { setupAPIClient } from "../../../../services/api"
import { Dropdown, Input, Table, Button } from "semantic-ui-react"
import { toast } from "react-toastify"

interface NewProcessProps {
   
    tipo: ItemCadastroProps;
    setorList: ItemCadastroProps[];
    loteList: ItemLoteProps[];
}

export type Descricao = {
    lote: string;
    area: string;
    testada: string;
}

export type DescricaoPessoa = {
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
}

export type Ids = {
    id: number
}

export function RemembramentoCartorio({  tipo, setorList, loteList }: NewProcessProps) {

    const tipo_id = tipo.id;

    const [setores, setSetores] = useState(setorList || []);
    const [selectSetor, setSelectSetor] = useState(0)
    const [observacao, setObservacao] = useState("")


    const [selectInsc, setSelectInsc] = useState("")
    const [selectQuadra, setSelectQuadra] = useState("")
    const [selectLote, setSelectLote] = useState("")
    const [selectCodigo, setSelectCodigo] = useState("")

    const [lotesSelecionados, setLotesSelecionados] = useState<ItemLoteProps[]>([])

    const [tamanho, setTamanho] = useState(0)

    const [fechar, setFechar] = useState(false)

    const [lote_id, setLotesID] = useState<Ids[]>([])
    const [descricaoLote, setDescricao] = useState<Descricao[]>([])

    const [novoLote, setNovoLote] = useState("")
    const [novoArea, setNovoArea] = useState("")
    const [novoTestada, setNovoTestada] = useState("")

    //bairros unicos
    const bairros = loteList.map((item) => {
        return item.bairro
    })


    const filteredBairros = bairros.filter((item, index) => {
        return bairros.indexOf(item) === index && item
    }).sort();

    const [selectBairro, setSelectBairro] = useState(filteredBairros[0])

    //quadras por bairro unicas 
    const quadrasPorBairro = loteList.filter((item) => {

        const searchBairro = selectBairro;
        const bair = item.bairro;

        return searchBairro && bair.includes(searchBairro);
    })

    const quadras = quadrasPorBairro.map((item) => {
        return item.quadra
    })

    const filtredQuadra = quadras.filter((item, index) => {
        return quadras.indexOf(item) === index && item
    }).sort();

    //lote por bairro e quadra 

    const lotePorBairroeQuadra = loteList.filter((item) => {

        const searchBairro = selectBairro;
        const bair = item.bairro;

        const searchQuadra = selectQuadra;
        const qua = item.quadra

        const searchinsc = selectInsc
        const inscri = item.insc_imob

        const searchcod = selectCodigo
        const cod = item.codigo_imovel

        if (searchinsc) {
            return inscri.includes(searchinsc)
        }

        if (searchcod) {

            return cod.includes(searchcod)
        }

        return searchBairro && bair.includes(searchBairro) && searchQuadra && qua.includes(searchQuadra);
    });

    async function handleRigth() {

        if (selectLote === "blank" || selectLote === "" || tamanho === 10) {

            return
        }

        const apiClient = setupAPIClient()
        const id = selectLote

        const response = await apiClient.get("/lote/unico", {
            params: {
                id: id
            }
        })

        const newLote: ItemLoteProps = response.data

        for (let item of lotesSelecionados) {
            if (item.id === newLote.id) {
                return
            }
        }

        lote_id.push({ id: newLote.id })
        lotesSelecionados.push(newLote)
        setTamanho(tamanho + 1)
        setFechar(true)


    }
    function handleLeft() {
        if (tamanho === 0) {
            return
        }
        if (tamanho === 1) {
            lotesSelecionados.pop()
            lote_id.pop()
            setTamanho(tamanho - 1)
            setFechar(false)
            return
        }
        lotesSelecionados.pop()
        lote_id.pop()
        setTamanho(tamanho - 1)
        return

    }


    async function handleNewProcess() {

   
        const apiClient = setupAPIClient()

        const setor_id = setores[selectSetor].id
        const prazo = 180

        const response = await apiClient.get("/me")
        const { departamento_id } = response.data;

        const tipoLote = true
        const descricaoPessoa = []
        try {
            await apiClient.post("/processocartorio", {
                observacao, prazo, descricaoPessoa, descricaoLote, lote_id,
                setor_id, departamento_id, tipo_id,tipoLote
            })
            location.reload()
        } catch {
            toast.error("Erro ao enviar processo")
        }

    }
    function handleChangeSetor(data) {
        setSelectSetor(data.value)
    }

    function handleChangeBairro(data) {
        setSelectBairro(data.value)
    }

    function handleChangeQuadra(data) {
        setSelectQuadra(data.value)
    }

    function handleChangeInsc(data) {
        setSelectInsc(data.value)

    }
    function handleChangeCod(data) {
        setSelectCodigo(data.value)

    }
    function handleChangeLote(data) {
        setSelectLote(data.value)

    }

    return (
        <div className={styles.container}>
            <section className={styles.content}>
                <div className={styles.filter}>
                    <h3>Filtro:</h3>
                    <div className={styles.filterTopSide}>

                        <div>
                            <label htmlFor="bairro">Bairro:</label>
                            <Dropdown clearable id="bairro" search selection options={
                                filteredBairros.map((item, index) => {
                                    return (
                                        { key: index, value: item, text: item }
                                    )
                                })
                            } value={selectBairro} disabled={fechar} onChange={(e, data) => handleChangeBairro(data)}>
                            </Dropdown>
                        </div>
                        <div>
                            <label htmlFor="quadra">Quadra:</label>
                            <Dropdown id="quadra" selection value={selectQuadra} disabled={fechar} onChange={(e, data) => handleChangeQuadra(data)} options={
                                filtredQuadra.map((item, index) => {
                                    return (
                                        { key: index, value: item, text: item }
                                    )
                                })
                            }>
                            </Dropdown>
                        </div>
                        <div>
                            <label htmlFor="inscricao">Insc. Imobiliaria:</label>
                            <Input type="search" list="insc" id="inscricao" value={selectInsc} onChange={(e, data) => handleChangeInsc(data)} />
                            <datalist id="insc" >
                                {loteList.map((item) => {
                                    return (
                                        <option key={item.id} value={item.insc_imob}></option>
                                    )
                                })}
                            </datalist>
                        </div>
                        <div>
                            <label htmlFor="codigo_imovel">Cod. Imóvel:</label>
                            <Input type="search" list="codigo" id="codigo_imovel" value={selectCodigo} onChange={(e, data) => handleChangeCod(data)} />
                            <datalist id="codigo" >
                                {loteList.map((item) => {
                                    return (
                                        <option key={item.id} value={item.codigo_imovel}></option>
                                    )
                                })}
                            </datalist>
                        </div>
                    </div>
                    <div className={styles.filterBottonSide}>
                        <div className={styles.lotes}>
                            <label htmlFor="lotes">Lotes:</label>
                            <Dropdown selection id="lotes" value={selectLote} options={lotePorBairroeQuadra.map((item) => {
                                return (
                                    { key: item.id, value: item.id, text: item.lote }
                                )
                            })} onChange={(e, data) => handleChangeLote(data)}>
                            </Dropdown>
                        </div>
                        <div className={styles.setas}>
                            <button onClick={handleRigth}><AiOutlineRight size={25} /></button>
                            <button onClick={handleLeft}><AiOutlineLeft size={25} /></button>
                        </div>
                        <div className={styles.selecionados}>
                            <label htmlFor="selecionado">Imóveis selecionados:</label>
                            <ul id="selecionado" placeholder="Imovel Selecionado">
                                {lotesSelecionados.map((item) => {
                                    return (
                                        <li key={item.id}>
                                            <span>Código: <strong>{item.codigo_imovel} </strong></span>
                                            <span>Proprietário: <strong>{item.proprietario}</strong> </span>
                                            <span>Lote: <strong>{item.lote}</strong> </span>
                                        </li>
                                    )
                                })}

                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <h3>Seleções:</h3>
                    <ul>
                        {lotesSelecionados.map((item, index) => {
                            return (
                                <li key={item.id}>
                                    <div>
                                        <label htmlFor="matricula">Matrícula</label>
                                        <textarea id="matricula" name="matricula" value={""} readOnly={true}></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="endereço">Endereço</label>
                                        <textarea name="endereco" value={`${item.logradouro}, Número: ${item.numero}`} readOnly={true} ></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="area">Area</label>
                                        <textarea id="area" name="area" value={item.area_total} readOnly={true}></textarea>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>


            </section>
            <section className={styles.contentDescricao}>
                <h3>Novos Lotes:</h3>
                <div className={styles.tableContainer}>

                    <Table celled size="large" className={styles.table}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Lote</Table.HeaderCell>
                                <Table.HeaderCell>Area</Table.HeaderCell>
                                <Table.HeaderCell>Testada</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell><Input type="text" placeholder='ex: "00-X"' value={novoLote} onChange={(e) => { setNovoLote(e.target.value) }} /></Table.Cell>
                                <Table.Cell><Input type="text" placeholder='ex: "000.00"' value={novoArea} onChange={(e) => { setNovoArea(e.target.value) }} /></Table.Cell>
                                <Table.Cell><Input type="text" placeholder='ex: "00.00"' value={novoTestada} onChange={(e) => { setNovoTestada(e.target.value) }} /></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
                <textarea name="observacao" placeholder="Observação" value={observacao} maxLength={340} onChange={(e) => setObservacao(e.target.value)} ></textarea>
                <div className={styles.encaminhar}>
                    <label htmlFor="encaminhar">Encaminhar para: </label>
                    <Dropdown id="encaminhar" selection onChange={(e, data) => handleChangeSetor(data)} value={selectSetor} options={
                        setores.map((item, index) => {
                            return (
                                { key: item.id, value: index, text: item.nome }
                            )
                        })
                    }>

                    </Dropdown>
                </div>
                <Button color="blue" onClick={handleNewProcess} className={styles.enviar}>Enviar</Button>
            </section>
        </div>
    )
}