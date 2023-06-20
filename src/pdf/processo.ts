import { ItemProcessProps } from "../pages/prefeitura"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { TDocumentDefinitions } from "pdfmake/interfaces";
import moment from "moment";

interface PdfRequest {

    processo: ItemProcessProps
}

export default function processoPdf({ processo }: PdfRequest) {
    
    
    pdfMake.vfs = pdfFonts.pdfMake.vfs;


    const descricaoPref = processo.descricaoLotes.map((item) => {
        return [
            { text: item.lote, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: item.area, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: item.testada, fontSize: 9, margin: [0, 2, 0, 2] }
        ]
    })

    let descricaoAprov = []

    if(processo.aprovacao){
        descricaoAprov = processo.aprovacao.descricao.map((item) => {
            return [
                { text: item.lote, fontSize: 9, margin: [0, 2, 0, 2] },
                { text: item.matricula, fontSize: 9, margin: [0, 2, 0, 2] },
                { text: item.transcricao, fontSize: 9, margin: [0, 2, 0, 2] },
                { text: item.data_registro, fontSize: 9, margin: [0, 2, 0, 2] }
            ]
        })
    }


    const lotes = processo.lote.map((item,index) => {
        return{
            text: '\n\n Lote ' + index + '\nLoteamento: '+ item.lote.lote
            + '\nQuadra: ' + item.lote.quadra + '\nBairro: ' + item.lote.bairro
            + '\n Inscrição Imobiliária: '+ item.lote.insc_imob + '\nCódigo do Imóvel: '
            + item.lote.codigo_imovel + '\nProprietário: ' + item.lote.proprietario 
            + '\nNúmero: ' + item.lote.numero + '\nLogradouro: ' + item.lote.logradouro

        }
    })

    let reenvio = []
    if(processo.aprovacao){
        if(processo.aprovacao.reenvio){
            reenvio = processo.aprovacao.reenvio.map((item,index) => {
                return {
                    text: '\n Reenvio '+ index +1 +'\n de:' + item.enviado_de + '     para:' + item.nome + '\n\n' + item.observacao
                }
            })
        }
    } 

    let alvara ='Não Necessário'

    if(processo.aprovacao){
        if(processo.aprovacao.alvara){
            alvara = processo.aprovacao.alvara
        }
    }

    let observacao = '\nNão houve resposta'
    if(processo.aprovacao){
        observacao = processo.aprovacao.observacao
    }

    const details = [

        { text: 'Detalhes do Processo', style: 'header' },
        {
            type: 'none',
            ul: [
                '\nCriado em: ' + moment(processo.criado_em).format("DD/MM/YYYY"),
                'Expira em: ' + moment(processo.prazo).format("DD/MM/YYYY"),
                'Ano: ' + processo.ano,
                'Tipo: ' + processo.tipo.nome,
                'Data de resposta: ' + processo.respondido_em || 'pendente',
                'Alvará de autorização por atraso: ' + alvara
            ]
        },

        { text: '\n\nLotes Relacionados:', style: 'header' },
        ...lotes,
        { text: '\n\nDescrição enviada:\n\n', style: 'header' },
        {
            table: {
                headerRows: 1,
                widths: [100, 100, 100],
                body: [
                    [
                        { text: 'Lote', style: 'tableHeader', fontSize: 10 },
                        { text: 'Area', style: 'tableHeader', fontSize: 10 },
                        { text: 'Testada', style: 'tableHeader', fontSize: 10 }
                    ],
                    ...descricaoPref
                ]

            },
            

        },
        { text: '\n\nResposta:\n\n', style: 'header' },
        {
            table: {
                headerRows: 1,
                widths: [100, 100, 100,100],
                body: [
                    [
                        { text: 'Lote', style: 'tableHeader', fontSize: 10 },
                        { text: 'Matricula', style: 'tableHeader', fontSize: 10 },
                        { text: 'Transcrição', style: 'tableHeader', fontSize: 10 },
                        { text: 'Data de Registro', style: 'tableHeader', fontSize: 10 }
                    ],
                    ...descricaoAprov
                ]

            },
            

        },

        { text: '\nObservação: \n'+ observacao , style: 'header'},
        ...reenvio
    ];

  

    const docDefinitions: TDocumentDefinitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],
        info: {
            title: 'Detalhes Processo',
            author: 'sicart',
            subject: 'descrição do processo',
        },
        header: { text: 'Processo ' + processo.num_processo,
        fontSize: 15,
        bold: true,
        margin: [15, 20, 0, 45]
        },
        content: [details]

    }


    pdfMake.createPdf(docDefinitions).download('processo' + processo.num_processo);
}