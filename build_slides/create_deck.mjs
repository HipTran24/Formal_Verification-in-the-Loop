import fs from 'node:fs/promises';
import { Presentation, PresentationFile } from 'file:///C:/Users/aaa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const OUT = 'C:/Users/aaa/Pictures/SaveCode/Formal_Verification-in-the-Loop';
const W = 1280, H = 720;
const C = {
  ink: '#14233B', muted: '#52647A', bg: '#F7F9FC', white: '#FFFFFF',
  blue: '#2563EB', blueLight: '#E8F0FF', teal: '#0F8B8D', tealLight: '#E3F5F3',
  amber: '#C47A11', amberLight: '#FFF2D9', red: '#B54747', redLight: '#FBEAEA',
  line: '#D8E0EA', green: '#23805A', greenLight: '#E4F4EC',
};
const FONT = 'Arial';
const p = Presentation.create({ slideSize: { width: W, height: H } });

function shape(slide, geom, x, y, w, h, fill='none', stroke='none', sw=0, name='') {
  return slide.shapes.add({ geometry: geom, name, position: {left:x,top:y,width:w,height:h}, fill, line:{style:'solid',fill:stroke,width:sw} });
}
function txt(slide, text, x, y, w, h, size=24, color=C.ink, bold=false, opts={}) {
  const s=shape(slide,'textbox',x,y,w,h,'none','none',0,opts.name||''); s.text=text;
  s.text.style={fontSize:size,typeface:FONT,color,bold,alignment:opts.align||'left',verticalAlignment:opts.valign||'middle',wrap:'square',autoFit:'shrinkText',insets:opts.inset??0,lineSpacing:opts.lineSpacing||1.0};
  return s;
}
function rect(slide,x,y,w,h,fill,stroke='none',sw=0,r=14,name='') { return slide.shapes.add({geometry:r?'roundRect':'rect',name,position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:stroke,width:sw},borderRadius:r}); }
function base(title, n, kicker='NCKH SINH VIÊN 2026') {
  const s=p.slides.add(); s.background.fill=C.bg;
  rect(s,0,0,12,H,C.blue,'none',0,0);
  txt(s,kicker,62,34,500,22,13,C.blue,true);
  txt(s,title,62,70,1156,54,34,C.ink,true);
  shape(s,'line',62,137,1156,0,'none',C.line,1);
  txt(s,`${String(n).padStart(2,'0')}  /  07`,1110,676,108,20,13,C.muted,true,{align:'right'});
  return s;
}
function note(s, content){ s.speakerNotes.text=content; }
function pill(s,text,x,y,w,fill,color){rect(s,x,y,w,32,fill,'none',0,16);txt(s,text,x+10,y+1,w-20,30,14,color,true,{align:'center'});}

