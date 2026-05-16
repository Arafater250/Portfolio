import { useState, useRef, useEffect, useCallback } from "react";

const EDIT_PASSWORD = "arafat2024";
const STORAGE_KEY   = "arafater_portfolio_v1";

const DEFAULT_DATA = {
  name: "Arafater Rahman",
  title: "Mechanical Engineer | M.A.Sc | EIT | LEED AP",
  tagline: "Engineering with precision. Innovating with purpose.",
  avatar: "",
  backdropSlides: [],
  summary: "I am a dedicated Mechanical Engineer with a strong foundation in engineering principles, design, and analysis. My work spans thermal systems, structural mechanics, and product development — combining rigorous analytical thinking with hands-on problem solving to deliver reliable, efficient engineering solutions.",
  about: {
    bio: "My passion for engineering began with a curiosity about how things work — from engines to structures. Over the years I have developed expertise in mechanical design, thermodynamics, and manufacturing processes.\n\nI enjoy tackling complex engineering challenges and collaborating with multidisciplinary teams to bring innovative solutions to life.",
    interests: ["Thermodynamics & Heat Transfer","Structural & FEA Analysis","Product Design & Prototyping","Manufacturing & Process Engineering"],
    languages: ["English (Fluent)","Bengali (Native)"]
  },
  researchProjects: [
    { title:"Thermal Performance of Building Envelope Systems", year:"2024", desc:"Investigated heat transfer mechanisms in high-performance building envelopes using CFD simulation and experimental validation. Achieved 30% reduction in predicted heat loss.", tags:["Thermodynamics","CFD","Building Science"], image:"" },
    { title:"FEA of Composite Structural Members", year:"2023", desc:"Performed finite element analysis on fiber-reinforced composite beams under dynamic loading. Validated simulation results against experimental strain gauge data.", tags:["FEA","ANSYS","Composites"], image:"" },
    { title:"Energy Efficiency in HVAC Systems", year:"2022", desc:"Analyzed and optimized HVAC system configurations for commercial buildings targeting LEED certification. Achieved 25% energy savings.", tags:["HVAC","LEED","Energy Modelling"], image:"" }
  ],
  professionalWork: [
    { role:"Mechanical Engineer", company:"Engineering Firm", period:"2022 – Present", desc:"Lead mechanical design and analysis projects across thermal, structural, and fluid systems." },
    { role:"Junior Engineer", company:"Consulting Group", period:"2019 – 2022", desc:"Supported senior engineers on HVAC design, energy modelling, and building code compliance reviews." },
    { role:"Research Assistant", company:"University Lab", period:"2017 – 2019", desc:"Conducted experimental and computational research in heat transfer and fluid mechanics." }
  ],
  education: [
    { degree:"M.A.Sc, Mechanical Engineering", institution:"University", year:"2019", desc:"Thesis focused on thermal-fluid systems and energy efficiency in built environments." },
    { degree:"B.Sc, Mechanical Engineering", institution:"University", year:"2017", desc:"Dean's List. Specialized in thermodynamics and structural mechanics." }
  ],
  achievements: [
    { title:"LEED AP Certification", year:"2023", desc:"Achieved LEED Accredited Professional designation.", image:"" },
    { title:"Engineer-in-Training (EIT)", year:"2020", desc:"Passed the FE exam and registered as an Engineer-in-Training.", image:"" },
    { title:"Best Graduate Research Award", year:"2019", desc:"Awarded for outstanding thesis contribution in thermal-fluid engineering.", image:"" },
    { title:"Dean's List — Four Consecutive Years", year:"2017", desc:"Recognized for academic excellence throughout undergraduate studies.", image:"" }
  ],
  certificates: [
    { name:"LEED Accredited Professional", issuer:"U.S. Green Building Council", year:"2023" },
    { name:"Engineer-in-Training (EIT)", issuer:"Professional Engineers Ontario", year:"2020" },
    { name:"AutoCAD Certified Professional", issuer:"Autodesk", year:"2021" },
    { name:"SolidWorks Associate (CSWA)", issuer:"Dassault Systemes", year:"2019" }
  ],
  publications: [
    { title:"Thermal Performance Analysis of High-Performance Building Envelopes", venue:"Energy and Buildings, 2024", authors:"Rahman, A., et al." },
    { title:"FEA of Composite Beams Under Dynamic Loading Conditions", venue:"Journal of Composite Materials, 2023", authors:"Rahman, A., et al." },
    { title:"Energy Optimization in HVAC Systems for LEED-Certified Buildings", venue:"ASHRAE Transactions, 2022", authors:"Rahman, A., et al." }
  ],
  skills: {
    "Design & CAD":["SolidWorks","AutoCAD","CATIA","Fusion 360","Creo","Inventor"],
    "Analysis & Simulation":["ANSYS","MATLAB","Abaqus","COMSOL","CFD","FEA"],
    "Manufacturing":["CNC Machining","3D Printing","GD&T","Welding","Lean Manufacturing"],
    "Soft Skills":["Technical Reporting","Project Management","Team Collaboration","Problem Solving"]
  },
  contact:{ email:"arafater.rahman@example.com", linkedin:"linkedin.com/in/arafater-rahman", twitter:"@arafaterrahman", location:"Canada" }
};

