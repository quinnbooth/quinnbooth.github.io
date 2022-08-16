import*as e from"https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";import{GLTFLoader as de}from"https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";import{OrbitControls as me}from"https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";const we=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))l(i);new MutationObserver(i=>{for(const c of i)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&l(d)}).observe(document,{childList:!0,subtree:!0});function a(i){const c={};return i.integrity&&(c.integrity=i.integrity),i.referrerpolicy&&(c.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?c.credentials="include":i.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function l(i){if(i.ep)return;i.ep=!0;const c=a(i);fetch(i.href,c)}};we();let g=0,W=1,Me=75;const f=new e.Scene,s=new e.PerspectiveCamera(Me,window.innerWidth/window.innerHeight,.1,1e3),v=new e.WebGLRenderer({canvas:document.querySelector("#bg"),antialias:!0});v.setPixelRatio(window.devicePixelRatio);v.setSize(window.innerWidth,window.innerHeight);v.shadowMap.enabled=!0;v.render(f,s);s.position.setZ(40);let O=2*Math.tan(s.fov*Math.PI/180/2)*s.position.z,ye=O*s.aspect;s.position.setZ(500);let ge=new e.Clock;const xe=new e.PointLight(16777215),ie=new e.AmbientLight(16777215);ie.intensity=.5;f.add(xe);f.add(ie);const re=new de,Se=new e.FontLoader,G=new me(s,v.domElement);G.enabled=!1;const q=new e.Vector2,Q=new e.Raycaster,ve=new e.SphereGeometry(3,100,10,1e3),Fe=new e.SphereGeometry(1,100,10,1e3),be=new e.SphereGeometry(1.3,100,10,1e3),Ce=new e.SphereGeometry(1.3,100,10,1e3),Pe=new e.SphereGeometry(1,100,10,1e3),ze=new e.SphereGeometry(2.3,100,10,1e3),Ae=new e.CircleGeometry(2.9,100,0,1e3),Le=new e.SphereGeometry(2,100,10,1e3),Ee=new e.CircleGeometry(3,100,0,1e3),Ge=new e.SphereGeometry(1.7,100,10,1e3),Ve=new e.CircleGeometry(2.5,100,0,1e3),je=new e.SphereGeometry(1.6,100,10,1e3),Ie=new e.CircleGeometry(2.4,100,0,1e3),Be=new e.MeshBasicMaterial({color:15883266,wireframe:!1}),Re=new e.MeshStandardMaterial({color:12141824,wireframe:!1}),ke=new e.MeshStandardMaterial({color:14134077,wireframe:!1}),De=new e.MeshStandardMaterial({color:4098273,wireframe:!1}),He=new e.MeshStandardMaterial({color:12335616,wireframe:!1}),Te=new e.MeshStandardMaterial({color:14925913,wireframe:!1}),We=new e.MeshStandardMaterial({color:15323532,wireframe:!0}),Oe=new e.MeshStandardMaterial({color:15056232,wireframe:!1}),qe=new e.MeshStandardMaterial({color:13812125,wireframe:!0}),Xe=new e.MeshStandardMaterial({color:11988723,wireframe:!1}),Ze=new e.MeshStandardMaterial({color:13563384,wireframe:!0}),Ne=new e.MeshStandardMaterial({color:1926626,wireframe:!1}),Ye=new e.MeshStandardMaterial({color:6590943,wireframe:!0}),Z=new e.Mesh(ve,Be),N=new e.Mesh(Fe,Re),Y=new e.Mesh(be,ke),K=new e.Mesh(Ce,De),_=new e.Mesh(Pe,He),I=new e.Mesh(ze,Te),Ke=new e.Mesh(Ae,We),B=new e.Mesh(Le,Oe),_e=new e.Mesh(Ee,qe),R=new e.Mesh(Ge,Xe),Je=new e.Mesh(Ve,Ze),k=new e.Mesh(je,Ne),Qe=new e.Mesh(Ie,Ye);var X=0,ae=[],se=[],V=[];const h=[Z,N,Y,K,_,I,B,R,k];function Ue(t,r,a,l,i,c){const d=[I,B,R,k],p=[Ke,_e,Je,Qe];if(t==0){var D=ye;O<D&&(D=O);var fe=D/20;f.add(Z);for(let o=1;o<h.length;o++){f.add(h[o]);var m=2*Math.PI*Math.random();h[o].position.set(r*Math.cos(m),r*Math.sin(m),0),r+=fe,i.push(.005*Math.random()),V.push(0)}for(let o=0;o<p.length;o++)f.add(p[o]),p[o].position.set(d[o].position.x,d[o].position.y,0),l.push([.005*Math.random(),.005*Math.random(),.005*Math.random()]);X=1}else if(t==1){h[0].rotation.x+=a[0],h[0].rotation.y+=a[1],h[0].rotation.z+=a[2];for(let o=1;o<h.length;o++){const M=o-1;h[o].rotation.x+=a[0],h[o].rotation.y+=a[1],h[o].rotation.z+=a[2];var J=h[o].position.x,ue=h[o].position.y,H=Math.sqrt(Math.pow(J,2)+Math.pow(ue,2)),m=Math.acos(J/H)*(-2*c[M]+1)+i[M];h[o].position.x=H*Math.cos(m),h[o].position.y=H*Math.sin(m),Math.abs(m-Math.PI)<i[M]?(m=Math.PI+.001,c[M]=-1*c[M]+1):Math.abs(m)<i[M]&&(m=.001,c[M]=-1*c[M]+1)}for(let o=0;o<p.length;o++)p[o].rotation.x+=l[o][0],p[o].rotation.y+=l[o][1],p[o].rotation.z+=l[o][2],p[o].position.set(d[o].position.x,d[o].position.y,0)}else{X=0;for(var lt in i)i.pop(),V.pop();for(var ct in l)l.pop();ae=[],se=[],V=[],f.background=new e.Color(0);for(const o of h)f.remove(o);for(const o of p)f.remove(o)}}const le=new e.BufferGeometry;var ce=new Float32Array(9e3);for(let t=0;t<9e3;t++)ce[t]=Math.random()*600-300;le.setAttribute("position",new e.BufferAttribute(ce,3));let $e=new e.TextureLoader().load("/images/star1.png"),et=new e.PointsMaterial({color:11184810,size:.75,map:$e,transparent:!0});const C=new e.Points(le,et);f.add(C);var U=!0,A=0,F=0;function tt(){s.position.z>250?(s.position.z+=A,A-=.001,F<.0012&&(F+=3e-6),C.rotation.z+=F):s.position.z>45?(s.position.z+=A,A+=.001225,F>75e-6&&(F-=3e-6),C.rotation.z+=F):(C.rotation.z+=75e-6,U&&(f.remove(x),U=!1,z=1,g++)),s.rotation.x<.25&&(s.rotation.x+=2e-4),s.position.y>-15&&(s.position.y-=6/500)}const S=new e.PointLight(16777215);S.intensity=2;f.add(S);S.position.set(-2,-2,502);var n=new e.Mesh;re.load("/models/gltf/spaceship1.glb",t=>{t.scene.scale.set(.3,.3,.3),t.scene.position.set(-4.5,.3,498),t.scene.rotation.set(Math.PI/9,-1*Math.PI/7,0),n=t.scene,f.add(n)});var w=0;function $(t){t==0?(w==100845&&(w=0),n.rotation.x=-.05*Math.sin(w/300)+Math.PI/10,w++):(w==100845&&(w=0),n.rotation.x=.5*Math.sin(w/300)+3*Math.PI/2,n.rotation.z=-.25*Math.sin(w/200)+Math.PI,w++)}var L=.01,E=-85e-5;const ee=-143e-7,te=12e-7;function ot(t){t==0?(n.position.x<-1&&(n.position.x+=L,L+=ee),n.position.y>0&&(n.position.y+=E,E+=te),n.position.x>=-1&&n.position.y<=0&&b&&b.play(),$(0),C.rotation.z+=75e-6):t==1&&(n.position.x<6&&(n.position.x+=L,L-=2*ee),n.position.y>-.5&&(n.position.y+=E,E-=2*te),$(0),S.intensity>0&&(S.intensity=S.intensity-.004),n.position.x>=6&&n.position.y<=-.5&&(g++,f.remove(S)),C.rotation.z+=75e-6)}let pe,y=0,T=new e.Vector3(0,0,0),P=.1,oe=5e-4,nt=new e.Vector3(1e-4,0,0);function it(t,r){if(r==0)T=new e.Vector3(-.1,0,0),y++;else if(r==1)n.position.x>25?n.position.add(T):y++,T.add(nt);else if(t){if(r==2){let a=new e.Vector3().copy(t.position).sub(n.position).normalize();a.z=0;let l=1;n.position.x<t.position.x&&(l=-1);let i=new e.Vector3(0,l,0),c=l*Math.PI/2,d=Math.acos(a.dot(i)/(a.length()*i.length()));n.rotation.y=d+c,n.rotation.z=0,n.rotation.x=Math.PI/2;let p=new e.Vector3;p.copy(t.position),p.sub(n.position),p.normalize(),p.multiplyScalar(-P),P+=oe,p.z=0,n.position.sub(p),p.copy(t.position),p.sub(n.position).lengthSq()<15&&(P+=10*oe,y=3)}else if(r==3){t==N?window.location.href="./about.html":t==Y?window.location.href="./academics.html":t==K?window.location.href="./work.html":t==_?window.location.href="./research.html":t==I?window.location.href="./projects.html":t==B?window.location.href="./goals.html":t==R?window.location.href="./recommendations.html":t==k&&(window.location.href="./contacts.html");let a=new e.Vector3;a.copy(t.position),a.sub(n.position),a.normalize(),a.multiplyScalar(-P),a.z=0,n.position.sub(a)}}}let j,x,b;re.load("/models/gltf/typingtext1.glb",t=>{x=t.scene,x.scale.set(.25,.01,.25),x.position.set(0,.65,499),x.rotation.set(90,0,0),f.add(x),j=new e.AnimationMixer(x),t.animations.forEach(r=>{b=j.clipAction(r),b.setLoop(e.LoopOnce),b.clampWhenFinished=!0,b.enable=!0})});var z=0;let rt=`Scroll to zoom
Drag to rotate
Click Sun to pause planets
Click planet to expore contents`,u=new e.Mesh;Se.load("/models/fonts/Cairo_Bold.json",t=>{const r=new e.TextGeometry(rt,{font:t,size:1.25,height:.1});u=new e.Mesh(r,[new e.MeshPhongMaterial({color:16777215,transparent:!0}),new e.MeshPhongMaterial({color:3355443,transparent:!0})]),u.position.set(-40,-15,0),u.material[0].opacity=0,u.material[1].opacity=0,f.add(u)});function at(t){u&&u.material[0]&&u.material[1]&&(t==1?u.material[0].opacity<1&&u.material[1].opacity<1?(u.material[0].opacity+=.002,u.material[1].opacity+=.002):z++:t==3&&(u.material[0].opacity<=0&&u.material[1].opacity<=0||(u.material[0].opacity-=.001,u.material[1].opacity-=.001)),u.lookAt(s.position.x,s.position.y,s.position.z))}window.addEventListener("click",function(t){if(g==0&&n.position.x>=-1&&n.position.y<=0)g=1;else if(g==3){let r;(r=st())?r.name=="sun"?W=!W:(y==1?y++:y==3&&y--,P=.1,pe=r):z==2&&z++}});window.addEventListener("mousemove",function(t){q.x=t.clientX/this.innerWidth*2-1,q.y=(t.clientY/this.innerHeight*2-1)*-1});window.addEventListener("resize",function(){s.aspect=window.innerWidth/this.window.innerHeight,s.updateProjectionMatrix(),v.setSize(window.innerWidth,window.innerHeight)});Z.name="sun";N.name="mercury";Y.name="venus";K.name="earth";_.name="mars";I.name="jupiter";B.name="saturn";R.name="uranus";k.name="neptune";function ne(t){let r=0,a=new e.Vector3;return a.copy(t.position),r=a.sub(s.position).length(),r}function st(){let t=[];Q.setFromCamera(q,s);const r=Q.intersectObjects(f.children);if(r.length>0)for(let l=0;l<r.length;l++)for(let i=0;i<h.length;i++)r[l].object.name==h[i].name&&t.push(h[i]);let a=t[0];if(t.length>1)for(let l=1;l<t.length;l++)ne(t[l])<ne(a)&&(a=t[l]);return a}function he(){requestAnimationFrame(he);var t=ge.getDelta();j&&j.update(t),W&&Ue(X,5,[.002,.001,.003],se,ae,V),n&&ot(g),g==2&&tt(),g==3&&(G.enabled==!1&&(n.position.set(75,-15,3),n.rotation.x=Math.PI/2,n.rotation.y=Math.PI),G.enabled=!0,at(z),it(pe,y)),G.update(),v.render(f,s)}he();
