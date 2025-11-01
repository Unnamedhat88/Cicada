export class Components {
    public id : string;
    private state: boolean;
    private source: Components | null;
    private focused: boolean;
  
    public constructor(id:string) {
      this.id=id
      this.state = false;
      this.source= null;
      this.focused=false;
    }
  
    public getState(): boolean  {
      return this.state;
    }
    public getSource(): Components | null  {
      return this.source;
    }
    public setState( b : boolean ): void  {
      this.state=b;
    }
    public setSource( c : Components ): void  {
      this.source=c;
    }
    public setFocused(b:boolean):void{
      this.focused=b;
    }
    public getFocused():boolean{
      return this.focused
    }
  }