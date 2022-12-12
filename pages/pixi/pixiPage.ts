// @ts-nocheck
import * as PIXI from 'pixi.js';
import TWEEN from "@tweenjs/tween.js";

export default class PixiPage {
  frameContainer: any = null;
  isInit = false;

  pixiApp: any = null;
  mainTextComponent: any = null;



  init(fc: any) {
    if (this.isInit) return;
    this.isInit = true;

    this.frameContainer = fc;

    this.pixiApp = new PIXI.Application({
      antialias: true,
      // transparent: false,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      //resolution: 1,
      //forceFXAA: true,
      //preserveDrawingBuffer: true,
      //forceCanvas: true
    });

    this.frameContainer.appendChild(this.pixiApp.view);
    this.pixiApp.renderer.view.style.display = "block";
    this.pixiApp.renderer.view.style.zIndex = "-1";
    this.pixiApp.renderer.backgroundColor = 0xffffff;
    this.pixiApp.renderer.resize(0, 0);

    this.mainTextComponent = new FAMainTextTextComponent();
    this.mainTextComponent.init(this);



  }
}

class FAMainTextTextComponent {
  pageInstanse: any = null;

  backGroundContainer: any = null;
  backGroundGraphics: any = null;
  textContainer: any = null;
  textArray: any = null;
  renderer: any = null;
  currentTheme: any = 0;

  backGroundUniforms = {
    resolutionX: undefined
  };


  servicesLinkContainer: any = null;
  // servicesLinkDrawer
  // servicesTextArray
  // serviceLinkLeftDesctop

