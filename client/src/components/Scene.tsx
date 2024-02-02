import { Canvas } from "@react-three/fiber";
import View from "./View";

const Scene = ({url}: {url: string}) => {
  return (
    <div className="w-[512px] h-[512px] border border-gray-600 rounded-lg" >
      <Canvas 
        camera={{position: [5, 10, 5]}}
        gl={{preserveDrawingBuffer: true}} 
      >
        <View url={url}/>
      </Canvas>
    </div>
  )
}

export default Scene;