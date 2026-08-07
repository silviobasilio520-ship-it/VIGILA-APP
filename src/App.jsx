import { useState, useEffect } from 'react'

function App() {
  const [mesAtual, setMesAtual] = useState(new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
  
  const [transacoes, setTransacoes] = useState(() => {
    const dadosSalvos = localStorage.getItem(`financapp_${mesAtual}`)
    return dadosSalvos ? JSON.parse(dadosSalvos) : []
  })

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('entrada')
  const [dataVenc, setDataVenc] = useState('')

  useEffect(() => {
    localStorage.setItem(`financapp_${mesAtual}`, JSON.stringify(transacoes))
  }, [transacoes, mesAtual])

  const adicionarTransacao = () => {
    if (descricao === '' || valor === '' || parseFloat(valor) <= 0) {
      alert('Preencha descrição e valor maior que 0')
      return
    }

    const novaTransacao = {
      id: Date.now(),
      descricao,
      valor: parseFloat(valor),
      tipo,
      dataVenc,
      paga: false
    }

    setTransacoes([...transacoes, novaTransacao])
    setDescricao('')
    setValor('')
    setDataVenc('')
  }

  const marcarComoPaga = (id) => {
    setTransacoes(transacoes.map(t => 
      t.id === id ? { ...t, paga: !t.paga } : t
    ))
  }

  const deletarTransacao = (id) => {
    setTransacoes(transacoes.filter(t => t.id !== id))
  }

  const salvarMes = () => {
    if(window.confirm(`Deseja salvar e zerar o mês de ${mesAtual}?`)){
      setTransacoes([])
      const proximoMes = new Date()
      proximoMes.setMonth(proximoMes.getMonth() + 1)
      setMesAtual(proximoMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
    }
  }

  const baixarBackup = () => {
    let texto = `=================================\n`
    texto += `FINANCAPP - BACKUP ${mesAtual.toUpperCase()}\n`
    texto += `Criado por Silvio Basílio\n`
    texto += `=================================\n\n`
    
    texto += `ENTRADAS\n`
    texto += `---------------------------------\n`
    entradas.forEach(t => {
      texto += `• ${t.descricao} - R$ ${t.valor.toFixed(2)} - Venc: ${t.dataVenc ? new Date(t.dataVenc).toLocaleDateString('pt-BR') : 'N/A'}\n`
    })
    texto += `\nSAÍDAS\n`
    texto += `---------------------------------\n`
    saidas.forEach(t => {
      texto += `• ${t.descricao} - R$ ${t.valor.toFixed(2)} - Venc: ${t.dataVenc ? new Date(t.dataVenc).toLocaleDateString('pt-BR') : 'N/A'} - ${t.paga ? 'PAGO' : 'A PAGAR'}\n`
    })
    texto += `\n=================================\n`
    texto += `TOTAL ENTRADAS: R$ ${totalEntradas.toFixed(2)}\n`
    texto += `TOTAL SAÍDAS:   R$ ${totalSaidas.toFixed(2)}\n`
    texto += `SALDO:          R$ ${saldo.toFixed(2)}\n`
    texto += `=================================`

    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `FinancApp_${mesAtual.replace(' ', '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const entradas = transacoes.filter(t => t.tipo === 'entrada')
  const saidas = transacoes.filter(t => t.tipo === 'saida')
  const totalEntradas = entradas.reduce((acc, t) => acc + t.valor, 0)
  const totalSaidas = saidas.reduce((acc, t) => acc + t.valor, 0)
  const saldo = totalEntradas - totalSaidas

  return (
    <div style={{ padding: '40px 20px 20px 20px', fontFamily: 'Arial', maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff' }}>
      
      {/* TOPO CORRIGIDO - AGORA NÃO TAMPA MAIS */}
      <div style={{ textAlign: 'center', marginBottom: '20px', paddingTop: '10px' }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '28px', lineHeight: '1.2' }}>💰 FinancApp</h1>
        <p style={{ fontSize: '14px', color: '#666', margin: '8px 0 0 0', fontWeight: '500' }}>App criado por Silvio Basílio</p>
      </div>

      {/* BOTÕES */}
      <button 
        onClick={salvarMes}
        style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '10px', width: '100%', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        Salvar Mês: {mesAtual}
      </button>

      <button 
        onClick={baixarBackup}
        style={{ padding: '12px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px', width: '100%', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        📥 Baixar Backup do Mês
      </button>

      {/* RESUMO */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ width: '200px', backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Entrada</h3>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>R$ {totalEntradas.toFixed(2)}</p>
        </div>
        <div style={{ width: '200px', backgroundColor: '#f44336', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Saída</h3>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>R$ {totalSaidas.toFixed(2)}</p>
        </div>
        <div style={{ width: '200px', backgroundColor: '#2196F3', color: 'white', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Saldo</h3>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ padding: '10px', flex: 2, borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' }} />
        <input type="number" placeholder="Valor R$" value={valor} onChange={(e) => setValor(e.target.value)} style={{ padding: '10px', width: '120px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="date" value={dataVenc} onChange={(e) => setDataVenc(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <button onClick={adicionarTransacao} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Adicionar
        </button>
      </div>

      {/* LISTA DE ENTRADAS */}
      <h2 style={{ color: '#4CAF50', borderBottom: '2px solid #4CAF50', paddingBottom: '5px' }}>Entradas</h2>
      {entradas.length === 0 ? <p style={{ color: '#888' }}>Nenhuma entrada ainda</p> : 
        entradas.map(transacao => (
          <div key={transacao.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: transacao.paga ? '#e0e0e0' : '#f9f9f9', textDecoration: transacao.paga ? 'line-through' : 'none', opacity: transacao.paga ? 0.6 : 1 }}>
            <span><b>{transacao.descricao}</b> - R$ {transacao.valor.toFixed(2)} {transacao.dataVenc && ` | Venc: ${new Date(transacao.dataVenc).toLocaleDateString('pt-BR')}`}</span>
            <button onClick={() => deletarTransacao(transacao.id)} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>X</button>
          </div>
        ))
      }

      {/* LISTA DE SAÍDAS */}
      <h2 style={{ color: '#f44336', borderBottom: '2px solid #f44336', paddingBottom: '5px', marginTop: '30px' }}>Saídas</h2>
      {saidas.length === 0 ? <p style={{ color: '#888' }}>Nenhuma saída ainda</p> : 
        saidas.map(transacao => (
          <div key={transacao.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: transacao.paga ? '#e0e0e0' : '#f9f9f9', textDecoration: transacao.paga ? 'line-through' : 'none', opacity: transacao.paga ? 0.6 : 1 }}>
            <span><b>{transacao.descricao}</b> - R$ {transacao.valor.toFixed(2)} {transacao.dataVenc && ` | Venc: ${new Date(transacao.dataVenc).toLocaleDateString('pt-BR')}`}</span>
            <div>
              <button onClick={() => marcarComoPaga(transacao.id)} style={{ background: transacao.paga ? 'gray' : '#FF9800', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', minWidth: '70px' }}>
                {transacao.paga ? 'Pago' : 'Pagar'}
              </button>
              <button onClick={() => deletarTransacao(transacao.id)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>X</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default App