  mouseBackgroundShader = `
        precision mediump float;
            
        uniform float resolutionX;
        uniform float resolutionY;
        uniform float offset;
        uniform float pointerX;
        uniform float pointerY;
        uniform float theme;
        uniform float radius;
        uniform float isMobile;
        uniform float u_time;
        uniform float wavesOpacity;
        
        #define PI 3.14159265359

        float plot(vec2 st, float pct, float wide) {
            return step(pct-wide, st.y) - step(pct + wide, st.y);
        }
        
        float plot_s(vec2 st, float pct, float wide){
            return  smoothstep( pct - wide-0.005, pct-wide, st.y) -
                    smoothstep( pct + wide, pct + wide + 0.005, st.y);
        }
        
        void main() {
            vec2 st = gl_FragCoord.xy/vec2(resolutionX, resolutionY);
            vec2 pixelCoord = gl_FragCoord.xy;
            vec2 mouseCoord = vec2(pointerX, resolutionY - pointerY);
            
            vec4 solidColor = vec4(0.969, 0.134, 0.918, 1.0);

            float gradient = (gl_FragCoord.x/resolutionX - gl_FragCoord.y/resolutionY) - offset;

            if (gradient > 1.0) gradient = 1.0;
            
            if (theme == 0.0)
                gradient = 1.0 - gradient; 

            solidColor.r = gradient;
            solidColor.g = gradient;
            solidColor.b = gradient;
            
            float dist = distance(pixelCoord, mouseCoord);
            
            // if (isMobile == 1.) {
            //     gl_FragColor = solidColor;
            //     return;
            // }
            
            if (dist < radius && isMobile == 0.) {
                if (theme == 0.0) {
                    solidColor.rgb = vec3(0.6 +  smoothstep(radius - 3., radius, dist));
                } else {
                    solidColor.rgb = vec3(0.6 * (1. - smoothstep(radius - 3., radius, dist)));
                }    
            }
            
            /*
            vec3 color1 = vec3(0.0);
            vec3 color2 = vec3(0.0);
            vec3 color3 = vec3(0.0);
            vec3 color4 = vec3(0.0);
            
            if (theme == 1.0) {
                color1 = vec3(0.324,0.028,0.192);//#540731 R=84 G=7 B=49
                color2 = vec3(0.659,0.051,0.380);//#A80D61 R=168 G=13 B=97
                color3 = vec3(1.0,0.078,0.574);//#FF1493 R=255 G=20 B=147
                color4 = vec3(0.498,1.0,0.0);//#7FFF00 R=127 G=255 B=0
            } else {
                color1 = vec3(0.165,0.329,0.0);//#2A5400 R=42 G=84 B=0
                color2 = vec3(0.329,0.659,0.0);//#54A800 R=84 G=168 B=97
                color3 = vec3(0.5,1.08,0.0);//#7FFF00 R=127 G=255 B=147
                color4 = vec3(1.0,0.078,0.574);//#FF1493 R=255 G=20 B=147
            }
            
            float fun1 = 0.;
            float fun2 = 0.;
            float fun3 = 0.;
            float fun4 = 0.;
            float fun_wide = 0.;
            float default_wide = 0.;
            
            if (isMobile == 0.0) {
                fun1 = 0.042*sin(st.x * 9.280 - u_time) + 0.384;
                fun2 = 0.026*sin(st.x * 10.008 - 1.556*u_time) + 0.356 + st.x * 0.010;
                fun3 = 0.026*sin(st.x * 12.976 - 0.596*u_time) + 0.308 + st.x * 0.026;
                fun4 = 0.026*sin(st.x * 12.976 - 0.596*u_time) + 0.284;
                fun_wide = -0.022*abs(3.860*sin(st.x * -0.640 + 1.712))+0.114;
                default_wide = 0.05;
            } else {
                fun1 = 0.022*sin(st.x * 9.280 - u_time) + 0.360;
                fun2 = 0.016*sin(st.x * 10.008 - 1.556*u_time) + 0.326 + st.x * 0.010;
                fun3 = 0.011*sin(st.x * 12.976 - 0.596*u_time) + 0.308 + st.x * 0.026;
                fun4 = 0.009*sin(st.x * 12.976 - 0.596*u_time) + 0.284;
                default_wide = 0.03;
                fun_wide = default_wide - 0.01;
            }   
            
            // solidColor.rgba = mix(solidColor.rgba, vec4(color1, wavesOpacity), plot_s(st, fun1 -0.218, 0.05));
            // solidColor.rgb = mix(solidColor.rgb, color2, plot_s(st, fun2 -0.218, 0.05));
            // solidColor.rgb = mix(solidColor.rgb, color3, plot_s(st, fun3 -0.218, 0.05));
            // solidColor.rgb = mix(solidColor.rgb, color4, plot_s(st, fun4 -0.218, fun_wide));
            
            solidColor.rgba = mix(solidColor.rgba, vec4(color1, wavesOpacity), plot_s(st, fun1 -0.218, default_wide));
            solidColor.rgba = mix(solidColor.rgba, vec4(color2, wavesOpacity), plot_s(st, fun2 -0.218, default_wide));
            solidColor.rgba = mix(solidColor.rgba, vec4(color3, wavesOpacity), plot_s(st, fun3 -0.218, default_wide));
            solidColor.rgba = mix(solidColor.rgba, vec4(color4, wavesOpacity), plot_s(st, fun4 -0.218, fun_wide));
            */
            
            gl_FragColor = solidColor;
        }`;

