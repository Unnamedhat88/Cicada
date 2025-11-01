import { useState, useEffect } from "react";
export const useTrackMousePosition=():[number,number]=>{
  const [mousePosition, setMousePosition]=useState<[number, number]>([0,0]);

  useEffect(()=>{
    const updateMousePosition= (ev:MouseEvent) =>{
      setMousePosition([ev.clientX,ev.clientY]);

    };
    window.addEventListener("mousemove",updateMousePosition);

    return ()=>{
      window.removeEventListener("mousemove",updateMousePosition);
    }
  },[])
  return mousePosition;
}
