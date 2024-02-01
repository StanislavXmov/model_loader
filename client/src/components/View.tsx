import { OrbitControls, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { GLTF } from 'three/examples/jsm/Addons.js';

interface Model3d extends GLTF {
  nodes: any;
  materials: any;
}

const View = ({url}: {url: string}) => {
  const gl = useThree((state) => state.gl);
  const {nodes, materials} = useGLTF(url) as unknown as Model3d;
  console.log(nodes, materials);
  
  const setScreenshot = () => {
    gl.domElement.toBlob(blob => {
      if (blob) {
        const file = new File([blob], "screenshot__.png");
        console.log(file);

        const path = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.setAttribute('download', 'canvas.png');
        link.setAttribute('href', path);
        link.click();
      }
    }, 'image/png');
  }

  useEffect(() => {
    document.addEventListener('keyup', setScreenshot);
    return () => {
      document.removeEventListener('keyup', setScreenshot);
    }
  }, []);

  return (
    <>
      <pointLight position={[10, 10, 10]} />
      <gridHelper />
      <group>
        <mesh 
          castShadow 
          receiveShadow 
          geometry={nodes['collider'].geometry} 
          material={materials[""]} 
        />
      </group>
      <OrbitControls />
    </>
  )
}

export default View;