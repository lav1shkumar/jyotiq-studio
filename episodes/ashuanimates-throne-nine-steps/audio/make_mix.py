import numpy as np, subprocess, os
from scipy.io import wavfile
from scipy import signal
base='episodes/ashuanimates-throne-nine-steps'
sr=48000; dur=53.8; n=int(sr*dur)
# decode narration
subprocess.run(['ffmpeg','-y','-v','error','-i',base+'/audio/narration.mp3','-ar',str(sr),'-ac','1',base+'/audio/narration.wav'],check=True)
nsr,vo=wavfile.read(base+'/audio/narration.wav')
vo=vo.astype(np.float32)/32768.0
# deterministic atmosphere
rng=np.random.default_rng(9)
t=np.arange(n)/sr
noise=rng.standard_normal(n).astype(np.float32)
b,a=signal.butter(2,180/(sr/2),'low')
room=signal.lfilter(b,a,noise)
room/=np.max(np.abs(room))+1e-9
drone=(0.11*np.sin(2*np.pi*55*t)+0.045*np.sin(2*np.pi*110*t+0.7)+0.025*np.sin(2*np.pi*164.8*t+1.4))*0.18
bed=room*0.11+drone
# temple-air high shimmer, very low
bed += 0.012*np.sin(2*np.pi*740*t)*np.sin(2*np.pi*0.09*t+1)**2
# metallic ticks
def ping(at,freq=1180,amp=0.22,decay=0.16):
    i=int(at*sr); m=min(n-i,int(decay*6*sr))
    if m<=0:return
    tt=np.arange(m)/sr
    x=np.sin(2*np.pi*freq*tt)*np.exp(-tt/decay)
    x+=0.45*np.sin(2*np.pi*freq*2.37*tt)*np.exp(-tt/(decay*0.65))
    bed[i:i+m]+=amp*x
for at,f,a in [(0.32,1420,.25),(4.15,1180,.18),(9.2,960,.12),(26.7,740,.18),(32.2,880,.15),(39.9,1180,.18),(43.1,1240,.15)]: ping(at,f,a)
# breath under the gold: shaped filtered noise around 11.3-15 sec
for start in [11.45,12.55,13.65]:
    i=int(start*sr); m=int(0.82*sr)
    tt=np.arange(m)/sr
    br=rng.standard_normal(m).astype(np.float32)
    bb,aa=signal.butter(2,[250/(sr/2),950/(sr/2)],'band')
    br=signal.lfilter(bb,aa,br); br/=np.max(np.abs(br))+1e-9
    env=np.sin(np.pi*tt/0.82)**2
    bed[i:i+m]+=0.09*br*env
# deep discovery swell 35.5-38.5
for at,freq in [(35.55,49),(36.0,73.5)]:
    i=int(at*sr); m=int(3.0*sr); tt=np.arange(m)/sr
    env=np.sin(np.pi*np.minimum(tt,3)/3)**2
    bed[i:i+m]+=0.09*np.sin(2*np.pi*freq*tt)*env
# sound drops near the eye opening: automate bed down, then return
bed_env=np.ones(n)
for x,y,v in [(34.9,35.7,1),(35.7,36.3,.18),(36.3,38.1,.3),(38.1,39.2,1)]:
    i=int(x*sr); j=int(y*sr); bed_env[i:j]=np.linspace(bed_env[i-1] if i else 1,v,j-i)
# duck continuously around narration energy
mix=np.zeros(n,dtype=np.float32)
vl=min(len(vo),n); mix[:vl]+=vo[:vl]
# voice starts immediately inside file; bed stays conservative
out=mix+bed*bed_env*0.62
# soft fade final 1.5 sec
fade=int(1.5*sr); out[-fade:]*=np.linspace(1,0,fade)
# safety limiter-ish normalization before loudnorm
peak=np.max(np.abs(out)); out=out/(peak/0.82 if peak>0.82 else 1)
wavfile.write(base+'/audio/premix.wav',sr,(out*32767).astype(np.int16))
subprocess.run(['ffmpeg','-y','-v','error','-i',base+'/audio/premix.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=10','-ar','48000','-ac','2',base+'/audio/final_mix.wav'],check=True)
print('wrote',base+'/audio/final_mix.wav')
