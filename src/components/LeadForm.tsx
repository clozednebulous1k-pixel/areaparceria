import { useState, type FormEvent } from 'react'
import { contact } from '../data'

export default function LeadForm() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Nome
        <input name="nome" required placeholder="Seu nome" />
      </label>
      <label>
        Empresa
        <input name="empresa" required placeholder="Razão social ou nome fantasia" />
      </label>
      <div className="form-row">
        <label>
          Telefone
          <input name="telefone" required placeholder="(00) 00000-0000" />
        </label>
        <label>
          UF / lote
          <input name="lote" placeholder="Ex.: SP — Lote 9" />
        </label>
      </div>
      <label>
        E-mail
        <input type="email" name="email" required placeholder="voce@empresa.com" />
      </label>
      <label>
        Como podemos atender
        <textarea
          name="mensagem"
          required
          placeholder="Volume, prazo, lista de materiais ou trecho do projeto."
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
