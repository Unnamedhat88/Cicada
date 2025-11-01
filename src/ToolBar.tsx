import andGateImage from "./images/Andgate.png";
import orGateImage from "./images/OrGate.png";
import notGateImage from "./images/Notgate.png";
import NandgateImage from "./images/Nandgate.png";
import NorgateImage from "./images/Norgate.png";
import XnorgateImage from "./images/Xnorgate.png";
import XorgateImage from "./images/Xorgate.png";



type ComponentType = "andGate" | "orGate" | "input" | "output" | "notGate" | "xorGate" | "xnorGate" | "norGate" | "nandGate";
interface ToolbarProp{
    setIsToolBarOpen: (val: boolean) => void;
    isToolBarOpen: boolean;
    setDragComponent: (val: ComponentType | null) => void;
    setOffset:React.Dispatch<React.SetStateAction<number[]>>;
}
export default function ToolBar({setIsToolBarOpen, isToolBarOpen, setDragComponent,setOffset}:ToolbarProp){
    const dragFromToolbar= (e:React.DragEvent<HTMLDivElement>,componentName:ComponentType)=>{ 
        e.dataTransfer.setData("component",componentName);
        setDragComponent(componentName); 
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); 
        const deltaX=e.clientX-rect.left; 
        const deltaY=e.clientY-rect.top; 
        setOffset([deltaX,deltaY]); 
}

    

    return (<>
    <div className={` transition-all duration-500 ease-out flex h-screen items-center ${(isToolBarOpen)?"":"ml-[-33.5%] md:ml-[-14.5%] "}`} >
        {/* actuall toolbox */}
            <div className="w-[25%] relative toolbar-scroll place-items-center grid grid-cols-1 gap-6 bg-green-100 md:w-[12.5%] h-screen overflow-y-auto" >
                {/* component storage */}
                <div className="mt-4 bg-blue-100 w-30 h-30 flex relative rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"input")}>
                    <div data-type="button" className={`duration-200 relative object-contain z-20 w-20 h-32 select-none m-auto [clip-path:circle()] -translate-y-2`} style={{backgroundColor:"#FE6A6A" }}></div>
                    <div className={`absolute inset-0 object-contain z-19 w-20 h-32 select-none m-auto [clip-path:circle()] translate-y-1`} style={{backgroundColor:"#CC3A3A"}}></div>
                </div>
                <div className="bg-blue-100 w-30 h-30 flex relative rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"output")}> 
                    <div className="w-20 h-20 m-auto bg-yellow-200 flex">
                    <div className="m-auto rounded-lg border bg-white px-2 w-full py-1 mx-2"> output</div>
                    </div>          
                </div>
                {/* */}
                 <div className="bg-blue-100 w-30 h-30 flex relative items-center justify-center rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"orGate")}> 
                    {/* <img className="object-contain w-26 h-26" src={orGateImage} ></img> */}
                    orGate
                </div>
                <div className="bg-blue-100 w-30 h-30 flex relative items-center justify-center rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"notGate")}>
                    {/* <img className="object-contain w-26 h-26" src={notGateImage}></img> */}
                    notGate
                </div>
                <div className="bg-blue-100 w-30 h-30 flex relative items-center justify-center rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"andGate")}> 
                    {/* <img className="object-contain w-26 h-26" src={andGateImage}></img> */}
                    andGate
                </div>
                <div className="bg-blue-100 w-30 h-30 flex relative items-center justify-center rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"nandGate")}> 
                    {/* <img className="object-contain w-26 h-26" src={NandgateImage}></img> */}
                    nandGate
                </div>
                <div className="bg-blue-100 w-30 h-30 flex relative items-center justify-center rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"norGate")}> 
                    {/* <img className="object-contain w-26 h-26" src={NorgateImage}></img> */}
                    norGate
                </div>
                <div className="bg-blue-100 w-30 h-30 flex relative items-center justify-center rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"xnorGate")}> 
                    {/* <img className="object-contain w-26 h-26" src={XnorgateImage}></img> */}
                    xnorGate
                </div>
                <div className="bg-blue-100 w-30 h-30 flex relative items-center justify-center rounded-2xl" draggable onDragStart={(e)=> dragFromToolbar(e,"xorGate")}> 
                    {/* <img className="object-contain w-26 h-26" src={XorgateImage}></img> */}
                    xorGate
                </div>
            </div>
            {/* for the open / close button of toolbox */}
            <div className="z-10 flex items-center justify-center bg-red-100 w-[6%] md:w-[3%] h-1/4 rounded-r-2xl" onClick={()=>setIsToolBarOpen(!isToolBarOpen)}>
                <div className={`${isToolBarOpen?"rotate-180":""} h-0 w-0 border-t-[40px] 
                md:border-t-[55px] border-l-[15px] md:border-l-[25px]
                border-b-[40px] md:border-b-[55px]
                border-l-red-700 border-b-red-100 border-t-red-100` }></div>

            </div>
        </div>
        <style>{`
        .toolbar-scroll{
            -ms-overflow-style:none;
            scrollbar-width:none;
        }
        .toolbar-scroll::-webkit-scrollbar{
        display:none;
        }
       

         `}</style>
    </>
    );

}