  mouseTextShader = `
        precision mediump float;
            
        uniform float resolutionX;
        uniform float resolutionY;
        uniform float offset;
        uniform float pointerX;
        uniform float pointerY;
        uniform float theme;
        uniform float radius;
        
        uniform sampler2D uSampler;//The image data
        varying vec2 vTextureCoord;//The coordinates of the current pixel        
            
        void main() {
            vec2 pixelCoord = gl_FragCoord.xy;
            vec2 mouseCoord = vec2(pointerX, resolutionY - pointerY);
            
            vec4 solidColor = texture2D(uSampler, vTextureCoord);
            
            float localOffset = offset;
            
            if (theme == 1.0)
                localOffset *= 0.3;
            else 
                localOffset *= 1.1;    

            float gradient = (solidColor.x/resolutionX - solidColor.y/resolutionY) - localOffset;
            
            if (theme == 1.0)
                if (gradient > 1.0) gradient = 1.0;
            
            if (theme == 0.0)
                if (gradient < 0.0) gradient = 0.0;
            
            if (theme == 0.0)
                gradient = 1.0 - gradient;           

            float dist = distance(pixelCoord, mouseCoord);

            //This is working antialiasing via alpha channel
            //if (gl_FragColor.a != 0.0) {
            //    gl_FragColor.r = gl_FragColor.a * (gl_FragColor.r - gradient) ;
            //    gl_FragColor.g = gl_FragColor.a * (gl_FragColor.g - gradient);
            //    gl_FragColor.b = gl_FragColor.a * (gl_FragColor.b - gradient);
            //}

            solidColor.r = solidColor.a * (solidColor.r - gradient) ;
            solidColor.g = solidColor.a * (solidColor.g - gradient);
            solidColor.b = solidColor.a * (solidColor.b - gradient);

            if (dist < radius - 3.) {
                solidColor.r = solidColor.a;
                solidColor.g = 0.0;
                solidColor.b = solidColor.a;
                //
                // if (solidColor.a > 0.5) {
                // solidColor.g = 0.0;
                // solidColor.rb = vec2(1.0 - smoothstep(radius - 3., radius, dist));
                // }
                //
                
                //vec3 solidColor = vec3(0., 0., 0.);
                
                // if (theme == 0.0 && gl_FragColor.r > 0.1) {
                //     float val = gl_FragColor.a + (1.0 +  smoothstep(radius - 5., radius, dist));
                //
                //     solidColor.rb = vec2(val);
                // } else {
                //     //solidColor.rb = vec2(0.6 * (1. - smoothstep(radius - 2., radius, dist)));
                // }
                
                //gl_FragColor.rgb =  solidColor;
                
                // vec3 solidColor = gl_FragColor.rgb;
                //
                // if (theme == 0.0) {
                //     solidColor.rgb = vec3(0.6 +  smoothstep(radius - 2., radius, dist));
                // } else {
                //     solidColor.rgb = vec3(0.6 * (1. - smoothstep(radius - 2., radius, dist)));
                // } 
                //
                // gl_FragColor.rgb = solidColor.rgb;
                

                //float alpha = 1.0 - smoothstep(74.0, 75.0, dist);

                //gl_FragColor.r = alpha;
                //gl_FragColor.b = alpha;

                //if (dist > 74.0)
                //    gl_FragColor.a = gl_FragColor.a / 2.0;
            }
            
            gl_FragColor = solidColor;  
        }     
  `;

  init(page:PixiPage) {
    this.pageInstanse = page;

    this.backGroundContainer = new PIXI.Container();
    this.backGroundGraphics = new PIXI.Graphics();

    this.backGroundContainer.addChild(this.backGroundGraphics);

    this.textContainer = new PIXI.Container();
    this.textArray = [];

    this.renderer = this.pageInstanse.pixiApp.renderer;

    this.textContainer.originalY = this.textContainer.y;


    this.backGroundUniforms.resolutionX = window.innerWidth;
    this.backGroundUniforms.resolutionY = window.innerHeight;
    this.backGroundUniforms.offset = 5;
    this.backGroundUniforms.pointerX = 0;
    this.backGroundUniforms.pointerY = 0;
    this.backGroundUniforms.theme = 0; //0 - white 1 - black
    this.backGroundUniforms.radius = 0;
    this.backGroundUniforms.isMobile = false;
    this.backGroundUniforms.u_time = 0;
    this.backGroundUniforms.wavesOpacity = 0.0;

    this.mouseBackgroundFilter = new PIXI.Filter('', this.mouseBackgroundShader, this.backGroundUniforms);

    this.textFilter = new PIXI.Filter('', this.mouseTextShader, this.backGroundUniforms);

    this.textContainer.scale.x = 1;
    this.textContainer.scale.y = 1;

    this.mouseBackgroundFilter.enabled = true;
    this.textFilter.enabled = true;

    //DRAW BIG BACKGROUND RECT FOR USING SHADER ON FULL SCREEN
    this.backGroundGraphics.beginFill(0xffffff)
      .drawRect(0, 0, window.innerWidth, window.innerHeight)
      .endFill();

    this.backGroundContainer.filters = [ this.mouseBackgroundFilter ];

  }
}
