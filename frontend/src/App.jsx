import { useState, useEffect } from 'react';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    transactionId: '',
    userEmail: '',
    amount: '',
    riskLevel: 'Alto',
    description: '',
    status: 'Pendiente'
  });

  const fetchAlerts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/alerts');
      const data = await res.json();
      setAlerts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar alertas:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount) })
      });
      if (res.ok) {
        setForm({ transactionId: '', userEmail: '', amount: '', riskLevel: 'Alto', description: '', status: 'Pendiente' });
        fetchAlerts();
      }
    } catch (err) {
      console.error('Error al crear alerta:', err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAlerts();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const deleteAlert = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: 'DELETE'
      });
      fetchAlerts();
    } catch (err) {
      console.error('Error al eliminar alerta:', err);
    }
  };

  // Cálculo de métricas
  const totalAlerts = alerts.length;
  const totalAmount = alerts.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const highRiskCount = alerts.filter(a => a.riskLevel === 'Alto').length;

  return (
    <div className="bg-slate-900 text-slate-100 font-sans min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🛡️ <span>Banco Alertas - Panel de Fraude</span>
          </h1>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full">
            Sistema Activo
          </span>
        </header>

        {/* Tarjetas de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Total Alertas</span>
            <p className="text-2xl font-bold text-white mt-1">{totalAlerts}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Monto Acumulado</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-xl shadow-lg">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Riesgo Alto</span>
            <p className="text-2xl font-bold text-red-400 mt-1">{highRiskCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-6 shadow-xl backdrop-blur-md lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Simular Transacción</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">ID Transacción</label>
                <input 
                  type="text" required placeholder="Ej: TXN-777888"
                  value={form.transactionId}
                  onChange={e => setForm({...form, transactionId: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Correo de Usuario</label>
                <input 
                  type="email" required placeholder="usuario@banco.com"
                  value={form.userEmail}
                  onChange={e => setForm({...form, userEmail: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Monto ($)</label>
                <input 
                  type="number" required placeholder="150000"
                  value={form.amount}
                  onChange={e => setForm({...form, amount: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nivel de Riesgo</label>
                <select 
                  value={form.riskLevel}
                  onChange={e => setForm({...form, riskLevel: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Descripción</label>
                <textarea 
                  required placeholder="Motivo de la alerta..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 h-20"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded transition text-sm shadow-lg shadow-emerald-900/20"
              >
                Registrar Alerta
              </button>
            </form>
          </div>

          {/* Listado con Acciones */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-6 shadow-xl backdrop-blur-md lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Alertas Recientes en Tiempo Real</h2>
            <div className="space-y-3">
              {loading ? (
                <p className="text-slate-400 text-center py-6">Cargando...</p>
              ) : alerts.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No hay alertas registradas todavía.</p>
              ) : (
                alerts.map(alert => (
                  <div key={alert._id} className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:border-slate-600">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">TXN: {alert.transactionId}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${alert.riskLevel === 'Alto' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : alert.riskLevel === 'Medio' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                          {alert.riskLevel}
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold">${alert.amount}</span>
                      </div>
                      <p className="text-sm text-slate-300">{alert.description}</p>
                      <span className="text-xs text-slate-500">{alert.userEmail} • {new Date(alert.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded font-medium ${alert.status === 'Bloqueada' ? 'bg-red-900/40 text-red-300' : alert.status === 'Aprobada' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                        {alert.status}
                      </span>
                      
                      {/* Botones de control */}
                      <button 
                        onClick={() => updateStatus(alert._id, 'Bloqueada')}
                        className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 px-2.5 py-1 rounded text-xs transition"
                        title="Bloquear transacción"
                      >
                        Bloquear
                      </button>
                      <button 
                        onClick={() => updateStatus(alert._id, 'Aprobada')}
                        className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded text-xs transition"
                        title="Aprobar transacción"
                      >
                        Aprobar
                      </button>
                      <button 
                        onClick={() => deleteAlert(alert._id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition"
                        title="Eliminar alerta"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;