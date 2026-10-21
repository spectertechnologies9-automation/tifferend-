import sys,glob,os
from PIL import Image
# usage: stitch.py outpath W H cols rows id1 id2 ... (row-major)
out,W,H,cols,rows=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5])
ids=sys.argv[6:]
assert len(ids)==cols*rows,(len(ids),cols*rows)
d='/root/.claude/projects/-home-claude/a08575f4-1b76-59ab-8d11-717fd713b149/tool-results/'
canvas=Image.new('RGB',(W,H))
i=0
for r in range(rows):
  for c in range(cols):
    f=glob.glob(d+'*-'+ids[i]+'.*')[0]; i+=1
    canvas.paste(Image.open(f).convert('RGB'),(c*770,r*570))
canvas=canvas.crop((0,0,W,H))
ext=os.path.splitext(out)[1]
if ext=='.webp': canvas.save(out,'WEBP',quality=84,method=6)
elif ext=='.jpg': canvas.save(out,'JPEG',quality=86,optimize=True,progressive=True)
else: canvas.save(out)
print(os.path.basename(out),canvas.size,os.path.getsize(out)//1024,'KB')
