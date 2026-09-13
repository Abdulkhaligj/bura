// AI provayderi: OpenAI və ya DeepSeek (OpenAI-uyğun chat/completions API).
// AI_PROVIDER=openai|deepseek seçimi məcbur edir; verilməyibsə əvvəl DEEPSEEK_API_KEY, sonra OPENAI_API_KEY yoxlanılır.
export function aiConfig(env={}){
 const deepseek=()=>({provider:'deepseek',url:(env.DEEPSEEK_BASE_URL||'https://api.deepseek.com').replace(/\/$/,'')+'/chat/completions',key:env.DEEPSEEK_API_KEY,model:env.AI_MODEL||'deepseek-flash'});
 const openai=()=>({provider:'openai',url:'https://api.openai.com/v1/chat/completions',key:env.OPENAI_API_KEY,model:env.AI_MODEL||env.OPENAI_MODEL||'gpt-4.1-mini'});
 if(env.AI_PROVIDER==='openai')return env.OPENAI_API_KEY?openai():null;
 if(env.AI_PROVIDER==='deepseek')return env.DEEPSEEK_API_KEY?deepseek():null;
 return env.DEEPSEEK_API_KEY?deepseek():env.OPENAI_API_KEY?openai():null;
}

// Mətn cavabını qaytarır; xəta və ya boş cavabda null. JSON rejimində boş cavab bir dəfə təkrar soruşulur (DeepSeek bunu arabir edir).
export async function aiChat(env,{messages,maxTokens=600,temperature=.7,json=false},fetcher=fetch){
 const cfg=aiConfig(env);if(!cfg)return null;
 for(let attempt=0;attempt<(json?2:1);attempt++){
  let res;
  try{res=await fetcher(cfg.url,{method:'POST',headers:{Authorization:`Bearer ${cfg.key}`,'Content-Type':'application/json'},
   body:JSON.stringify({model:cfg.model,max_tokens:maxTokens,temperature,messages,...(json?{response_format:{type:'json_object'}}:{})})})}catch{return null}
  if(!res.ok){console.error('BURA AI',cfg.provider,res.status);return null}
  const text=(await res.json().catch(()=>null))?.choices?.[0]?.message?.content||'';
  if(text.trim())return text;
 }
 return null;
}
