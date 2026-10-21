import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import pizzaTop from './assets/the-sol.jpg';

export default function PizzaScene() {
  const mountRef = useRef(null);
  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#100b08');
    scene.fog = new THREE.FogExp2('#100b08', 0.045);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 5.1, 10.7);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#ffe4bd', 1.7));
    const key = new THREE.PointLight('#ff8a31', 125, 22); key.position.set(3.5, 4.5, 4); scene.add(key);
    const fill = new THREE.PointLight('#fff0c9', 80, 18); fill.position.set(-4, 3, 1); scene.add(fill);
    const oven = new THREE.PointLight('#ff4a12', 100, 12); oven.position.set(0, -1.5, -3); scene.add(oven);

    const pizza = new THREE.Group(); scene.add(pizza);
    const crustMat = new THREE.MeshStandardMaterial({ color: '#d99a4d', roughness: 0.82, metalness: 0.0 });
    const crustDark = new THREE.MeshStandardMaterial({ color: '#9b4a20', roughness: 0.86 });
    const sauceMat = new THREE.MeshStandardMaterial({ color: '#a82d1c', roughness: 0.7 });
    const cheeseMat = new THREE.MeshStandardMaterial({ color: '#f5dca0', roughness: 0.58 });
    const dough = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.06, 0.34, 96), crustMat); dough.position.y = 0; pizza.add(dough);
    const side = new THREE.Mesh(new THREE.CylinderGeometry(1.96, 1.98, 0.22, 96), crustDark); side.position.y = 0.17; pizza.add(side);
    const sauce = new THREE.Mesh(new THREE.CylinderGeometry(1.84, 1.84, 0.055, 96), sauceMat); sauce.position.y = 0.29; pizza.add(sauce);
    const cheese = new THREE.Mesh(new THREE.CircleGeometry(1.79, 96), cheeseMat); cheese.rotation.x = -Math.PI/2; cheese.position.y = 0.326; pizza.add(cheese);
    const loader = new THREE.TextureLoader();
    loader.load(pizzaTop, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const photo = new THREE.Mesh(new THREE.CircleGeometry(1.75, 96), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.96 }));
      photo.rotation.x = -Math.PI/2; photo.position.y = 0.34; pizza.add(photo);
    });
    // A toasted, irregular crust ring catches the oven light.
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.12, 16, 100), new THREE.MeshStandardMaterial({ color: '#eab76c', roughness: 0.75 }));
    ring.rotation.x = Math.PI/2; ring.position.y = 0.28; pizza.add(ring);

    // Photographic texture remains the centrepiece; these physical toppings give it depth and motion.
    const toppingMat = new THREE.MeshStandardMaterial({ color: '#a82b1e', roughness: 0.7 });
    const basilMat = new THREE.MeshStandardMaterial({ color: '#397a35', roughness: 0.72, side: THREE.DoubleSide });
    const toppingGroup = new THREE.Group(); pizza.add(toppingGroup);
    const toppingPositions = [[-.75,.65],[-.15,.9],[.55,.78],[.95,.18],[.48,-.35],[-.28,-.55],[-.95,-.2],[.1,.1],[.85,-.78],[-.55,.95]];
    const pepperoni = [];
    toppingPositions.forEach(([x,z],i)=>{
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(.19,.2,.045,32), toppingMat);
      disc.position.set(x,.38,z); disc.rotation.x = (Math.random()-.5)*.14; disc.rotation.z = (Math.random()-.5)*.12;
      toppingGroup.add(disc); pepperoni.push({mesh:disc,x,z,phase:i*0.7});
    });
    const basil = [];
    [[-.9,.45],[.2,-.8],[.75,.5],[-.1,.5]].forEach(([x,z],i)=>{
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(.15,16,10), basilMat); leaf.scale.set(1.5,.18,.65); leaf.position.set(x,.405,z); leaf.rotation.y=i*1.8; toppingGroup.add(leaf); basil.push(leaf);
    });

    const ingredientGroup = new THREE.Group(); scene.add(ingredientGroup);
    const falling = [];
    for (let i=0;i<15;i++) {
      const isLeaf = i%3===0;
      const mesh = isLeaf
        ? new THREE.Mesh(new THREE.SphereGeometry(.13,12,8), basilMat)
        : new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.035,24), new THREE.MeshStandardMaterial({color: i%2 ? '#b73524':'#e6c994', roughness:.65}));
      if (isLeaf) mesh.scale.set(1.5,.18,.65);
      mesh.position.set((Math.random()-.5)*5, 2.5+Math.random()*4, (Math.random()-.5)*2.8);
      ingredientGroup.add(mesh); falling.push({mesh,seed:Math.random()*Math.PI*2, targetX:(Math.random()-.5)*2.7,targetZ:(Math.random()-.5)*2.7});
    }

    // Glowing oven halo and ember particles fill the whole screen behind the content.
    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.65,.045,12,120), new THREE.MeshBasicMaterial({color:'#ff6a22',transparent:true,opacity:.42}));
    halo.position.set(.15,-.15,-2.7); halo.rotation.x=.12; scene.add(halo);
    const emberGeo = new THREE.BufferGeometry();
    const emberCount=190, positions=new Float32Array(emberCount*3), emberSpeeds=[];
    for(let i=0;i<emberCount;i++){positions[i*3]=(Math.random()-.5)*13;positions[i*3+1]=(Math.random()-.5)*9;positions[i*3+2]=-1-Math.random()*5;emberSpeeds.push(.15+Math.random()*.65);}
    emberGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const embers = new THREE.Points(emberGeo,new THREE.PointsMaterial({color:'#ff9a45',size:.035,transparent:true,opacity:.75,depthWrite:false}));scene.add(embers);

    let scrollProgress=0, targetScroll=0, pointerX=0, pointerY=0, frame=0;
    const updateScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);targetScroll=window.scrollY/max;};
    const onPointer=(e)=>{pointerX=(e.clientX/window.innerWidth-.5);pointerY=(e.clientY/window.innerHeight-.5);};
    window.addEventListener('scroll',updateScroll,{passive:true}); window.addEventListener('resize',resize); window.addEventListener('pointermove',onPointer,{passive:true}); updateScroll();
    function resize(){if(!host) return; camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);}
    const clock=new THREE.Clock();
    function animate(){
      frame=requestAnimationFrame(animate); const t=clock.getElapsedTime(); scrollProgress += (targetScroll-scrollProgress)*.045;
      // Full-screen pizza follows the scroll story: raw -> toppings falling -> golden cooked pizza.
      const cook=Math.min(1,Math.max(0,(scrollProgress-.12)/.68));
      pizza.rotation.y=t*.13+scrollProgress*2.3+pointerX*.14;
      pizza.rotation.x=-.25+Math.sin(t*.35)*.025+scrollProgress*.18+pointerY*.05;
      pizza.scale.setScalar(1.02+Math.sin(t*.8)*.012+scrollProgress*.09);
      pizza.position.x=1.45+Math.sin(t*.2)*.13-scrollProgress*.8+pointerX*.28;
      pizza.position.y=-.35+Math.sin(t*.6)*.08-scrollProgress*1.25;
      pizza.position.z=-.3+scrollProgress*.25;
      oven.intensity=85+Math.sin(t*3)*16+Math.max(0,cook)*28;
      halo.material.opacity=.22+Math.sin(t*2)*.06+cook*.22;
      // Ingredients start high, drift toward the pizza as you scroll, then settle into the topping layer.
      falling.forEach((o,i)=>{
        const phase=(t*.17+o.seed/6+scrollProgress*1.8)%1;
        const landing=THREE.MathUtils.smoothstep(scrollProgress,.18,.62);
        const yStart=3.2+Math.sin(o.seed)*.7;
        o.mesh.position.x=THREE.MathUtils.lerp((o.targetX*1.5)+Math.sin(t*.7+o.seed)*.45,o.targetX,landing);
        o.mesh.position.z=THREE.MathUtils.lerp((o.targetZ*1.4)+Math.cos(t*.6+o.seed)*.3,o.targetZ,landing);
        o.mesh.position.y=THREE.MathUtils.lerp(yStart+Math.sin(t*1.4+o.seed)*.4,.43,landing);
        o.mesh.rotation.x=t*.6+o.seed; o.mesh.rotation.z=t*.8+o.seed;
        o.mesh.visible=scrollProgress<.76 || o.mesh.position.y>.47;
      });
      pepperoni.forEach((o,i)=>{o.mesh.position.y=.38+Math.max(0,cook)*.012; o.mesh.scale.setScalar(1+Math.max(0,cook)*.04);});
      basil.forEach((o,i)=>{o.rotation.y+=.003;});
      const arr=emberGeo.attributes.position.array;
      for(let i=0;i<emberCount;i++){arr[i*3+1]+=emberSpeeds[i]*.009;if(arr[i*3+1]>5){arr[i*3+1]=-4.5;arr[i*3]=(Math.random()-.5)*13;}}
      emberGeo.attributes.position.needsUpdate=true;
      camera.position.x+=(pointerX*.32-camera.position.x*.025)*.04;
      camera.lookAt(.1,-.1,0); renderer.render(scene,camera);
    }
    animate();
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',updateScroll);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',onPointer);renderer.dispose();host.removeChild(renderer.domElement);};
  },[]);
  return <div className="pizza-scene" ref={mountRef} aria-hidden="true" />;
}
