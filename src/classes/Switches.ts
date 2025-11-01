import { Components } from "./Components";

export class Switches extends Components{
    private name : String;

    public constructor( id : string, s : string) {
      super(id)
      this.name=s;
    }

    public setName( s : String ): void  {
      this.name=s;
    }
    public getName(): String  {
      return this.name;
    }
    public toggle(): void {
      super.setState(!super.getState());
    }

}