const GRADIENTS = [
  "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
  "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
  "linear-gradient(135deg,#2d1b69 0%,#11998e 100%)",
  "linear-gradient(135deg,#141414 0%,#1c3a2a 50%,#2d5016 100%)",
  "linear-gradient(135deg,#2c1810 0%,#4a2c2a 50%,#1a1a2e 100%)",
];

const C = { accent:"#C8A96E", bg:"#141414", bg2:"#1C1C1C", bg3:"#242424", text:"#E8E4DC", muted:"#888", border:"rgba(200,169,110,0.2)" };
const SECTIONS = ["home","about","research","work","education","achievements","certificates","publications","skills","contact"];

// ── Storage helpers ──
function saveToStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

// ── Backdrop slider ──
function BackdropSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const total = slides.length > 0 ? slides.length : GRADIENTS.length;
  const usingImages = slides.length > 0;

  const goTo = useCallback((idx) => {
    setVisible(false);
    setTimeout(() => { setCurrent(idx); setVisible(true); }, 400);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent(prev => {
        const next = (prev + 1) % total;
        setVisible(false);
        setTimeout(() => setVisible(true), 400);
        return next;
      });
    }, 4500);
    return () => clearInterval(t);
  }, [total]);

  const bgStyle = usingImages
    ? { backgroundImage:`url(${slides[current]})`, backgroundSize:"cover", backgroundPosition:"center" }
    : { background: GRADIENTS[current % GRADIENTS.length] };

  return (
    <>
      <div style={{ position:"absolute", inset:0, zIndex:0, ...bgStyle, opacity:visible?1:0, transition:"opacity 0.75s ease-in-out" }}/>
      <div style={{ position:"absolute", inset:0, zIndex:1, background:"rgba(0,0,0,0.55)" }}/>
      <button onClick={() => goTo((current-1+total)%total)} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", zIndex:10, width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>&#8249;</button>
      <button onClick={() => goTo((current+1)%total)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", zIndex:10, width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>&#8250;</button>
      <div style={{ position:"absolute", bottom:58, left:"50%", transform:"translateX(-50%)", display:"flex", gap:7, zIndex:10 }}>
        {Array.from({length:total}).map((_,i) => (
          <button key={i} onClick={() => goTo(i)} style={{ width:i===current?22:7, height:7, borderRadius:4, border:"none", background:i===current?C.accent:"rgba(255,255,255,0.3)", cursor:"pointer", padding:0, transition:"all 0.3s" }}/>
        ))}
      </div>
    </>
  );
}

