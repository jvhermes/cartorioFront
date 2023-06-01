import styles from "./styles.module.scss"
import { ItemCadastroProps, ItemLoteProps } from "../../../../pages/prefeitura"
import { useState } from "react"
import { AiOutlinePlus, AiOutlineMinus, AiOutlineLeft, AiOutlineRight } from "react-icons/ai"
import { setupAPIClient } from "../../../../services/api"
import { Descricao, Ids } from "./remembramento"
import { Dropdown, Input, Table, Button, TextArea } from "semantic-ui-react"

import { toast } from "react-toastify"

interface NewProcessProps {
    atividade: ItemCadastroProps;
    tipo: ItemCadastroProps;
    departamentoList: ItemCadastroProps[];
    loteList: ItemLoteProps[];
    numero_processo: string;
    ano: string;
    criado_em: string
}

export function Desmembramento({ atividade, tipo, departamentoList, loteList, numero_processo, ano, criado_em }: NewProcessProps) {

    const tipo_id = tipo.id;
    const atividade_id = atividade.id;
    const num_processo = numero_processo

    const [lote_id, setLote_id] = useState<Ids[]>([])

    const [departamentos, setDepartamentos] = useState(departamentoList || []);
    const [selectDepartamento, setSelectDepartamento] = useState(0)

    const [numLotes, setNumLotes] = useState(0)
    const [descricao, setDescricao] = useState<Descricao[]>([])


    const [endereco, setEndereco] = useState("")
    const [matricula, setMatricula] = useState("")
    const [area, setArea] = useState("")

    const [descricaoCod, setDescricaoCod] = useState(" ")
    const [descricaoProp, setDescricaoProp] = useState(" ")
    const [descricaoLote, setDescricaoLote] = useState(" ")

    const [selectInsc, setSelectInsc] = useState("")
    const [selectQuadra, setSelectQuadra] = useState("")
    const [selectLote, setSelectLote] = useState("")
    const [selectCodigo, setSelectCodigo] = useState("")


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
        const qua = item.quadra;

        const searchinsc = selectInsc;
        const inscri = item.insc_imob;

        const searchcod = selectCodigo;
        const cod = item.codigo_imovel;

        if (searchinsc) {
            return inscri.includes(searchinsc)
        }

        if (searchcod) {
            return cod.includes(searchcod)
        }

        return searchBairro && bair.includes(searchBairro) && searchQuadra && qua.includes(searchQuadra);
    });

    function handleMinus() {
        if (numLotes === 0) {
            return
        }
        descricao.pop()
        setNumLotes(numLotes - 1)
    }

    function handlePlus() {
        if (numLotes === 10) {

            return
        }

        descricao.push({
            area: "",
            lote: "",
            testada: ""
        })
        setNumLotes(numLotes + 1)
    }

    async function handleRigth() {

        if (selectLote === "blank" || selectLote === "") {
            setDescricaoProp("")
            setDescricaoCod("")
            setArea("")
            setEndereco("")
            return
        }
        const apiClient = setupAPIClient()
        const id = selectLote

        const response = await apiClient.get("/lote/unico", {
            params: {
                id: id
            }
        })

        const loteUnico: ItemLoteProps = response.data

        lote_id.push({ id: loteUnico.id })
        setDescricaoCod(loteUnico.codigo_imovel)
        setDescricaoProp(loteUnico.proprietario)
        setDescricaoLote(loteUnico.lote)
        setArea(loteUnico.area_total)
        setEndereco(`${loteUnico.logradouro}, Número: ${loteUnico.numero}`)
    }
    function handleLeft() {
        setDescricaoCod("")
        setDescricaoProp("")
        setArea("")
        setEndereco("")
        lote_id.pop()
        return
    }


    function handleChangeDepartamento(data) {
        setSelectDepartamento(data.value)
    }

    function handleChangeBairro(data) {
        setSelectBairro(data.value)
    }

    function handleChangeQuadra(data) {
        setSelectQuadra(data.value)
    }

    function handleChangeLote(data) {
        setSelectLote(data.value)

    }

    function handleChangeLoteDesc(e, index) {
        descricao[index].lote = e.target.value
        setDescricao([...descricao])
    }
    function handleChangeAreaDesc(e, index) {
        descricao[index].area = e.target.value
        setDescricao([...descricao])
    }
    function handleChangeTestadaDesc(e, index) {
        descricao[index].testada = e.target.value
        setDescricao([...descricao])
    }

    async function handleNewProcess() {

        const apiClient = setupAPIClient()
        const departamento_id = departamentos[selectDepartamento].id
        const prazo = 180
        const response = await apiClient.get("/me")
        const { setor_id } = response.data;


        if (num_processo === "" || atividade_id === "" || departamento_id === "" || lote_id[0] === null ||
            descricao[0].area === "" || tipo_id === "" || setor_id === "" || ano === "" || criado_em === "") {

            toast.error("Preencha todos os campos")
            return
        }


        try {
            await apiClient.post("/processo", {
                num_processo, prazo, atividade_id, departamento_id,
                lote_id, descricao, tipo_id, setor_id, ano, criado_em
            })


            location.reload()
        } catch {

            toast.error("Erro ao enviar processo")
        }


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
                            } value={selectBairro} onChange={(e, data) => handleChangeBairro(data)}>
                            </Dropdown>
                        </div>
                        <div>
                            <label htmlFor="quadra">Quadra:</label>
                            <Dropdown id="quadra" selection value={selectQuadra} onChange={(e, data) => handleChangeQuadra(data)} options={
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
                            <Input clearable type="search" list="insc" id="inscricao" value={selectInsc} onChange={(e) => setSelectInsc(e.target.value)} />
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
                            <Input clearable type="search" list="codigo" id="codigo_imovel" value={selectCodigo} onChange={(e) => setSelectCodigo(e.target.value)} />
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
                            <label htmlFor="selecionado">Imóvel selecionado:</label>
                            <ul id="selecionado" placeholder="Imovel Selecionado">
                                <li>
                                    <span>Código: <strong>{descricaoCod} </strong></span>
                                    <span>Proprietário: <strong>{descricaoProp}</strong> </span>
                                    <span>Lote: <strong>{descricaoLote}</strong> </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <h3>Seleções:</h3>
                    <ul>
                        <li>
                            <div>
                                <label htmlFor="matricula">Matrícula</label>
                                <textarea id="matricula" name="matricula" value={matricula} placeholder="Matricula" readOnly={true}></textarea>
                            </div>
                            <div>
                                <label htmlFor="endereco">Endereço</label>
                                <textarea id="endereco" name="endereco" value={endereco} placeholder="Endereco" className={styles.endereco} readOnly={true}></textarea>
                            </div>
                            <div>
                                <label htmlFor="area">Area</label>
                                <textarea id="area" name="area" value={area} placeholder="Area" readOnly={true}></textarea>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            <section className={styles.contentDescricao}>
                <h3>Novos Lotes:</h3>
                <div className={styles.number}>
                    <span>Número de Lotes: {numLotes}</span>
                    <button onClick={handlePlus}><AiOutlinePlus size={30} /></button>
                    <button onClick={handleMinus}><AiOutlineMinus size={30} /></button>
                </div>
                <div className={styles.tableContainer}>
                    <Table textAlign="center" celled size="large">
                        <Table.Header className={styles.table}>
                            <Table.Row >
                                <Table.HeaderCell>Lote</Table.HeaderCell>
                                <Table.HeaderCell>Area</Table.HeaderCell>
                                <Table.HeaderCell>Testada</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {descricao.map((item, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell><Input type="text" value={item.lote} onChange={(e) => handleChangeLoteDesc(e, index)} placeholder='ex: "00-X"' /></Table.Cell>
                                        <Table.Cell><Input type="text" value={item.area} onChange={(e) => handleChangeAreaDesc(e, index)} placeholder='ex: "000.00"' /></Table.Cell>
                                        <Table.Cell><Input type="text" value={item.testada} onChange={(e) => handleChangeTestadaDesc(e, index)} placeholder='ex: "00.00"' /></Table.Cell>
                                    </Table.Row>
                                )
                            })}

                        </Table.Body>
                    </Table>
                </div>

                <div className={styles.encaminhar}>
                    <label htmlFor="encaminhar">Encaminhar para:(departamentos)</label>
                    <Dropdown id="encaminhar" selection onChange={(e, data) => handleChangeDepartamento(data)} value={selectDepartamento} options={
                        departamentos.map((item, index) => {
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