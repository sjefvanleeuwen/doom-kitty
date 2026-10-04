export class ShuffleBag {
  constructor(items,random=Math.random){this.items=[...items];this.random=random;this.bag=[];this.last=undefined;}
  next(){if(!this.items.length)return undefined;if(!this.bag.length){this.bag=[...this.items];for(let i=this.bag.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}if(this.bag.length>1&&this.bag.at(-1)===this.last){[this.bag[0],this.bag[this.bag.length-1]]=[this.bag.at(-1),this.bag[0]];}}return this.last=this.bag.pop();}
}
