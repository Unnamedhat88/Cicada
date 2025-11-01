import { Components } from "./Components";
  //==========================================
  export abstract class Gates extends Components{
    private alternateSource : Components | null;

    public constructor(id: string) {
      super(id)
      this.alternateSource=null;
    }
    public setAlternateSource( c : Components ): void  {
      this.alternateSource=c;
    }
    public getAlternateSource(): Components | null {
      return this.alternateSource;
    }
    abstract calculateState(): void;

}
  //=========================================
  export class andGate extends Gates{
   
    public constructor(id: string) {
      super(id)
    }
    public calculateState(): void{
      this.setState(this.getSource().getState() && this.getAlternateSource().getState());
    }

}
  //=========================================
  export class orGate extends Gates{
   
    public constructor(id: string) {
      super(id)
    }
    public calculateState(): void{
      this.setState(this.getSource().getState() || this.getAlternateSource().getState());
    }

}
//=========================================
export class xorGate extends Gates{
   
  public constructor(id: string) {
    super(id)
  }
  public calculateState(): void{
    this.setState(this.getSource().getState() != this.getAlternateSource().getState());
  }

}
//=========================================
export class xnorGate extends Gates{
   
  public constructor(id: string) {
    super(id)
  }
  public calculateState(): void{
    this.setState(this.getSource().getState() == this.getAlternateSource().getState());
  }

}
//=========================================
export class norGate extends Gates{
   
  public constructor(id: string) {
    super(id)
  }
  public calculateState(): void{
    this.setState(!(this.getSource().getState() || this.getAlternateSource().getState()));
  }

}
//=========================================
export class nandGate extends Gates{
   
  public constructor(id: string) {
    super(id)
  }
  public calculateState(): void{
    this.setState(!(this.getSource().getState() && this.getAlternateSource().getState()));
  }

}
//=========================================
export class notGate extends Gates{
  public constructor(id:string){
    super(id);
    
  
  }
  public calculateState(): void {
    this.setState(!this.getSource()?.getState());
  }
  
}