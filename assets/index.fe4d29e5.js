import*as e from"https://unpkg.com/three@0.127.0/build/three.module.js";const b=function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function p(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=p(o);fetch(o.href,r)}};b();const h=new e.Scene,g=new e.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),f=new e.WebGLRenderer({canvas:document.querySelector("#bg"),antialias:!0});f.setPixelRatio(window.devicePixelRatio);f.setSize(window.innerWidth,window.innerHeight);g.position.setZ(30);f.render(h,g);const P=new e.SphereGeometry(3,100,10,1e3),D=new e.SphereGeometry(1,100,10,1e3),j=new e.SphereGeometry(1.3,100,10,1e3),F=new e.SphereGeometry(1.3,100,10,1e3),L=new e.SphereGeometry(1,100,10,1e3),H=new e.SphereGeometry(2.3,100,10,1e3),q=new e.CircleGeometry(2.9,100,0,1e3),z=new e.SphereGeometry(2,100,10,1e3),A=new e.CircleGeometry(3,100,0,1e3),I=new e.SphereGeometry(1.7,100,10,1e3),O=new e.CircleGeometry(2.5,100,0,1e3),W=new e.SphereGeometry(1.6,100,10,1e3),k=new e.CircleGeometry(2.4,100,0,1e3),N=new e.MeshBasicMaterial({color:15883266,wireframe:!1}),T=new e.MeshBasicMaterial({color:12141824,wireframe:!1}),K=new e.MeshBasicMaterial({color:14134077,wireframe:!1}),Z=new e.MeshBasicMaterial({color:4098273,wireframe:!1}),J=new e.MeshBasicMaterial({color:12335616,wireframe:!1}),Q=new e.MeshBasicMaterial({color:14925913,wireframe:!1}),U=new e.MeshBasicMaterial({color:15323532,wireframe:!0}),V=new e.MeshBasicMaterial({color:15056232,wireframe:!1}),X=new e.MeshBasicMaterial({color:13812125,wireframe:!0}),Y=new e.MeshBasicMaterial({color:11988723,wireframe:!1}),_=new e.MeshBasicMaterial({color:13563384,wireframe:!0}),$=new e.MeshBasicMaterial({color:1926626,wireframe:!1}),ee=new e.MeshBasicMaterial({color:6590943,wireframe:!0}),x=new e.Mesh(P,N),ne=new e.Mesh(D,T),oe=new e.Mesh(j,K),re=new e.Mesh(F,Z),te=new e.Mesh(L,J),C=new e.Mesh(H,Q),se=new e.Mesh(q,U),v=new e.Mesh(z,V),ie=new e.Mesh(A,X),B=new e.Mesh(I,Y),ae=new e.Mesh(O,_),G=new e.Mesh(W,$),ce=new e.Mesh(k,ee);var d=window.innerWidth;window.innerHeight<d&&(d=window.innerHeight);const le=d/250;var y=0,he=[],ue=[],we=[];function fe(m,u,p,a,o,r,s){const t=[x,ne,oe,re,te,C,v,B,G],w=[C,v,B,G],c=[se,ie,ae,ce];if(m==0){const n=new e.TextureLoader().load("images/space3.jpg");h.background=n,h.add(x);for(let i=1;i<t.length;i++){h.add(t[i]);var l=2*Math.PI*Math.random();t[i].position.set(u*Math.cos(l),u*Math.sin(l),0),u+=p,r.push(.005*Math.random()),s.push(0)}for(let i=0;i<c.length;i++)h.add(c[i]),c[i].position.set(w[i].position.x,w[i].position.y,0),o.push([.005*Math.random(),.005*Math.random(),.005*Math.random()]);y=1}else if(m==1){t[0].rotation.x+=a[0],t[0].rotation.y+=a[1],t[0].rotation.z+=a[2];for(let n=1;n<t.length;n++){t[n].rotation.x+=a[0],t[n].rotation.y+=a[1],t[n].rotation.z+=a[2];var S=t[n].position.x,R=t[n].position.y,M=Math.sqrt(Math.pow(S,2)+Math.pow(R,2)),l=Math.acos(S/M)*(-2*s[n]+1)+r[n];t[n].position.x=M*Math.cos(l),t[n].position.y=M*Math.sin(l),Math.abs(l-Math.PI)<r[n]?(l=Math.PI+.001,s[n]=-1*s[n]+1):Math.abs(l)<r[n]&&(l=.001,s[n]=-1*s[n]+1)}for(let n=0;n<c.length;n++)c[n].rotation.x+=o[n][0],c[n].rotation.y+=o[n][1],c[n].rotation.z+=o[n][2],c[n].position.set(w[n].position.x,w[n].position.y,0)}else{y=0,r=[],o=[],s=[],h.background=new e.Color(0);for(const n of t)h.remove(n);for(const n of c)h.remove(n)}}function E(){requestAnimationFrame(E),fe(y,5,le,[.002,.001,.003],ue,he,we),f.render(h,g)}E();