// ── Backdrop upload (edit mode only) ──
function BackdropUpload({ slides, onChange }) {
  const inputRef = useRef();
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    const b64s = await Promise.all(files.map(readFileAsBase64));
    onChange([...slides, ...b64s]);
    e.target.value = "";
  };
  const remove = (i) => onChange(slides.filter((_,idx) => idx !== i));
  return (
    <div style={{ width:"100%", maxWidth:480, marginTop:20, padding:"16px 18px", background:"rgba(0,0,0,0.75)", border:`1.5px solid ${C.accent}`, borderRadius:12, boxSizing:"border-box" }}>
      <p style={{ margin:"0 0 10px", fontSize:12, color:C.accent, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>Backdrop Slideshow Photos</p>
      <button onClick={() => inputRef.current.click()} style={{ width:"100%", padding:"10px", borderRadius:8, border:`1.5px dashed ${C.accent}`, background:"rgba(200,169,110,0.07)", color:C.accent, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit", marginBottom:10 }}>
        + Upload Photos from Device (select multiple)
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleFiles}/>
      {slides.length > 0 ? (
        <>
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.5)", margin:"0 0 8px" }}>{slides.length} photo{slides.length!==1?"s":""} — click x to remove</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {slides.map((s,i) => (
              <div key={i} style={{ position:"relative", width:58, height:44, flexShrink:0 }}>
                <img src={s} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:5, border:`2px solid ${C.accent}` }}/>
                <button onClick={() => remove(i)} style={{ position:"absolute", top:-7, right:-7, width:17, height:17, borderRadius:"50%", background:"#d33", border:"2px solid #141414", color:"#fff", fontSize:9, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>x</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>No photos yet — gradients playing by default. Upload your own to replace them.</p>
      )}
    </div>
  );
}

// ── Avatar upload ──
function AvatarUpload({ value, onChange }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);
  const handleFiles = async (files) => {
    const f = files[0];
    if (!f || !f.type.startsWith("image/")) return;
    onChange(await readFileAsBase64(f));
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <div onClick={() => inputRef.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files);}}
        style={{ width:126, height:126, borderRadius:"50%", border:`3px dashed ${drag?"#fff":C.accent}`, cursor:"pointer", overflow:"hidden", position:"relative", background:"rgba(20,20,20,0.8)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 0 5px rgba(200,169,110,0.15)` }}>
        {value ? (
          <>
            <img src={value} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
              <span style={{ fontSize:11, color:"#fff" }}>Change</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:10 }}>
            <div style={{ fontSize:24, marginBottom:4 }}>📷</div>
            <div style={{ fontSize:10, color:C.accent, lineHeight:1.5 }}>Upload Photo</div>
            <div style={{ fontSize:9, color:C.muted }}>or drag & drop</div>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFiles(e.target.files)}/>
      {value && <button onClick={()=>onChange("")} style={{ fontSize:11, color:"#f88", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Remove photo</button>}
    </div>
  );
}

// ── Card image upload ──
function ImgUpload({ value, onChange, size=150 }) {
  const inputRef = useRef();
  const handleFiles = async (files) => {
    const f = files[0];
    if (!f || !f.type.startsWith("image/")) return;
    onChange(await readFileAsBase64(f));
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
      <div onClick={() => inputRef.current.click()} style={{ width:size, height:Math.round(size*0.68), borderRadius:8, border:`2px dashed ${C.accent}`, cursor:"pointer", overflow:"hidden", background:"rgba(200,169,110,0.05)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        {value ? (
          <>
            <img src={value} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
              <span style={{ fontSize:11, color:"#fff" }}>Change</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:18 }}>🖼️</div>
            <div style={{ fontSize:10, color:C.accent }}>Upload Image</div>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFiles(e.target.files)}/>
      {value && <button onClick={()=>onChange("")} style={{ fontSize:10, color:"#f88", background:"none", border:"none", cursor:"pointer" }}>Remove</button>}
    </div>
  );
}

// ── Editable text ──
function ET({ value, onChange, editing, multiline, style, placeholder }) {
  if (!editing) return multiline ? <p style={{ margin:0, ...style }}>{value}</p> : <span style={style}>{value}</span>;
  return multiline
    ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:`1px solid ${C.border}`, borderRadius:6, color:"#fff", padding:"8px 10px", fontSize:"inherit", fontFamily:"inherit", lineHeight:1.6, resize:"vertical", minHeight:70, boxSizing:"border-box", ...style }}/>
    : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ background:"rgba(255,255,255,0.07)", border:`1px solid ${C.border}`, borderRadius:6, color:"#fff", padding:"5px 10px", fontSize:"inherit", fontFamily:"inherit", width:"100%", boxSizing:"border-box", ...style }}/>;
}

