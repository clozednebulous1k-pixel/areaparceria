import { useState, type FormEvent } from 'react'
import { contact } from '../data'
import { saveLead } from '../services/supportService'

export default function LeadForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    
    saveLead({
      name: (fd.get('nome') as string) || 'Cliente do Site',
      cnpj: (fd.get('cnpj') as string) || undefined,
      phone: (fd.get('telefone') as string) || '',
      email: (fd.get('email') as string) || '',
      destination: (fd.get('destino') as string) || undefined,
      materialType: (fd.get('material') as string) || undefined,
      subject: `Cotação de Materiais - ${(fd.get('material') as string) || 'Geral'}`,
      message: `Empresa/CNPJ: ${(fd.get('cnpj') as string) || '-'}\nDestino: ${(fd.get('destino') as string) || '-'}\nMaterial: ${(fd.get('material') as string) || '-'}\nDetalhes: ${(fd.get('mensagem') as string) || ''}`,
      source: 'contact_form',
    })

    setSent(true)
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Nome / Razão Social *
        <input name="nome" required placeholder="Seu nome ou Razão Social" />
      </label>
      <div className="form-row">
        <label>
          CNPJ
          <input name="cnpj" placeholder="00.000.000/0001-00" />
        </label>
        <label>
          Telefone / WhatsApp *
          <input name="telefone" required placeholder="(15) 99876-5432" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Destino (Cidade / Obra / UF) *
          <input name="destino" required placeholder="Ex.: Sorocaba — Obra Comercial" />
        </label>
        <label>
          Material Solicitado *
          <input name="material" required placeholder="Ex.: Cabos, Eletrodutos, Iluminação LED" />
        </label>
      </div>
      <label>
        E-mail para Orçamento
        <input type="email" name="email" placeholder="voce@empresa.com" />
      </label>
      <label>
        Observações ou Lista de Itens
        <textarea
          name="mensagem"
          placeholder="Volume, prazo, marcas preferenciais ou detalhes específicos."
        />
      </label>
      {sent ? (
        <div className="form-ok">
          Recebemos seu pedido. A equipe comercial entra em contato. Enquanto isso:{' '}
          {contact.phone}
        </div>
      ) : (
        <button className="btn btn-navy" type="submit">
          Quero cotar o projeto
        </button>
      )}
    </form>
  )
}
