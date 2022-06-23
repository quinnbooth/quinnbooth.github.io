import*as e from"https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";import{GLTFLoader as Y}from"https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";const K=function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function d(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(o){if(o.ep)return;o.ep=!0;const i=d(o);fetch(o.href,i)}};K();var S=0,J=75;const c=new e.Scene,s=new e.PerspectiveCamera(J,window.innerWidth/window.innerHeight,.1,1e3),v=new e.WebGLRenderer({canvas:document.querySelector("#bg"),antialias:!0});v.setPixelRatio(window.devicePixelRatio);v.setSize(window.innerWidth,window.innerHeight);s.position.setZ(40);v.render(c,s);var A=2*Math.tan(s.fov*Math.PI/180/2)*s.position.z,Q=A*s.aspect;s.position.setZ(500);const U=new e.PointLight(16777215),T=new e.AmbientLight(16777215);T.intensity=.5;c.add(U);c.add(T);const _=new Y;new e.TextureLoader().load("images/space3.jpg");const $=new e.SphereGeometry(3,100,10,1e3),ee=new e.SphereGeometry(1,100,10,1e3),te=new e.SphereGeometry(1.3,100,10,1e3),oe=new e.SphereGeometry(1.3,100,10,1e3),ne=new e.SphereGeometry(1,100,10,1e3),re=new e.SphereGeometry(2.3,100,10,1e3),ie=new e.CircleGeometry(2.9,100,0,1e3),se=new e.SphereGeometry(2,100,10,1e3),ae=new e.CircleGeometry(3,100,0,1e3),ce=new e.SphereGeometry(1.7,100,10,1e3),le=new e.CircleGeometry(2.5,100,0,1e3),he=new e.SphereGeometry(1.6,100,10,1e3),pe=new e.CircleGeometry(2.4,100,0,1e3),de=new e.MeshBasicMaterial({color:15883266,wireframe:!1}),fe=new e.MeshStandardMaterial({color:12141824,wireframe:!1}),ue=new e.MeshStandardMaterial({color:14134077,wireframe:!1}),we=new e.MeshStandardMaterial({color:4098273,wireframe:!1}),me=new e.MeshStandardMaterial({color:12335616,wireframe:!1}),Me=new e.MeshStandardMaterial({color:14925913,wireframe:!1}),ye=new e.MeshStandardMaterial({color:15323532,wireframe:!0}),Se=new e.MeshStandardMaterial({color:15056232,wireframe:!1}),ve=new e.MeshStandardMaterial({color:13812125,wireframe:!0}),ge=new e.MeshStandardMaterial({color:11988723,wireframe:!1}),xe=new e.MeshStandardMaterial({color:13563384,wireframe:!0}),Fe=new e.MeshStandardMaterial({color:1926626,wireframe:!1}),Ce=new e.MeshStandardMaterial({color:6590943,wireframe:!0}),E=new e.Mesh($,de),Le=new e.Mesh(ee,fe),Pe=new e.Mesh(te,ue),ze=new e.Mesh(oe,we),Ae=new e.Mesh(ne,me),j=new e.Mesh(re,Me),Ge=new e.Mesh(ie,ye),I=new e.Mesh(se,Se),be=new e.Mesh(ae,ve),R=new e.Mesh(ce,ge),Ee=new e.Mesh(le,xe),B=new e.Mesh(he,Fe),je=new e.Mesh(pe,Ce);var G=0,q=[],O=[],L=[];function Ie(r,u,d,l,o,i){const n=[E,Le,Pe,ze,Ae,j,I,R,B],g=[j,I,R,B],h=[Ge,be,Ee,je];if(r==0){var P=Q;A<P&&(P=A);var k=P/20;c.add(E);for(let t=1;t<n.length;t++){c.add(n[t]);var p=2*Math.PI*Math.random();n[t].position.set(u*Math.cos(p),u*Math.sin(p),0),u+=k,o.push(.005*Math.random()),L.push(0)}for(let t=0;t<h.length;t++)c.add(h[t]),h[t].position.set(g[t].position.x,g[t].position.y,0),l.push([.005*Math.random(),.005*Math.random(),.005*Math.random()]);G=1}else if(r==1){n[0].rotation.x+=d[0],n[0].rotation.y+=d[1],n[0].rotation.z+=d[2];for(let t=1;t<n.length;t++){const f=t-1;n[t].rotation.x+=d[0],n[t].rotation.y+=d[1],n[t].rotation.z+=d[2];var b=n[t].position.x,X=n[t].position.y,z=Math.sqrt(Math.pow(b,2)+Math.pow(X,2)),p=Math.acos(b/z)*(-2*i[f]+1)+o[f];n[t].position.x=z*Math.cos(p),n[t].position.y=z*Math.sin(p),Math.abs(p-Math.PI)<o[f]?(p=Math.PI+.001,i[f]=-1*i[f]+1):Math.abs(p)<o[f]&&(p=.001,i[f]=-1*i[f]+1)}for(let t=0;t<h.length;t++)h[t].rotation.x+=l[t][0],h[t].rotation.y+=l[t][1],h[t].rotation.z+=l[t][2],h[t].position.set(g[t].position.x,g[t].position.y,0)}else{G=0;for(var De in o)o.pop(),L.pop();for(var Te in l)l.pop();q=[],O=[],L=[],c.background=new e.Color(0);for(const t of n)c.remove(t);for(const t of h)c.remove(t)}}const V=new e.BufferGeometry;var Z=new Float32Array(9e3);for(let r=0;r<9e3;r++)Z[r]=Math.random()*600-300;V.setAttribute("position",new e.BufferAttribute(Z,3));let Re=new e.TextureLoader().load("/images/star1.png"),Be=new e.PointsMaterial({color:11184810,size:.75,map:Re,transparent:!0});const M=new e.Points(V,Be);c.add(M);var x=0,m=0;function He(){s.position.z>250?(s.position.z+=x,x-=.001,m<.0012&&(m+=3e-6),M.rotation.z+=m):s.position.z>45?(s.position.z+=x,x+=.001225,m>75e-6&&(m-=3e-6),M.rotation.z+=m):M.rotation.z+=75e-6,s.rotation.x<.25&&(s.rotation.x+=2e-4),s.position.y>-15&&(s.position.y-=6/500)}const w=new e.PointLight(16777215);w.intensity=2;c.add(w);w.position.set(-2,-2,502);var a=new e.Mesh;_.load("/models/gltf/spaceship1.glb",r=>{r.scene.scale.set(.3,.3,.3),r.scene.position.set(-4.5,.3,498),r.scene.rotation.set(Math.PI/9,-1*Math.PI/7,0),a=r.scene,c.add(a)});var y=0;function H(r){r==0&&(y==100845&&(y=0),a.rotation.x=-.05*Math.sin(y/300)+Math.PI/10,console.log(y),y++)}var F=.01,C=-85e-5;const W=-143e-7,D=12e-7;function We(r){r==0?(a.position.x<-1&&(a.position.x+=F,F+=W),a.position.y>0&&(a.position.y+=C,C+=D),H(0),M.rotation.z+=75e-6):r==1&&(a.position.x<6&&(a.position.x+=F,F-=2*W),a.position.y>-.5&&(a.position.y+=C,C-=2*D),H(0),w.intensity>0&&(w.intensity=w.intensity-.004),a.position.x>=6&&a.position.y<=-.5&&(S++,c.remove(w)),M.rotation.z+=75e-6)}window.addEventListener("click",function(r){S==0&&a.position.x>=-1&&a.position.y<=0&&(S=1)});window.addEventListener("resize",function(){s.aspect=window.innerWidth/this.window.innerHeight,s.updateProjectionMatrix(),v.setSize(window.innerWidth,window.innerHeight)});function N(){requestAnimationFrame(N),Ie(G,5,[.002,.001,.003],O,q,L),We(S),S==2&&He(),v.render(c,s)}N();
