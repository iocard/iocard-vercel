import React, {useState, useEffect} from 'react'

function useAuth(){
  const [token,setToken] = useState(localStorage.getItem('admin_token')||'')
  const login = async (u,p)=>{
    const res = await fetch('/api/login.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})})
    const data = await res.json()
    if(data.token){ localStorage.setItem('admin_token',data.token); setToken(data.token); return true }
    return false
  }
  const logout = ()=>{ localStorage.removeItem('admin_token'); setToken('') }
  return {token,login,logout}
}

export default function Admin(){
  const {token,login,logout} = useAuth()
  const [view, setView] = useState('list')
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [form, setForm] = useState({username:'',alias:'',color:'#1f2937',googleReview:'',links:[{label:'',url:''}]})

  useEffect(()=>{ fetch('/api/user.js').then(r=>r.json()).then(d=>setUsers(d||[])); fetch('/api/admins.js').then(r=>r.json()).then(d=>setAdmins(d||[])) },[])

  const handleLogin = async (e)=>{ e.preventDefault(); const ok = await login(e.target.user.value,e.target.pass.value); if(!ok) alert('Credenciales inválidas') }

  const saveUser = async ()=>{
    const res = await fetch('/api/save.js',{method:'POST',headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(form)})
    if(res.ok){ alert('Guardado'); setView('list'); setUsers(await (await fetch('/api/user.js')).json()) }
    else alert('Error al guardar')
  }

  const saveAdmin = async (newAdmin)=>{
    const res = await fetch('/api/save-admin.js',{method:'POST',headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(newAdmin)})
    if(res.ok){ alert('Admin guardado'); setAdmins(await (await fetch('/api/admins.js')).json()) }
    else alert('Error admin')
  }

  if(!token) return (
    <div className="container">
      <h3>Admin login</h3>
      <form onSubmit={handleLogin}><input name="user" className="input" placeholder="user"/><input name="pass" type="password" className="input" placeholder="pass"/><button className="btn">Login</button></form>
    </div>
  )

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between'}}><h3>Panel Admin</h3><div><button className="btn" onClick={logout}>Logout</button></div></div>
      {view==='list' && <div>
        <h4>Usuarios</h4>
        <button className="btn" onClick={()=>{setForm({username:'',alias:'',color:'#1f2937',googleReview:'',links:[{label:'',url:''}]}); setView('edit')}}>Crear usuario</button>
        <ul>
          {users.map(u=> <li key={u.username} style={{margin:'6px 0'}}>{u.username} — <button className="btn" onClick={()=>{setForm(u); setView('edit')}}>Editar</button> <a className="btn" href={'/u/'+u.username}>Ver</a></li>)}
        </ul>
        <h4>Admins</h4>
        <ul>{admins.map(a=><li key={a.username}>{a.username}</li>)}</ul>
        <button className="btn" onClick={()=>setView('newadmin')}>Crear Admin</button>
      </div>}
      {view==='edit' && <div>
        <h4>Editar / Crear usuario</h4>
        <input className="input" placeholder="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
        <input className="input" placeholder="alias" value={form.alias} onChange={e=>setForm({...form,alias:e.target.value})}/>
        <input className="input" placeholder="color" value={form.color} onChange={e=>setForm({...form,colour:e.target.value,color:e.target.value})}/>
        <input className="input" placeholder="Google review url" value={form.googleReview} onChange={e=>setForm({...form,googleReview:e.target.value})}/>
        <h5>Links</h5>
        {form.links.map((l,i)=>(<div key={i}><input className="input" placeholder='label' value={l.label} onChange={e=>{ const n=[...form.links]; n[i].label=e.target.value; setForm({...form,links:n})}}/><input className="input" placeholder='url' value={l.url} onChange={e=>{ const n=[...form.links]; n[i].url=e.target.value; setForm({...form,links:n})}}/></div>))}
        <button className="btn" onClick={()=>setForm({...form,links:[...form.links,{label:'',url:''}]})}>Agregar link</button>
        <div style={{marginTop:10}}><button className="btn" onClick={saveUser}>Guardar</button> <button className="btn" onClick={()=>setView('list')}>Cancelar</button></div>
      </div>}
      {view==='newadmin' && <div>
        <h4>Crear Admin</h4>
        <input className="input" placeholder="username" id="new_admin_user"/><input className="input" placeholder="password" id="new_admin_pass"/><button className="btn" onClick={()=>saveAdmin({username:document.getElementById('new_admin_user').value,password:document.getElementById('new_admin_pass').value})}>Crear</button>
      </div>}
    </div>
  )
}