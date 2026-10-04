import './scss/main.scss';
import './style.css';
import './player/animations';
import {MagazineAudioPlayer,GlobalMiniPlayer} from './player/audio-component';
import {audioService} from './player/audio-service';
import {initDynamicTheming} from './player/color-thief';
import {ShuffleBag} from './shuffle.mjs';

interface Media{src:string;title:string;type:'audio'|'video'}
class OpeningFilms{
private videos=Array.from(document.querySelectorAll<HTMLVideoElement>('.video-stage video'));private bag:ShuffleBag;private active=0;private prepared=false;private switching=false;private paused=true;private failed=new Set<string>();
constructor(clips:Media[]){this.bag=new ShuffleBag(clips.map(c=>c.src));const button=document.querySelector<HTMLButtonElement>('#motion')!;button.addEventListener('click',()=>{this.paused=!this.paused;this.updateButton();if(this.paused)this.videos.forEach(v=>v.pause());else this.videos[this.active].play().catch(()=>{this.paused=true;this.updateButton();});});this.updateButton();if(!clips.length){document.querySelector<HTMLElement>('.empty-note')!.hidden=false;button.hidden=true;return;}const first=this.videos[0];first.src=this.bag.next()!;first.loop=clips.length===1;first.classList.add('active');if(!this.paused)first.play().catch(()=>{this.paused=true;this.updateButton();});if(clips.length>1){this.prepare();for(const video of this.videos){video.addEventListener('timeupdate',()=>{if(video===this.videos[this.active]&&Number.isFinite(video.duration)&&video.duration-video.currentTime<.85)void this.advance();});video.addEventListener('ended',()=>{if(video===this.videos[this.active])void this.advance();});video.addEventListener('error',()=>{this.failed.add(video.getAttribute('src')||'');if(this.failed.size>=clips.length){document.querySelector('#film-status')!.textContent='Opening films unavailable';return;}if(video===this.videos[this.active])void this.advance();else this.prepare();});}}}
public start(){this.paused=false;this.updateButton();void this.videos[this.active].play().catch(()=>{});}
private updateButton(){const button=document.querySelector<HTMLButtonElement>('#motion')!;button.textContent=this.paused?'Play visuals ▷':'Pause visuals Ⅱ';button.setAttribute('aria-pressed',String(this.paused));}
private prepare(){const next=this.videos[1-this.active];this.prepared=false;let src=this.bag.next();for(let i=0;i<this.failed.size&&src&&this.failed.has(src);i++)src=this.bag.next();if(!src||this.failed.has(src))return;next.src=src;next.load();const ready=()=>{this.prepared=true;if(this.videos[this.active].ended)void this.advance();};if(next.readyState>=2)ready();else next.addEventListener('loadeddata',ready,{once:true});}
private async advance(){if(this.switching||!this.prepared||this.paused)return;this.switching=true;const old=this.videos[this.active],next=this.videos[1-this.active];try{next.currentTime=0;await next.play();if(this.paused){next.pause();return;}next.classList.add('active');old.classList.remove('active');await new Promise(resolve=>setTimeout(resolve,750));old.pause();this.active=1-this.active;this.prepare();}catch{this.paused=true;this.updateButton();}finally{this.switching=false;}}
}
let song:string|undefined;
const title='Tikki-Tik, Likkie-Likkie';

const gate=document.querySelector<HTMLDialogElement>('#entry-gate')!;
gate.showModal();
const enter=document.querySelector<HTMLButtonElement>('#enter')!;
enter.disabled=true;enter.textContent='LOADING…';
let opening:OpeningFilms|undefined;
async function prepareMedia(){
 try{
 const response=await fetch('./media-manifest.json');if(!response.ok)throw Error('Media manifest unavailable');
 const media:Media[]=await response.json();
 const audio=media.filter(m=>m.type==='audio'&&/\.mp3$/i.test(m.src));
 song=(audio.find(m=>/tikk|likk/i.test(m.src))||audio[0])?.src;
 document.querySelectorAll('m-audio-player').forEach(player=>{if(song)player.setAttribute('src',song);else player.removeAttribute('src');});
 customElements.define('m-audio-player',MagazineAudioPlayer);customElements.define('m-global-mini-player',GlobalMiniPlayer);
 const homePlayer=document.querySelector('m-audio-player')!;
 const bg=homePlayer.querySelector('.hero-image')!;
 const stage=document.createElement('div');stage.className='video-stage';stage.innerHTML='<video muted playsinline preload="auto"></video><video muted playsinline preload="auto"></video>';bg.prepend(stage);
 opening=new OpeningFilms(media.filter(m=>m.type==='video'));
 enter.textContent=song?'ENTER WITH SOUND ↗':'ENTER ↗';
 if(!song)document.querySelector('#entry-gate small')!.textContent='The music file is not available yet.';
 }catch{enter.textContent='ENTER ↗';document.querySelector('#entry-gate small')!.textContent='Media could not be loaded. Please refresh to retry.';}
 finally{enter.disabled=false;}
}
void prepareMedia();
const error=document.querySelector('#playback-status')!;
audioService.audio.loop=true;
audioService.on('error',()=>{error.textContent='Audio could not be loaded. Use the player to retry.';});
audioService.on('playblocked',()=>{error.textContent='Press play to start the music.';});
document.querySelector('#enter')!.addEventListener('click',()=>{const playback=song?audioService.play(song,title,'Doom Kitty'):Promise.resolve();gate.close();document.body.classList.remove('awaiting-entry');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)opening?.start();playback.catch(()=>{error.textContent='Press play to start the music.';});});
function route(){const path=location.hash.replace(/^#\/?/,'')||'home';const view=path==='music/tikki-tik'?'song':path==='music'?'music':path==='about'?'about':'home';document.querySelectorAll<HTMLElement>('[data-view]').forEach(el=>{el.hidden=el.dataset.view!==view;});document.querySelectorAll('m-nav a').forEach(a=>{a.classList.toggle('active',a.getAttribute('href')===location.hash||(!location.hash&&a.getAttribute('href')==='#/'));});window.scrollTo(0,0);initDynamicTheming();document.dispatchEvent(new CustomEvent('page-loaded',{detail:{path:view}}));}
window.addEventListener('hashchange',route);route();
