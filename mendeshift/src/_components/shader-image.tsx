"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const vertex = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif
  uniform sampler2D artwork;
  uniform vec2 size;
  uniform vec2 coverage;
  uniform vec2 pointer;
  uniform float radius;
  uniform float pixel;
  uniform float anchor;
  uniform float reveal;

  vec2 imageUv(vec2 uv) {
    vec2 origin = vec2(anchor, 0.5);
    return (uv - origin) / coverage + origin;
  }

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 point) {
    vec2 tile = floor(point);
    vec2 f = fract(point);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(tile), hash(tile + vec2(1.0, 0.0)), f.x),
               mix(hash(tile + vec2(0.0, 1.0)), hash(tile + vec2(1.0)), f.x), f.y);
  }

  void main() {
    vec2 grid = gl_FragCoord.xy / pixel;
    vec2 cell = floor(grid);
    vec2 center = (cell + 0.5) * pixel;
    vec3 artworkColor = texture2D(artwork, imageUv(center / size)).rgb;
    float luminance = dot(artworkColor, vec3(0.299, 0.587, 0.114));
    float detail = smoothstep(0.035, 0.67, luminance);

    // A irregularidade pertence à borda da revelação, não à textura da imagem.
    float edge = noise(cell * 0.08) * 0.7 + noise(cell * 0.29) * 0.3;
    float distanceToPointer = length(center - pointer) / radius + (edge - 0.5) * 0.86;
    float mask = (1.0 - smoothstep(0.32, 1.1, distanceToPointer)) * reveal;
    float dotRadius = sqrt(detail) * (0.37 + mask * 0.34);
    float dotShape = (1.0 - smoothstep(dotRadius - 0.085, dotRadius, length(fract(grid) - 0.5)))
                   * smoothstep(0.0, 0.035, detail);
    float warm = smoothstep(0.075, 0.45, artworkColor.r - max(artworkColor.g, artworkColor.b));
    vec3 ink = mix(vec3(0.57, 0.59, 0.63), vec3(1.0, 0.32, 0.32), warm);
    float amount = dotShape * mix(0.13, 0.91, mask);
    gl_FragColor = vec4(mix(vec3(0.043, 0.047, 0.059), ink, amount), 1.0);
  }
`;

function makeShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function mountShader(
  surface: HTMLElement,
  pointerTarget: HTMLElement,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  position: number,
) {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) return;

  const vs = makeShader(gl, gl.VERTEX_SHADER, vertex);
  const fs = makeShader(gl, gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  const mesh = gl.createBuffer();
  const texture = gl.createTexture();
  const dispose = () => {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteProgram(program);
    gl.deleteBuffer(mesh);
    gl.deleteTexture(texture);
  };

  if (!vs || !fs || !program || !mesh || !texture) {
    dispose();
    return;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const size = gl.getUniformLocation(program, "size");
  const coverage = gl.getUniformLocation(program, "coverage");
  const pointer = gl.getUniformLocation(program, "pointer");
  const radius = gl.getUniformLocation(program, "radius");
  const pixel = gl.getUniformLocation(program, "pixel");
  const anchor = gl.getUniformLocation(program, "anchor");
  const reveal = gl.getUniformLocation(program, "reveal");
  gl.uniform1f(anchor, position);
  let cursor: { x: number; y: number } | undefined;
  let easedCursor: { x: number; y: number } | undefined;
  let frame = 0;
  let ready = false;
  let pointerInside = false;
  let strength = 0;
  let lastFrame = 0;

  const draw = (now: number) => {
    frame = 0;
    if (!ready || gl.isContextLost()) return;
    const { width, height, left, top } = surface.getBoundingClientRect();
    if (!width || !height) return;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    const aspect = (image.naturalWidth / image.naturalHeight) / (width / height);
    gl.uniform2f(size, w, h);
    gl.uniform2f(coverage, Math.max(aspect, 1), Math.max(1 / aspect, 1));
    const target = pointerInside ? 1 : 0;
    const delta = lastFrame ? Math.min(now - lastFrame, 48) : 16;
    strength += (target - strength) * (1 - Math.exp(-delta / 110));
    const fading = Math.abs(target - strength) > 0.008;
    if (!fading) strength = target;

    let tracking = false;
    if (cursor) {
      easedCursor ??= { ...cursor };
      const follow = 1 - Math.exp(-delta / 44);
      easedCursor.x += (cursor.x - easedCursor.x) * follow;
      easedCursor.y += (cursor.y - easedCursor.y) * follow;
      tracking = pointerInside && Math.hypot(cursor.x - easedCursor.x, cursor.y - easedCursor.y) > 0.25;
      gl.uniform2f(pointer, (easedCursor.x - left) * scale, (top + height - easedCursor.y) * scale);
    }

    const animating = fading || tracking;
    gl.uniform1f(reveal, strength);
    gl.uniform1f(radius, Math.min(w, h) * (0.22 + strength * 0.19));
    gl.uniform1f(pixel, 3.4 * scale);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    surface.dataset.shaderReady = "";
    lastFrame = animating ? now : 0;
    if (animating) frame = requestAnimationFrame(draw);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const upload = () => {
    if (!image.complete || !image.naturalWidth || gl.isContextLost()) return;
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      ready = gl.getError() === gl.NO_ERROR;
    } catch {
      ready = false;
    }
    if (!ready) delete surface.dataset.shaderReady;
    schedule();
  };

  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    cursor = { x: event.clientX, y: event.clientY };
    if (!pointerInside && strength === 0) easedCursor = { ...cursor };
    pointerInside = true;
    schedule();
  };
  const leave = () => {
    pointerInside = false;
    schedule();
  };
  const lose = () => {
    delete surface.dataset.shaderReady;
  };

  const resize = new ResizeObserver(schedule);
  resize.observe(surface);
  pointerTarget.addEventListener("pointermove", move, { passive: true });
  pointerTarget.addEventListener("pointerleave", leave);
  canvas.addEventListener("webglcontextlost", lose);
  image.addEventListener("load", upload);
  upload();

  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    pointerTarget.removeEventListener("pointermove", move);
    pointerTarget.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("webglcontextlost", lose);
    image.removeEventListener("load", upload);
    delete surface.dataset.shaderReady;
    dispose();
  };
}

export function ShaderImage({
  src,
  alt,
  sizes,
  priority,
  className,
  position = 0.5,
  trackParent = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  position?: number;
  trackParent?: boolean;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!surface || !canvas || !image) return;

    const pointerTarget = trackParent ? surface.parentElement ?? surface : surface;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference) and (any-hover: hover) and (any-pointer: fine)");
    let cleanup: (() => void) | undefined;
    const sync = () => {
      cleanup?.();
      cleanup = motion.matches ? mountShader(surface, pointerTarget, canvas, image, position) : undefined;
    };
    sync();
    motion.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      cleanup?.();
    };
  }, [src, position, trackParent]);

  return (
    <div className={className ? "shader-image " + className : "shader-image"} ref={surfaceRef}>
      <Image key={src} ref={imageRef} src={src} alt={alt} sizes={sizes} fill preload={priority} style={{ objectPosition: `${position * 100}% center` }} />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