const Tag = ({label}) => <span style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(200,169,110,0.12)", color:C.accent, border:`1px solid rgba(200,169,110,0.28)` }}>{label}</span>;
const SectionTitle = ({children}) => (
  <div style={{ marginBottom:36, display:"flex", alignItems:"center", gap:14 }}>
    <span style={{ width:36, height:2, background:C.accent, display:"inline-block", flexShrink:0 }}/>
    <h2 style={{ fontSize:26, fontWeight:700, color:C.text, margin:0, fontFamily:"'Playfair Display',serif" }}>{children}</h2>
  </div>
);
const Card = ({children,style}) => <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:"22px 26px", ...style }}>{children}</div>;
const AddBtn = ({onClick,label}) => (
  <button onClick={onClick} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:14, padding:"10px 20px", borderRadius:8, border:`1.5px dashed ${C.accent}`, background:"rgba(200,169,110,0.05)", color:C.accent, cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit", width:"100%" }}>+ {label}</button>
);
const DelBtn = ({onClick}) => (
  <button onClick={onClick} style={{ background:"rgba(255,80,80,0.1)", border:"1px solid rgba(255,80,80,0.3)", color:"#f99", borderRadius:6, cursor:"pointer", fontSize:11, padding:"3px 10px", fontFamily:"inherit" }}>Remove</button>
);
const SmIn = ({value,onChange,w=72}) => (
  <input value={value} onChange={e=>onChange(e.target.value)} style={{ width:w, background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`, borderRadius:4, color:C.accent, padding:"2px 6px", fontSize:12, fontFamily:"inherit", textAlign:"center" }}/>
);

// ── Password modal ──
function PasswordModal({ onSuccess, onCancel }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const check = () => {
    if (pw === EDIT_PASSWORD) { onSuccess(); }
    else { setErr(true); setPw(""); setTimeout(() => setErr(false), 1500); }
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.bg2, border:`1px solid ${C.accent}`, borderRadius:14, padding:"32px 36px", width:320, textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>🔐</div>
        <h3 style={{ color:C.accent, fontFamily:"'Playfair Display',serif", margin:"0 0 8px", fontSize:20 }}>Edit Mode</h3>
        <p style={{ color:C.muted, fontSize:13, margin:"0 0 20px" }}>Enter your password to unlock editing</p>
        <input
          type="password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&check()}
          placeholder="Password"
          autoFocus
          style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1.5px solid ${err?"#f55":C.border}`, background:"rgba(255,255,255,0.07)", color:"#fff", fontSize:15, fontFamily:"inherit", boxSizing:"border-box", marginBottom:8, outline:"none", transition:"border 0.2s" }}
        />
        {err && <p style={{ color:"#f77", fontSize:12, margin:"0 0 8px" }}>Incorrect password</p>}
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"9px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", fontFamily:"inherit", fontSize:13 }}>Cancel</button>
          <button onClick={check} style={{ flex:1, padding:"9px", borderRadius:8, border:"none", background:C.accent, color:"#141414", cursor:"pointer", fontWeight:700, fontFamily:"inherit", fontSize:13 }}>Unlock</button>
        </div>
        <p style={{ color:C.muted, fontSize:11, marginTop:14, lineHeight:1.5 }}>Default password: <span style={{ color:C.accent, fontFamily:"monospace" }}>{EDIT_PASSWORD}</span></p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