// 1 — cover
{
 const s=p.slides.add(); s.background.fill=C.ink;
 rect(s,0,0,14,H,C.teal,'none',0,0);
 txt(s,'NGHIÊN CỨU KHOA HỌC SINH VIÊN 2026',72,58,760,28,16,'#8CC8FF',true);
 txt(s,'Nghiên cứu khung sinh mã nguồn\nvà tự sửa lỗi tự động loại bỏ ảo giác\ndựa trên kiểm định logic hình thức',72,132,1050,206,36,C.white,true,{lineSpacing:1.03});
 txt(s,'Formal Verification-in-the-Loop',74,354,860,40,24,'#A9D8E8',false);
 shape(s,'line',74,420,500,0,'none','#496078',1);
 txt(s,'GV hướng dẫn',74,446,170,24,15,'#9FB2C6',false);
 txt(s,'ThS. Bùi Phú Khuyên',74,475,420,32,22,C.white,true);
 txt(s,'Nguyễn Võ Lê Khoa  ·  Trần Thanh Hiệp\nNguyễn Thành Nhất Nam  ·  Trần Đức Huy',74,541,700,62,18,'#DCE6F0',false,{lineSpacing:1.2});
 pill(s,'THUYẾT TRÌNH: NGUYỄN VÕ LÊ KHOA',824,612,370,'#203854','#A9D8E8');
 note(s,'Thời lượng: 20 giây.\nEm là Nguyễn Võ Lê Khoa, đại diện nhóm. Nhóm xin trình bày đề tài về khung sinh mã và tự sửa lỗi có vòng kiểm chứng hình thức. GV hướng dẫn là ThS. Bùi Phú Khuyên.');
}
// 2 — problem
{
 const s=base('Vấn đề nghiên cứu',2);
 txt(s,'Mã do LLM sinh có thể chạy qua một số ca thử nhưng vẫn vi phạm yêu cầu ở trường hợp khác.',62,164,1135,62,25,C.ink,true);
 rect(s,62,260,500,264,C.white,C.line,1,16);
 txt(s,'KIỂM THỬ MẪU',92,286,420,30,17,C.blue,true);
 txt(s,'Kiểm tra các đầu vào đã chọn',92,335,420,34,22,C.ink,true);
 txt(s,'Có ích để phát hiện lỗi, nhưng không bao phủ hết mọi trường hợp đầu vào.',92,388,410,82,19,C.muted,false,{lineSpacing:1.15});
 rect(s,590,260,628,264,C.tealLight,'#B8DFD9',1,16);
 txt(s,'KIỂM CHỨNG THEO ĐẶC TẢ',620,286,540,30,17,C.teal,true);
 txt(s,'Dafny tạo nghĩa vụ chứng minh',620,335,540,34,22,C.ink,true);
 txt(s,'Nếu verifier xác nhận, mã thỏa các điều kiện đã đặc tả trong phạm vi mô hình và giả định của Dafny.',620,388,530,82,19,C.muted,false,{lineSpacing:1.15});
 txt(s,'Ví dụ: kiểm thử chọn vài đầu vào; đặc tả có thể nêu tính chất với mọi chỉ số hợp lệ.',62,530,1120,24,16,C.muted,false);
 pill(s,'ĐẶC TẢ ĐÚNG VÀ ĐỦ LÀ GIẢ ĐỊNH TRỌNG YẾU',62,564,590,C.amberLight,C.amber);
 txt(s,'Xác minh theo đặc tả không tự chứng minh đặc tả phản ánh đầy đủ ý định người dùng.',62,614,1050,36,18,C.muted,false);
 note(s,'Thời lượng: 40 giây.\nLLM có thể tạo mã nhìn hợp lý nhưng sai logic ở đầu vào chưa thử. Unit test kiểm tra các đầu vào cụ thể; đặc tả Dafny có thể nêu tính chất tổng quát, chẳng hạn mọi chỉ số hợp lệ. Dafny xác minh nghĩa vụ suy ra từ đặc tả, trong phạm vi mô hình và giả định công cụ. Điều này vẫn phụ thuộc vào việc đặc tả có đúng và đủ hay không.');
}
// 3 — objective
{
 const s=base('Mục tiêu và câu hỏi nghiên cứu',3);
 txt(s,'Mục tiêu',62,172,270,32,18,C.blue,true);
 txt(s,'Đánh giá liệu phản hồi từ Dafny/Z3 có giúp tăng tỷ lệ mã Dafny do LLM sinh được xác minh hay không.',62,213,1110,80,30,C.ink,true,{lineSpacing:1.05});
 shape(s,'line',62,331,1156,0,'none',C.line,1);
 txt(s,'Câu hỏi chính',62,351,300,30,18,C.teal,true);
 txt(s,'Với cùng mô hình, tập bài và ngân sách tối đa K lượt, vòng lặp kiểm chứng có cải thiện Pass@K so với sinh một lần không?',62,391,1090,74,25,C.ink,false,{lineSpacing:1.1});
 shape(s,'line',62,484,1156,0,'none',C.line,1);
 txt(s,'Nhóm sẽ đo ba khía cạnh',62,505,380,28,17,C.muted,true);
 pill(s,'TỶ LỆ XÁC MINH',62,548,240,C.blueLight,C.blue);
 pill(s,'SỐ LƯỢT SỬA',330,548,230,C.tealLight,C.teal);
 pill(s,'THỜI GIAN / THẤT BẠI',590,548,300,C.amberLight,C.amber);
 txt(s,'Giả thuyết cần kiểm tra, chưa phải kết luận.',62,610,1000,28,17,C.blue,true);
 note(s,'Thời lượng: 35 giây.\nMục tiêu là đánh giá tác động của phản hồi verifier, không tuyên bố đã giải quyết hoàn toàn hallucination. Câu hỏi chính là liệu vòng phản hồi có tăng Pass@K khi giữ cố định mô hình, tập bài và ngân sách hay không. Nhóm cũng theo dõi số lượt sửa, thời gian và nguyên nhân thất bại.');
}
// 4 — method pipeline editable
{
 const s=base('Phương pháp: vòng sinh và kiểm chứng',4);
 const nodes=[];
 const boxes=[
  {x:62,w:190,title:'1 · ĐẶC TẢ',body:'Đề bài +\nrequires / ensures',fill:C.blueLight,edge:'#BED2FF',color:C.blue},
  {x:290,w:190,title:'2 · PHÂN TÍCH',body:'Topology gợi ý\ncấu trúc bài toán',fill:'#EEF2FA',edge:'#D3DCE9',color:C.ink},
  {x:518,w:190,title:'3 · LLM SINH',body:'Tạo ứng viên\nDafny',fill:'#EEF2FA',edge:'#D3DCE9',color:C.ink},
  {x:746,w:190,title:'4 · HẬU XỬ LÝ',body:'Chuẩn hóa cú pháp\nSpecLocker kiểm tra',fill:C.amberLight,edge:'#EAD29E',color:C.amber},
  {x:974,w:244,title:'5 · DAFNY + Z3',body:'Xác minh theo\nđặc tả',fill:C.tealLight,edge:'#B8DFD9',color:C.teal},
 ];
 for(const b of boxes){
   const sh=rect(s,b.x,255,b.w,132,b.fill,b.edge,1,14);
   txt(s,b.title,b.x+15,272,b.w-30,24,15,b.color,true,{align:'center'});
   txt(s,b.body,b.x+14,312,b.w-28,58,19,C.ink,true,{align:'center',lineSpacing:1.08}); nodes.push(sh);
 }
 for(let i=0;i<nodes.length-1;i++) s.shapes.connect(nodes[i],nodes[i+1],{kind:'straight',fromSide:'right',toSide:'left',line:{style:'solid',fill:C.blue,width:2},tail:{type:'arrow',width:'med',length:'med'}});
 rect(s,398,463,570,94,C.white,C.line,1,14);
 txt(s,'NẾU CHƯA XÁC MINH',420,477,526,24,15,C.amber,true,{align:'center'});
 txt(s,'Diagnostic Parser gửi lỗi cho LLM sửa; lặp tối đa K lượt.',420,510,526,30,17,C.ink,true,{align:'center'});
 const fail=shape(s,'ellipse',1084,433,16,16,C.red,'none',0);
 s.shapes.connect(nodes[4],fail,{kind:'straight',fromSide:'bottom',toSide:'top',line:{style:'solid',fill:C.amber,width:2},tail:{type:'arrow',width:'sm',length:'sm'}});
 s.shapes.connect(fail,nodes[2],{kind:'elbow',fromSide:'left',toSide:'bottom',line:{style:'solid',fill:C.amber,width:2},tail:{type:'arrow',width:'sm',length:'sm'}});
 txt(s,'Verified nghĩa là Dafny xác minh ứng viên theo đặc tả gốc; không xác nhận đặc tả đã đầy đủ.',62,604,1150,34,17,C.muted,true);
 note(s,'Thời lượng: 60 giây.\nĐầu tiên, nhóm lấy đặc tả gốc và nhận diện dạng bài để gợi ý cấu trúc. LLM sinh mã Dafny. Hệ thống chuẩn hóa cú pháp và SpecLocker kiểm tra rằng đặc tả gốc không bị thay đổi. Sau đó Dafny/Z3 xác minh ứng viên. Nếu đạt, báo Verified theo đặc tả. Nếu chưa đạt, Diagnostic Parser phân loại lỗi rồi gửi phản hồi cho lượt sửa tiếp theo, tối đa K lượt. Pipeline có nhánh trích xuất phản ví dụ, nhưng không phải lỗi nào cũng có phản ví dụ; phần đó cần được đo riêng.');
}
// 5 — preliminary internal comparison
{
 const s=base('Kết quả sơ bộ: baseline và pipeline đầy đủ',5);
 txt(s,'Một lần chạy đối chứng · 15/10/2026 14:34 · Qwen2.5-Coder-7B · cùng bộ 30 bài · K tối đa = 3',62,157,1156,28,16,C.muted,true);
 txt(s,'CẤU HÌNH',78,214,160,22,15,C.muted,true);
 txt(s,'Pass@1',248,214,250,22,15,C.muted,true);
 txt(s,'Pass@3',530,214,250,22,15,C.muted,true);
 txt(s,'Baseline nội bộ',78,250,210,28,20,C.ink,true);
 txt(s,'Clover-style · đối chứng',78,280,210,32,14,C.muted,false);
 const barX=248, barW=250;
 rect(s,barX,254,barW,20,'#E6EBF2','none',0,5); rect(s,barX,254,barW*0.167,20,C.blue,'none',0,5);
 txt(s,'5/30 · 16,7%',barX,279,barW,22,15,C.ink,true);
 rect(s,530,254,barW,20,'#E6EBF2','none',0,5); rect(s,530,254,barW*0.20,20,C.teal,'none',0,5);
 txt(s,'6/30 · 20,0%',530,279,barW,22,15,C.ink,true);
 shape(s,'line',78,326,700,0,'none',C.line,1);
 txt(s,'Pipeline đầy đủ',78,354,210,28,20,C.ink,true);
 txt(s,'Các module đang bật',78,384,210,32,14,C.muted,false);
 rect(s,barX,358,barW,20,'#E6EBF2','none',0,5); rect(s,barX,358,barW*0.933,20,C.blue,'none',0,5);
 txt(s,'28/30 · 93,3%',barX,383,barW,22,15,C.ink,true);
 rect(s,530,358,barW,20,'#E6EBF2','none',0,5); rect(s,530,358,barW*0.967,20,C.teal,'none',0,5);
 txt(s,'29/30 · 96,7%',530,383,barW,22,15,C.ink,true);
 txt(s,'Tỉ lệ bài được Dafny xác minh',248,423,532,22,14,C.muted,false);
 rect(s,832,214,386,278,'#F0F3F8','#D8E0EA',1,14);
 txt(s,'CHÊNH LỆCH GIỮA HAI CẤU HÌNH',854,232,345,24,14,C.blue,true);
 txt(s,'+76,6 điểm %',854,271,340,36,27,C.blue,true);
 txt(s,'Pass@1  ·  +76,7 điểm % Pass@3',854,310,340,24,15,C.ink,true);
 shape(s,'line',854,348,337,0,'none',C.line,1);
 txt(s,'Tác động riêng của lượt sửa',854,366,340,22,15,C.muted,true);
 txt(s,'Trong pipeline đầy đủ, lượt 2 cứu thêm 1/30 bài: 031-is-prime. Pass@1 lên Pass@3 tăng 3,3 điểm %. ',854,396,330,78,16,C.ink,false,{lineSpacing:1.08});
 txt(s,'So sánh cấu hình chưa tách riêng tác động từng module.',78,470,710,24,14,C.muted,false);
 txt(s,'Ảnh tùy chọn: log hai lượt của 031-is-prime để minh họa.',78,528,1120,26,15,C.amber,true);
 txt(s,'Một lần chạy sơ bộ; chưa đủ cơ sở khái quát hóa kết quả.',78,563,1120,24,14,C.muted,false);
 note(s,'Thời lượng: 55 giây.\nĐây là số liệu của một lần chạy đối chứng ngày 15 tháng 10 lúc 14:34 trên cùng bộ 30 bài, cùng mô hình Qwen2.5-Coder-7B và tối đa ba lượt. Baseline nội bộ đạt 5/30 ở Pass@1 và 6/30 ở Pass@3; pipeline đầy đủ đạt tương ứng 28/30 và 29/30. Chênh lệch giữa hai cấu hình là 76,6 và 76,7 điểm phần trăm. Không diễn giải mức tăng này là kết quả của riêng hai vòng sửa: trong pipeline đầy đủ, lượt sửa chỉ cứu thêm một bài, 031-is-prime, làm Pass@1 tăng từ 93,3% lên Pass@3 96,7%. Đây là một lần chạy sơ bộ; chưa đủ cơ sở khái quát hóa hoặc quy tác động cho từng module. Baseline được gọi là baseline nội bộ Clover-style, không khẳng định tái lập chính xác phương pháp Clover gốc. Có thể bổ sung ảnh log thật của hai lượt 031-is-prime nếu cần minh họa.');
}
// 6 — plan
{
 const s=base('Kế hoạch triển khai nghiên cứu',6);
 const phases=[
  {n:'01',x:62,title:'CHỐT TẬP BÀI',body:'Manifest + nguồn\nRà soát đặc tả\nChốt bài được tính',fill:C.blueLight,c:C.blue},
  {n:'02',x:350,title:'CHẠY SO SÁNH',body:'Sinh một lần\nFeedback Dafny\nPipeline đầy đủ',fill:C.tealLight,c:C.teal},
  {n:'03',x:638,title:'ĐO VÀ PHÂN TÍCH',body:'Pass@1 / Pass@K\nThời gian / token\nPhân loại lỗi',fill:C.amberLight,c:C.amber},
  {n:'04',x:926,title:'TÁI LẬP, BÁO CÁO',body:'Lưu log đầy đủ\nKiểm tra kết quả\nDemo và báo cáo',fill:C.greenLight,c:C.green},
 ];
 for(const ph of phases){
   rect(s,ph.x,222,240,224,ph.fill,'none',0,14);
   txt(s,ph.n,ph.x+18,252,46,40,28,ph.c,true);
   txt(s,ph.title,ph.x+18,304,205,28,15,ph.c,true);
   txt(s,ph.body,ph.x+18,346,205,80,17,C.ink,true,{lineSpacing:1.15});
 }
 for(let i=0;i<phases.length-1;i++) shape(s,'line',phases[i].x+240,334,48,0,'none',C.line,2);
 rect(s,62,483,1156,100,C.white,C.line,1,14);
 txt(s,'ĐIỀU KIỆN SO SÁNH CÔNG BẰNG',84,498,360,24,15,C.muted,true);
 txt(s,'Cùng tập benchmark',84,541,300,28,16,C.ink,true);
 txt(s,'Cùng model và prompt',440,541,330,28,16,C.ink,true);
 txt(s,'Cùng K và timeout',828,541,300,28,16,C.ink,true);
 txt(s,'Kết quả dự kiến: prototype, benchmark có manifest, dữ liệu/log và báo cáo thực nghiệm.',62,614,1150,30,16,C.blue,true);
 note(s,'Thời lượng: 55 giây.\nGiai đoạn một chốt manifest, nguồn, đặc tả và mẫu số. Giai đoạn hai chạy ba cấu hình: sinh một lần, sửa theo thông báo lỗi Dafny, và pipeline đầy đủ. So sánh phải giữ cùng tập bài, mô hình, prompt cơ sở, K và timeout. Giai đoạn ba phân tích Pass@1, Pass@K, thời gian, token và loại lỗi. Cuối cùng lưu log để tái lập và viết báo cáo.');
}
// 7 — outputs, limits, discussion
{
 const s=base('Kết quả dự kiến và giới hạn',7);
 txt(s,'Đầu ra dự kiến',62,166,365,30,18,C.blue,true);
 const outs=[
  ['Prototype','Pipeline sinh mã và kiểm chứng Dafny/Z3'],
  ['Benchmark tái lập','Manifest, nguồn, đặc tả và cấu hình chạy'],
  ['Báo cáo NCKH','So sánh, phân tích lỗi và giới hạn'],
  ['Bản thảo bài báo','Mục tiêu nếu phù hợp thời hạn / quy định'],
 ];
 outs.forEach((o,i)=>{const y=210+i*78;shape(s,'ellipse',68,y+4,18,18,C.teal,'none',0);txt(s,o[0],102,y,320,27,18,C.ink,true);txt(s,o[1],102,y+31,500,32,15,C.muted,false);});
 rect(s,690,165,528,280,C.amberLight,'#EAD29E',1,14);
 txt(s,'GIỚI HẠN CẦN NÊU',718,188,470,28,16,C.amber,true);
 txt(s,'• Đặc tả có thể chưa bao quát ý định\n• 30 bài là một tập nhỏ, một lần chạy\n• Chưa kiểm tra ngôn ngữ triển khai khác\n• Verified chỉ áp dụng cho mã và đặc tả Dafny',718,236,462,170,17,C.ink,false,{lineSpacing:1.25});
 rect(s,62,548,1156,58,C.ink,'none',0,14);
 txt(s,'Xin góp ý: tập benchmark  |  baseline  |  tiêu chí nghiệm thu',90,557,1095,40,20,C.white,true,{align:'center'});
 txt(s,'Cảm ơn Thầy/Cô',62,624,1156,30,18,C.teal,true,{align:'center'});
 note(s,'Thời lượng: 35 giây.\nĐầu ra gồm prototype, benchmark có manifest, dữ liệu và log, cùng báo cáo NCKH. Bản thảo bài báo là mục tiêu nếu phù hợp thời hạn và quy định. Giới hạn hiện tại là tập bài nhỏ, một lần chạy, và kết quả phụ thuộc độ đúng đủ của đặc tả. Nhóm xin góp ý về benchmark, baseline và tiêu chí nghiệm thu. Em xin cảm ơn Thầy Cô.');
}

await fs.mkdir(`${OUT}/build_slides/rendered`,{recursive:true});
for(let i=0;i<p.slides.items.length;i++){
 const blob=await p.export({slide:p.slides.items[i],format:'png',scale:1});
 await fs.writeFile(`${OUT}/build_slides/rendered/slide-${String(i+1).padStart(2,'0')}.png`,new Uint8Array(await blob.arrayBuffer()));
}
const pptx=await PresentationFile.exportPptx(p);
await pptx.save(`${OUT}/build_slides/draft.pptx`);
console.log(`created ${p.slides.items.length} slides`);
