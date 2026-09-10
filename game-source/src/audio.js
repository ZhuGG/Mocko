export class SoftAudio{
 constructor(){this.enabled=false;this.context=null;this.master=null;this.last=0;}
 async toggle(){this.enabled=!this.enabled;if(this.enabled){this.context??=new(window.AudioContext||window.webkitAudioContext)();if(!this.master){this.master=this.context.createGain();this.master.gain.value=.2;this.master.connect(this.context.destination);}await this.context.resume();this.note(392,1,.15);}else await this.context?.suspend();return this.enabled;}
 note(f,d=.4,v=.1,delay=0){if(!this.enabled)return;const c=this.context,o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;o.frequency.value=f;g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(this.master);o.start(t);o.stop(t+d+.05);}
 chime(){[392,494,587].forEach((f,i)=>this.note(f,.65,.15,i*.13));}
 tick(time,night){if(!this.enabled||time-this.last<13)return;this.last=time;const f=[196,246.94,293.66,329.63][Math.floor(time/13)%4];this.note(f,3,.06);this.note(f*1.5,2.6,.025,.4);if(!night){this.note(1700,.12,.025,1.5);this.note(2200,.14,.025,1.7);}}
}
