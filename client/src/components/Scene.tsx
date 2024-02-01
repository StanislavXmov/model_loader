import { Canvas } from "@react-three/fiber";
import View from "./View";

const Scene = ({url}: {url: string}) => {
  return (
    <div className="w-full h-4/6">
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