export default function Portfolio() {
  // Load from localStorage on first render
  const [data, setData] = useState(() => loadFromStorage() || DEFAULT_DATA);
  const [editing, setEditing]   = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [active, setActive]     = useState("home");
  const refs = useRef({});

  // Auto-save to localStorage whenever data changes
  useEffect(() => { saveToStorage(data); }, [data]);

  const set = (path, val) => setData(prev => {
    const next = JSON.parse(JSON.stringify(prev));
    const keys = path.split(".");
    let obj = next;
    for (let i=0;i<keys.length-1;i++) obj=obj[keys[i]];
    obj[keys[keys.length-1]] = val;
    return next;
  });
  const updArr = (k,i,patch) => { const a=JSON.parse(JSON.stringify(data[k])); a[i]={...a[i],...patch}; set(k,a); };
  const delArr = (k,i) => set(k, data[k].filter((_,idx)=>idx!==i));

  const scrollTo = s => { setActive(s); refs.current[s]?.scrollIntoView({behavior:"smooth",block:"start"}); };
  const r = s => el => { refs.current[s]=el; };
  const nl = {home:"Home",about:"About",research:"Research",work:"Work",education:"Education",achievements:"Achievements",certificates:"Certificates",publications:"Publications",skills:"Skills",contact:"Contact"};

  const handleEditClick = () => {
    if (editing) { setEditing(false); }
    else { setShowPwModal(true); }
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.bg, color:C.text, minHeight:"100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>

      {showPwModal && (
        <PasswordModal
          onSuccess={() => { setShowPwModal(false); setEditing(true); }}
          onCancel={() => setShowPwModal(false)}
        />
      )}

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(20,20,20,0.94)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, gap:8, flexWrap:"wrap" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, color:C.accent, fontWeight:700, whiteSpace:"nowrap" }}>{data.name}</div>
          <div style={{ display:"flex", gap:1, alignItems:"center", flexWrap:"wrap" }}>
            {SECTIONS.map(s=>(
              <button key={s} onClick={()=>scrollTo(s)} style={{ background:"none", border:"none", color:active===s?C.accent:C.muted, cursor:"pointer", fontSize:12, fontWeight:active===s?600:400, padding:"3px 7px", textTransform:"capitalize", fontFamily:"inherit" }}>{nl[s]}</button>
            ))}
            <button onClick={handleEditClick} style={{ marginLeft:10, padding:"6px 16px", borderRadius:6, border:`1px solid ${C.accent}`, background:editing?C.accent:"transparent", color:editing?"#141414":C.accent, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
              {editing ? "✓ Done" : "✎ Edit"}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={r("home")} style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"120px 24px 100px", position:"relative", overflow:"hidden" }}>
        <BackdropSlider slides={data.backdropSlides}/>

        <div style={{ position:"relative", zIndex:5, display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
          {/* Avatar */}
          <div style={{ marginBottom:22 }}>
            {editing ? <AvatarUpload value={data.avatar} onChange={v=>set("avatar",v)}/> : (
              <div style={{ width:118, height:118, borderRadius:"50%", border:`3px solid ${C.accent}`, overflow:"hidden", background:"rgba(20,20,20,0.8)", boxShadow:`0 0 0 6px rgba(200,169,110,0.15), 0 8px 40px rgba(0,0,0,0.6)`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto" }}>
                {data.avatar ? <img src={data.avatar} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <span style={{ color:C.accent, fontFamily:"'Playfair Display',serif", fontSize:44 }}>{data.name.charAt(0)}</span>}
              </div>
            )}
          </div>

          {/* Frosted card */}
          <div style={{ background:"rgba(0,0,0,0.38)", backdropFilter:"blur(10px)", borderRadius:16, padding:"22px 36px 26px", border:"1px solid rgba(255,255,255,0.09)", maxWidth:520, width:"100%" }}>
            <p style={{ fontSize:10, letterSpacing:"0.25em", color:C.accent, textTransform:"uppercase", marginBottom:8 }}>Portfolio</p>
            <h1 style={{ fontSize:"clamp(26px,4.5vw,52px)", fontWeight:700, fontFamily:"'Playfair Display',serif", margin:"0 0 10px", lineHeight:1.1, color:"#fff" }}>
              Hi, I am{" "}
              {editing
                ? <input value={data.name} onChange={e=>set("name",e.target.value)} style={{ fontSize:"inherit", fontWeight:700, fontFamily:"'Playfair Display',serif", background:"rgba(255,255,255,0.1)", border:`1px solid ${C.accent}`, borderRadius:6, color:C.accent, padding:"2px 8px" }}/>
                : <span style={{ color:C.accent }}>{data.name}</span>}
            </h1>
            <p style={{ fontSize:"clamp(12px,1.5vw,16px)", color:"rgba(255,255,255,0.72)", marginBottom:10 }}>
              {editing ? <input value={data.title} onChange={e=>set("title",e.target.value)} style={{ background:"rgba(255,255,255,0.08)", border:`1px solid ${C.border}`, borderRadius:6, color:"#ddd", padding:"4px 10px", width:"100%", fontFamily:"inherit", fontSize:"inherit", boxSizing:"border-box" }}/> : data.title}
            </p>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.55)", lineHeight:1.7, margin:0 }}>
              {editing ? <textarea value={data.tagline} onChange={e=>set("tagline",e.target.value)} style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:`1px solid ${C.border}`, borderRadius:6, color:"#ccc", padding:"7px 10px", fontFamily:"inherit", fontSize:14, resize:"vertical", boxSizing:"border-box" }}/> : data.tagline}
            </p>
            <div style={{ marginTop:20, display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
              <button onClick={()=>scrollTo("contact")} style={{ padding:"10px 24px", borderRadius:6, background:C.accent, color:"#141414", border:"none", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"inherit" }}>Get In Touch</button>
              <button onClick={()=>scrollTo("research")} style={{ padding:"10px 24px", borderRadius:6, background:"rgba(255,255,255,0.1)", color:"#fff", border:"1px solid rgba(255,255,255,0.2)", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>View Research</button>
            </div>
          </div>

          {/* Backdrop upload — only when editing */}
          {editing && <BackdropUpload slides={data.backdropSlides} onChange={v=>set("backdropSlides",v)}/>}
        </div>

        <div style={{ position:"absolute", bottom:18, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:4, zIndex:5 }}>
          <span style={{ fontSize:9, color:"rgba(255,255,255,0.35)", letterSpacing:"0.14em" }}>SCROLL</span>
          <div style={{ width:1, height:26, background:`linear-gradient(${C.accent}, transparent)` }}/>
        </div>
      </section>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"0 24px" }}>

        {/* SUMMARY */}
        <section ref={r("about")} style={{ padding:"80px 0 40px" }}>
          <SectionTitle>Professional Summary</SectionTitle>
          <Card><ET value={data.summary} onChange={v=>set("summary",v)} editing={editing} multiline style={{ fontSize:16, lineHeight:1.8, color:"#ccc" }}/></Card>
        </section>

        {/* ABOUT */}
        <section style={{ padding:"40px 0 80px" }}>
          <SectionTitle>About Me</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <Card>
              <h3 style={{ color:C.accent, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Background</h3>
              <ET value={data.about.bio} onChange={v=>set("about.bio",v)} editing={editing} multiline style={{ fontSize:14, lineHeight:1.7, color:"#bbb" }}/>
            </Card>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <Card>
                <h3 style={{ color:C.accent, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Research Interests</h3>
                {data.about.interests.map((item,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:i<data.about.interests.length-1?`1px solid ${C.border}`:"none" }}>
                    <span style={{ color:C.accent, fontSize:9, flexShrink:0 }}>&#9670;</span>
                    {editing ? <input value={item} onChange={e=>{const a=[...data.about.interests];a[i]=e.target.value;set("about.interests",a);}} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:4, color:"#fff", padding:"3px 8px", fontSize:13, fontFamily:"inherit" }}/> : <span style={{ fontSize:13, color:"#ccc" }}>{item}</span>}
                  </div>
                ))}
              </Card>
              <Card>
                <h3 style={{ color:C.accent, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>Languages</h3>
                {data.about.languages.map((l,i)=>(
                  <div key={i} style={{ marginBottom:6 }}>
                    {editing ? <input value={l} onChange={e=>{const a=[...data.about.languages];a[i]=e.target.value;set("about.languages",a);}} style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:4, color:"#fff", padding:"3px 8px", fontSize:13, fontFamily:"inherit" }}/> : <span style={{ fontSize:13, color:"#bbb" }}>{l}</span>}
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </section>

        {/* RESEARCH PROJECTS */}
        <section ref={r("research")} style={{ padding:"40px 0 80px" }}>
          <SectionTitle>Research Projects</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {data.researchProjects.map((proj,i)=>(
              <Card key={i}>
                {editing && <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}><DelBtn onClick={()=>delArr("researchProjects",i)}/></div>}
                <div style={{ display:"grid", gridTemplateColumns:(proj.image||editing)?"1fr 170px":"1fr", gap:20, alignItems:"flex-start" }}>
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, gap:8, flexWrap:"wrap" }}>
                      <div style={{ flex:1 }}><ET value={proj.title} onChange={v=>updArr("researchProjects",i,{title:v})} editing={editing} style={{ fontSize:16, fontWeight:600, color:C.text }}/></div>
                      {editing ? <SmIn value={proj.year} onChange={v=>updArr("researchProjects",i,{year:v})}/> : <span style={{ fontSize:12, color:C.accent, fontWeight:600 }}>{proj.year}</span>}
                    </div>
                    <ET value={proj.desc} onChange={v=>updArr("researchProjects",i,{desc:v})} editing={editing} multiline style={{ fontSize:13, color:"#aaa", lineHeight:1.65 }}/>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>{proj.tags.map((t,j)=><Tag key={j} label={t}/>)}</div>
                    {editing && <input value={proj.tags.join(", ")} onChange={e=>updArr("researchProjects",i,{tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)})} placeholder="Tags: comma, separated" style={{ marginTop:10, width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:4, color:"#aaa", padding:"5px 10px", fontSize:12, fontFamily:"inherit", boxSizing:"border-box" }}/>}
                  </div>
                  {(proj.image||editing) && (
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      {editing ? <ImgUpload value={proj.image} onChange={v=>updArr("researchProjects",i,{image:v})} size={155}/> : <img src={proj.image} alt={proj.title} style={{ width:"100%", borderRadius:8, objectFit:"cover", maxHeight:150 }}/>}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          {editing && <AddBtn onClick={()=>set("researchProjects",[...data.researchProjects,{title:"New Project Title",year:"2024",desc:"Describe your project here.",tags:["Tag1"],image:""}])} label="Add New Project"/>}
        </section>

        {/* PROFESSIONAL WORK */}
        <section ref={r("work")} style={{ padding:"40px 0 80px" }}>
          <SectionTitle>Professional Work</SectionTitle>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:`linear-gradient(${C.accent}, transparent)` }}/>
            <div style={{ display:"flex", flexDirection:"column", gap:26, paddingLeft:32 }}>
              {data.professionalWork.map((job,i)=>(
                <div key={i} style={{ position:"relative" }}>
                  <div style={{ position:"absolute", left:-38, top:8, width:12, height:12, borderRadius:"50%", background:C.accent, border:`2px solid ${C.bg}` }}/>
                  <Card>
                    {editing && <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}><DelBtn onClick={()=>delArr("professionalWork",i)}/></div>}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                      <div style={{ flex:1 }}>
                        <ET value={job.role} onChange={v=>updArr("professionalWork",i,{role:v})} editing={editing} style={{ fontSize:16, fontWeight:600, color:C.text, display:"block", marginBottom:3 }}/>
                        <ET value={job.company} onChange={v=>updArr("professionalWork",i,{company:v})} editing={editing} style={{ fontSize:13, color:C.accent }}/>
                      </div>
                      <div style={{ fontSize:12, color:C.muted, padding:"3px 10px", border:`1px solid ${C.border}`, borderRadius:4 }}>
                        {editing ? <input value={job.period} onChange={e=>updArr("professionalWork",i,{period:e.target.value})} style={{ background:"none", border:"none", color:C.muted, fontSize:12, fontFamily:"inherit", width:140 }}/> : job.period}
                      </div>
                    </div>
                    <ET value={job.desc} onChange={v=>updArr("professionalWork",i,{desc:v})} editing={editing} multiline style={{ fontSize:13, color:"#aaa", lineHeight:1.65 }}/>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          {editing && <AddBtn onClick={()=>set("professionalWork",[...data.professionalWork,{role:"New Role",company:"Company Name",period:"2024 – Present",desc:"Describe responsibilities here."}])} label="Add Work Experience"/>}
        </section>

        {/* EDUCATION */}
        <section ref={r("education")} style={{ padding:"40px 0 80px" }}>
          <SectionTitle>Education</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {data.education.map((edu,i)=>(
              <Card key={i} style={{ borderTop:`3px solid ${C.accent}` }}>
                {editing && <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8 }}><DelBtn onClick={()=>delArr("education",i)}/></div>}
                <div style={{ marginBottom:8 }}>{editing ? <SmIn value={edu.year} onChange={v=>updArr("education",i,{year:v})}/> : <span style={{ fontSize:11, color:C.accent }}>{edu.year}</span>}</div>
                <ET value={edu.degree} onChange={v=>updArr("education",i,{degree:v})} editing={editing} style={{ fontSize:15, fontWeight:600, color:C.text, display:"block", marginBottom:4 }}/>
                <ET value={edu.institution} onChange={v=>updArr("education",i,{institution:v})} editing={editing} style={{ fontSize:13, color:C.accent, display:"block", marginBottom:8 }}/>
                <ET value={edu.desc} onChange={v=>updArr("education",i,{desc:v})} editing={editing} multiline style={{ fontSize:12, color:"#999", lineHeight:1.6 }}/>
              </Card>
            ))}
          </div>
          {editing && <AddBtn onClick={()=>set("education",[...data.education,{degree:"Degree Name",institution:"Institution",year:"2024",desc:"Details."}])} label="Add Education"/>}
        </section>

        {/* ACHIEVEMENTS */}
        <section ref={r("achievements")} style={{ padding:"40px 0 80px" }}>
          <SectionTitle>Achievements</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
            {data.achievements.map((a,i)=>(
              <Card key={i} style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {editing && <div style={{ display:"flex", justifyContent:"flex-end" }}><DelBtn onClick={()=>delArr("achievements",i)}/></div>}
                {editing ? <div style={{ display:"flex", justifyContent:"center" }}><ImgUpload value={a.image} onChange={v=>updArr("achievements",i,{image:v})} size={120}/></div>
                  : a.image ? <img src={a.image} alt={a.title} style={{ width:"100%", height:110, objectFit:"cover", borderRadius:8 }}/> : <span style={{ fontSize:26 }}>&#127942;</span>}
                <div>{editing ? <SmIn value={a.year} onChange={v=>updArr("achievements",i,{year:v})}/> : <span style={{ fontSize:11, color:C.accent }}>{a.year}</span>}</div>
                <ET value={a.title} onChange={v=>updArr("achievements",i,{title:v})} editing={editing} style={{ fontSize:14, fontWeight:600, color:C.text }}/>
                <ET value={a.desc} onChange={v=>updArr("achievements",i,{desc:v})} editing={editing} multiline style={{ fontSize:12, color:"#999", lineHeight:1.6 }}/>
              </Card>
            ))}
          </div>
          {editing && <AddBtn onClick={()=>set("achievements",[...data.achievements,{title:"New Achievement",year:"2024",desc:"Describe this achievement.",image:""}])} label="Add Achievement"/>}
        </section>

        {/* CERTIFICATES */}
        <section ref={r("certificates")} style={{ padding:"40px 0 80px" }}>
          <SectionTitle>Certificates</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:16 }}>
            {data.certificates.map((c,i)=>(
              <div key={i} style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:10, padding:"18px 20px", display:"flex", flexDirection:"column", gap:6 }}>
                {editing && <div style={{ display:"flex", justifyContent:"flex-end" }}><DelBtn onClick={()=>delArr("certificates",i)}/></div>}
                <span style={{ fontSize:22 }}>&#128220;</span>
                <ET value={c.name} onChange={v=>updArr("certificates",i,{name:v})} editing={editing} style={{ fontSize:13, fontWeight:600, color:C.text }}/>
                <ET value={c.issuer} onChange={v=>updArr("certificates",i,{issuer:v})} editing={editing} style={{ fontSize:12, color:C.accent }}/>
                <div>{editing ? <SmIn value={c.year} onChange={v=>updArr("certificates",i,{year:v})}/> : <span style={{ fontSize:11, color:C.muted }}>{c.year}</span>}</div>
              </div>
            ))}
          </div>
          {editing && <AddBtn onClick={()=>set("certificates",[...data.certificates,{name:"Certificate Name",issuer:"Issuer",year:"2024"}])} label="Add Certificate"/>}
        </section>

        {/* PUBLICATIONS */}
        <section ref={r("publications")} style={{ padding:"40px 0 80px" }}>
          <SectionTitle>Publications</SectionTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {data.publications.map((pub,i)=>(
              <Card key={i} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                <div style={{ width:34, height:34, borderRadius:8, background:"rgba(200,169,110,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:15 }}>&#128196;</div>
                <div style={{ flex:1 }}>
                  <ET value={pub.title} onChange={v=>updArr("publications",i,{title:v})} editing={editing} style={{ fontSize:14, fontWeight:600, color:C.text, display:"block", marginBottom:4 }}/>
                  <ET value={pub.venue} onChange={v=>updArr("publications",i,{venue:v})} editing={editing} style={{ fontSize:12, color:C.accent, display:"block", marginBottom:3 }}/>
                  <ET value={pub.authors} onChange={v=>updArr("publications",i,{authors:v})} editing={editing} style={{ fontSize:11, color:C.muted }}/>
                </div>
                {editing && <DelBtn onClick={()=>delArr("publications",i)}/>}
              </Card>
            ))}
          </div>
          {editing && <AddBtn onClick={()=>set("publications",[...data.publications,{title:"Publication Title",venue:"Journal / Conference, Year",authors:"Rahman, A., et al."}])} label="Add Publication"/>}
        </section>

        {/* SKILLS */}
        <section ref={r("skills")} style={{ padding:"40px 0 80px" }}>
          <SectionTitle>Technical Expertise</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
            {Object.entries(data.skills).map(([cat,items],ci)=>(
              <Card key={ci}>
                <h3 style={{ fontSize:12, color:C.accent, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12, fontWeight:600 }}>{cat}</h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {items.map((sk,si)=>(
                    <span key={si} style={{ fontSize:12, padding:"5px 10px", borderRadius:5, background:C.bg3, color:"#ccc", border:`1px solid ${C.border}` }}>
                      {editing ? <input value={sk} onChange={e=>{const ns={...data.skills};const a=[...ns[cat]];a[si]=e.target.value;ns[cat]=a;set("skills",ns);}} style={{ background:"none", border:"none", color:"#ccc", fontSize:12, fontFamily:"inherit", width:Math.max(sk.length*8,50)+"px" }}/> : sk}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section ref={r("contact")} style={{ padding:"40px 0 120px" }}>
          <SectionTitle>Contact</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
            <Card>
              <h3 style={{ fontSize:12, color:C.accent, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>Get In Touch</h3>
              {[["📧","Email","email"],["💼","LinkedIn","linkedin"],["🐦","Twitter","twitter"],["📍","Location","location"]].map(([icon,label,key])=>(
                <div key={key} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:16 }}>{icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10, color:C.muted, letterSpacing:"0.05em", marginBottom:2, textTransform:"uppercase" }}>{label}</div>
                    <ET value={data.contact[key]} onChange={v=>set(`contact.${key}`,v)} editing={editing} style={{ fontSize:13, color:"#ccc" }}/>
                  </div>
                </div>
              ))}
            </Card>
            <Card style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", gap:14 }}>
              <div style={{ fontSize:42 }}>✉️</div>
              <p style={{ fontSize:15, color:"#bbb", lineHeight:1.7, margin:0 }}>Open to collaborations, consulting, and research opportunities.</p>
              <a href={`mailto:${data.contact.email}`} style={{ padding:"11px 28px", borderRadius:6, background:C.accent, color:"#141414", textDecoration:"none", fontWeight:600, fontSize:13 }}>Send a Message</a>
            </Card>
          </div>
        </section>
      </div>

      <div style={{ borderTop:`1px solid ${C.border}`, textAlign:"center", padding:"24px", fontSize:12, color:C.muted }}>
        © {new Date().getFullYear()} {data.name} · All rights reserved
      </div>

      {editing && (
        <div style={{ position:"fixed", bottom:18, left:"50%", transform:"translateX(-50%)", background:C.accent, color:"#141414", padding:"9px 22px", borderRadius:30, fontSize:12, fontWeight:700, boxShadow:"0 4px 24px rgba(0,0,0,0.5)", zIndex:200, whiteSpace:"nowrap" }}>
          ✎ Edit Mode — all changes save automatically
        </div>
      )}
    </div>
  );
}
