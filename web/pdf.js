import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
export async function buildPDF(data,fontBytes,certificate=false){
 const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);const font=await pdf.embedFont(fontBytes,{subset:true});let page=pdf.addPage([595,842]),y=780;
 function line(text,size=11,color=rgb(.2,.2,.26)){const words=String(text||'').split(/\s+/);let row='';for(const word of words){if(font.widthOfTextAtSize(row+' '+word,size)>490&&row){draw(row,size,color);row=word}else row+=(row?' ':'')+word}if(row)draw(row,size,color)}
 function draw(t,size,color){if(y<55){page=pdf.addPage([595,842]);y=785}page.drawText(t,{x:52,y,size,font,color});y-=size*1.6}
 line('BURA',16,rgb(.4,.27,.9));y-=20;
 if(certificate){line('TAMAMLAMA SERTİFİKATI',23);y-=25;line(data.name,22);y-=15;line(data.title,17);line('BURA özünütəhsil kursunun bütün yoxlama suallarını uğurla tamamladı.');y-=25;line('Sertifikat nömrəsi: '+data.certificate_id);line('Tarix: '+new Date().toLocaleDateString('az-AZ'));line('Bu sənəd BURA daxilində kurs tamamlamasını göstərir; dövlət təhsil sənədi deyil.')}else{line(data.name||'CV',25);line([data.email,data.phone,data.city].filter(Boolean).join(' • '));for(const [key,title]of [['summary','PROFİL'],['education','TƏHSİL'],['experience','TƏCRÜBƏ VƏ LAYİHƏLƏR'],['skills','BACARIQLAR']])if(data[key]){y-=18;line(title,12,rgb(.4,.27,.9));for(const p of data[key].split('\n'))line(p)}}
 return pdf.save();
}
export async function downloadPDF(data,certificate=false){
 const fontBytes=await (await fetch('/fonts/DejaVuSans.ttf')).arrayBuffer();
 const blob=new Blob([await buildPDF(data,fontBytes,certificate)],{type:'application/pdf'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=certificate?'BURA-sertifikat.pdf':'BURA-CV.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
