import { OrbitControls, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { useModelStore } from '../store/useModelStore';

interface Model3d extends GLTF {
  nodes: any;
  materials: any;
}

const View = ({url}: {url: string}) => {

  const setPreview = useModelStore(s => s.setPreview);
  const setIsPreview = useModelStore(s => s.setIsPreview);
  const isPreview = useModelStore(s => s.isPreview);
  const name = useModelStore(s => s.name);

  const gl = useThree((state) => state.gl);
  const {nodes, materials} = useGLTF(url) as unknown as Model3d;
  
  const setScreenshot = () => {
    gl.domElement.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `${name}_preview.png`);
        setIsPreview(false);
        setPreview(file);

        const path = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.setAttribute('download', `${name}_preview.png`);
        link.setAttribute('href', path);
        link.click();
      }
    }, 'image/png');
  }

  useEffect(() => {
    if (isPreview) {
      setScreenshot();
    }
  }, [isPreview]);

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