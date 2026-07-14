import React, { useState } from 'react';

const NODES = [
  { id:1, name:'Solar Farm Lagos', type:'Solar', location:'Lagos, NG', capacity:500, status:'Active', output:423, ebt:12450 },
  { id:2, name:'Wind Node Kano', type:'Wind', location:'Kano, NG', capacity:200, status:'Active', output:178, ebt:5230 },
  { id:3, name:'Hydro Kainji', type:'Hydro', location:'Niger State, NG', capacity:1000, status:'Active', output:890, ebt:26100 },
  { id:4, name:'Solar Abuja East', type:'Solar', location:'Abuja, NG', capacity:300, status:'Pending', output:0, ebt:0 },
];

const ORDERS = [
  { id:'ORD-001', seller:'Solar Farm Lagos', ebt:500, price:0.08, total:40, status:'Open' },
  { id:'ORD-002', seller:'Wind Node Kano', ebt:200, price:0.075, total:15, status:'Open' },
  { id:'ORD-003', seller:'Hydro Kainji', ebt:1000, price:0.07, total:70, status:'Filled' },
];

const card = { background:'#111827', borderRadius:12, padding:20 };
const grid4 = { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 };

export default function GDEGDashboard() {
  const [tab, setTab] = useState('overview');
  const totalOutput = NODES.reduce((s,n)=>s+n.output,0);
  const totalEBT = NODES.reduce((s,n)=>s+n.ebt,0);

  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#0a0f1e',minHeight:'100vh',color:'#e2e8f0'}}>
      <div style={{background:'linear-gradient(135deg,#1a237e,#0d47a1,#006064)',padding:'24px 32px'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <span style={{fontSize:32}}>⚡</span>
          <div>
            <div style={{fontSize:22,fontWeight:700,color:'#fff'}}>GDEG Dashboard</div>
            <div style={{fontSize:13,color:'#90caf9'}}>Global Decentralized Energy Grid v1.0.0</div>
          </div>
          <div style={{marginLeft:'auto',background:'#00e676',color:'#000',padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:700}}>● TESTNET</div>
        </div>
        <div style={{display:'flex',gap:8,marginTop:20}}>
          {['overview','nodes','trading','analytics'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 18px',borderRadius:8,border:'none',cursor:'pointer',fontSize:13,fontWeight:600,background:tab===t?'#fff':'rgba(255,255,255,0.1)',color:tab===t?'#0d47a1':'#fff'}}>{t[0].toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{padding:'24px 32px'}}>
        <div style={grid4}>
          {[
            {label:'Total Nodes',value:NODES.length,icon:'🏭',color:'#42a5f5'},
            {label:'Active Nodes',value:NODES.filter(n=>n.status==='Active').length,icon:'✅',color:'#66bb6a'},
            {label:'Output (kWh)',value:totalOutput.toLocaleString(),icon:'⚡',color:'#ffa726'},
            {label:'EBT Minted',value:totalEBT.toLocaleString(),icon:'🪙',color:'#ab47bc'},
          ].map((s,i)=>(
            <div key={i} style={{...card,borderLeft:`4px solid ${s.color}`}}>
              <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
              <div style={{fontSize:24,fontWeight:700,color:s.color}}>{s.value}</div>
              <div style={{fontSize:12,color:'#9ca3af',marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>

        {tab==='overview' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:16,color:'#90caf9'}}>⚡ Platform Stats</div>
              {[['EBT in Circulation',totalEBT.toLocaleString()+' EBT'],['Open Orders',ORDERS.filter(o=>o.status==='Open').length],['Platform Fee','1.5%'],['Network','Polygon Mumbai'],['Status','In Development']].map(([k,v],i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #1f2937'}}>
                  <span style={{color:'#9ca3af',fontSize:13}}>{k}</span>
                  <span style={{fontWeight:600,fontSize:13}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:16,color:'#ffa726'}}>🌍 Rollout Roadmap</div>
              {[
                {phase:'Phase 1',label:'Nigeria — 50k nodes',status:'In Progress',color:'#ffa726'},
                {phase:'Phase 2',label:'Africa — 6M nodes',status:'Q1 2027',color:'#42a5f5'},
                {phase:'Phase 3',label:'SE Asia + LatAm',status:'2028',color:'#9ca3af'},
                {phase:'Phase 4',label:'EU + North America',status:'2029+',color:'#9ca3af'},
              ].map((r,i)=>(
                <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid #1f2937',alignItems:'center'}}>
                  <div style={{background:r.color,color:'#000',padding:'2px 8px',borderRadius:6,fontSize:11,fontWeight:700,whiteSpace:'nowrap'}}>{r.phase}</div>
                  <div style={{flex:1,fontSize:13}}>{r.label}</div>
                  <div style={{color:r.color,fontSize:12,fontWeight:600}}>{r.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='nodes' && (
          <div style={card}>
            <div style={{fontWeight:700,marginBottom:16,color:'#90caf9'}}>🏭 Energy Nodes</div>
            {NODES.map(n=>(
              <div key={n.id} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 0',borderBottom:'1px solid #1f2937'}}>
                <span style={{fontSize:24}}>{n.type==='Solar'?'☀️':n.type==='Wind'?'💨':'💧'}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600}}>{n.name}</div>
                  <div style={{fontSize:12,color:'#9ca3af'}}>{n.location} | {n.type} | {n.capacity} kW</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:14,fontWeight:600,color:'#ffa726'}}>{n.output} kWh</div>
                  <div style={{fontSize:12,color:'#ab47bc'}}>{n.ebt.toLocaleString()} EBT</div>
                </div>
                <div style={{padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:n.status==='Active'?'#1b5e20':'#1a237e',color:n.status==='Active'?'#69f0ae':'#90caf9'}}>{n.status}</div>
              </div>
            ))}
          </div>
        )}

        {tab==='trading' && (
          <div style={card}>
            <div style={{fontWeight:700,marginBottom:16,color:'#90caf9'}}>📈 EBT Marketplace</div>
            {ORDERS.map(o=>(
              <div key={o.id} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 0',borderBottom:'1px solid #1f2937'}}>
                <div style={{background:'#1f2937',padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,color:'#90caf9'}}>{o.id}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600}}>{o.seller}</div>
                  <div style={{fontSize:12,color:'#9ca3af'}}>{o.ebt} EBT @ ${o.price}/EBT</div>
                </div>
                <div style={{fontWeight:700,color:'#66bb6a'}}>${o.total} USDC</div>
                <div style={{padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:700,background:o.status==='Open'?'#1b5e20':'#212121',color:o.status==='Open'?'#69f0ae':'#9ca3af'}}>{o.status}</div>
                {o.status==='Open'&&<button style={{background:'#0d47a1',color:'#fff',border:'none',padding:'6px 14px',borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:600}}>Buy</button>}
              </div>
            ))}
          </div>
        )}

        {tab==='analytics' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:16,color:'#90caf9'}}>📊 Tokenomics</div>
              {[['EBT','1 EBT = 1 kWh renewable'],['GGT Supply','100M fixed'],['Community','40%'],['Team','30% (4yr vest)'],['Investors','20% (18mo lock)'],['Reserve','10%'],['Platform Fee','1.5%'],['Staking Yield','0.5% of fees']].map(([k,v],i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #1f2937'}}>
                  <span style={{color:'#9ca3af',fontSize:13}}>{k}</span>
                  <span style={{fontWeight:600,fontSize:13}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{fontWeight:700,marginBottom:16,color:'#ffa726'}}>💰 Revenue Projections</div>
              {[{n:'50k nodes',arr:'$2.4M',c:'$18M',t:'$20.4M',col:'#ffa726'},{n:'500k nodes',arr:'$24M',c:'$180M',t:'$204M',col:'#42a5f5'},{n:'5M nodes',arr:'$240M',c:'$1.8B',t:'$2.04B',col:'#66bb6a'}].map((r,i)=>(
                <div key={i} style={{background:'#1f2937',borderRadius:8,padding:12,marginBottom:8}}>
                  <div style={{fontWeight:700,color:r.col,marginBottom:4}}>{r.n}</div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                    <span style={{color:'#9ca3af'}}>Trading: {r.arr}</span>
                    <span style={{color:'#9ca3af'}}>Carbon: {r.c}</span>
                    <span style={{fontWeight:700,color:r.col}}>Total: {r.t}</span>
                  </div>
                </div>
              ))}
              <div style={{marginTop:12,padding:12,background:'#0d1f3c',borderRadius:8,fontSize:12}}>
                <div style={{fontWeight:700,color:'#90caf9',marginBottom:4}}>🚀 Fundraising</div>
                <div>Seed $2M — Q4 2026</div>
                <div>Series A $15M — Q2 2027</div>
                <div>Series B $50M — Q4 2027</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
