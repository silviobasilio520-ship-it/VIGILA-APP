import { useState } from 'react'

function App() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('entrada')
  const [transacoes, setTransacoes] = useState([])

  const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0)
  const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0)
  const saldo = totalEntradas - totalSaidas

  function adicionarTransacao(e) { 
    e.preventDefault()
    if (!descricao || !valor) return
    const novaTransacao = { id: Date.now(), descricao, valor: parseFloat(valor), tipo }
    setTransacoes([...transacoes, novaTransacao])
    setDescricao('')
    setValor('')
  }

  function removerTransacao(id) { 
    setTransacoes(transacoes.filter(t => t.id !== id)) 
  }
  
  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: 'auto'}}>
      <h1>Controle de Finanças</h1>
      
      <div style={{marginBottom: '20px', padding: '15px', border: '2px solid #ccc', borderRadius: '8px'}}>
        <h2 style={{color: saldo >= 0 ? 'green' : 'red', margin: 0}}>Saldo: R$ {saldo.toFixed(2)}</h2>
        <p style={{color: 'green', margin: '5px 0'}}>Entradas: R$ {totalEntradas.toFixed(2)}</p>
        <p style={{color: 'red', margin: '5px 0'}}>Saídas: R$ {totalSaidas.toFixed(2)}</p>
      </div>

      <form onSubmit={adicionarTransacao}>
        <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <button type="submit">Adicionar</button>
      </form>

      <h2>Transações</h2>
      <ul>
        {transacoes.map((t) => (
          <li key={t.id}>
            {t.descricao} - R$ {t.valor.toFixed(2)} - {t.tipo}
            <button onClick={() => removerTransacao(t.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default App;