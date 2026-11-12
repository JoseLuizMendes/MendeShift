"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef } from "react";

const vertex = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentInputs = `
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
`;

const fragment = `${fragmentInputs}
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
    float amount = dotShape * mix(0.21, 0.91, mask);
    gl_FragColor = vec4(mix(vec3(0.043, 0.047, 0.059), ink, amount), 1.0);
  }
`;

const wardrobeFragment = `${fragmentInputs}
  uniform vec2 wake;

  void main() {
    vec2 point = gl_FragCoord.xy;
    vec2 uv = imageUv(point / size);
    // Fade into the sweater at the neck so the face always comes from the base photograph.
    float neckline = mix(0.61, 0.52, smoothstep(0.045, 0.14, abs(uv.x - 0.67)));
    float garment = smoothstep(neckline - 0.015, neckline + 0.035, 1.0 - uv.y)
                  * smoothstep(0.40, 0.48, uv.x) * (1.0 - smoothstep(0.88, 0.96, uv.x));

    vec2 trail = wake - pointer;
    trail *= min(1.0, radius * 0.88 / max(length(trail), 1.0));
    float along = clamp(dot(point - pointer, trail) / max(dot(trail, trail), 1.0), 0.0, 1.0);
    vec2 center = pointer + trail * along;
    vec2 grain = point / pixel;
    float edge = noise(grain * 0.115) * 0.72 + noise(grain * 0.36) * 0.28;
    float distanceToEdge = length(point - center) / (radius * mix(1.0, 0.62, along))
                         + (edge - 0.5) * 0.64;
    float fill = 1.0 - smoothstep(0.60, 1.03, distanceToEdge);
    float rim = smoothstep(0.62, 0.93, distanceToEdge) * (1.0 - smoothstep(0.93, 1.16, distanceToEdge));
    float dots = 1.0 - smoothstep(0.09, 0.24, length(fract(grain) - 0.5));
    vec3 outfit = texture2D(artwork, uv).rgb;
    vec3 ink = vec3(1.0, 0.28, 0.31);
    gl_FragColor = vec4(mix(outfit, ink, rim * dots * 0.75), max(fill, rim * dots * 0.56) * reveal * garment);
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
  touchEnabled: boolean,
  wardrobe?: HTMLImageElement,
) {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) return;

  const vs = makeShader(gl, gl.VERTEX_SHADER, vertex);
  const fs = makeShader(gl, gl.FRAGMENT_SHADER, wardrobe ? wardrobeFragment : fragment);
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
  const wake = gl.getUniformLocation(program, "wake");
  const radius = gl.getUniformLocation(program, "radius");
  const pixel = gl.getUniformLocation(program, "pixel");
  const anchor = gl.getUniformLocation(program, "anchor");
  const reveal = gl.getUniformLocation(program, "reveal");
  gl.uniform1f(anchor, position);
  let cursor: { x: number; y: number } | undefined;
  let easedCursor: { x: number; y: number } | undefined;
  let trailingCursor: { x: number; y: number } | undefined;
  let frame = 0;
  let ready = false;
  let pointerInside = false;
  let strength = 0;
  let lastFrame = 0;
  let touchStart: { id: number; x: number; y: number } | undefined;
  let touchTimer: number | undefined;

  const draw = (now: number) => {
    frame = 0;
    if (!ready || gl.isContextLost()) return;
    const { width, height, left, top } = surface.getBoundingClientRect();
    if (!width || !height) return;
    const scale = Math.min(window.devicePixelRatio || 1, wardrobe ? 2 : 1.5);
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
      if (wardrobe) {
        trailingCursor ??= { ...easedCursor };
        const drift = 1 - Math.exp(-delta / 110);
        trailingCursor.x += (easedCursor.x - trailingCursor.x) * drift;
        trailingCursor.y += (easedCursor.y - trailingCursor.y) * drift;
        tracking ||= pointerInside && Math.hypot(easedCursor.x - trailingCursor.x, easedCursor.y - trailingCursor.y) > 0.25;
        gl.uniform2f(wake, (trailingCursor.x - left) * scale, (top + height - trailingCursor.y) * scale);
      }
    }

    const animating = fading || tracking;
    gl.uniform1f(reveal, strength);
    gl.uniform1f(radius, wardrobe ? Math.min(w, h) * 0.20 : Math.min(w, h) * (0.22 + strength * 0.19));
    gl.uniform1f(pixel, (wardrobe ? 4.8 : 3.4) * scale);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    surface.dataset.shaderReady = "";
    if (touchEnabled) surface.dataset.shaderTouch = "";
    if (!animating && strength === 0) delete surface.dataset.shaderTouchActive;
    lastFrame = animating ? now : 0;
    if (animating) frame = requestAnimationFrame(draw);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const upload = () => {
    const artwork = wardrobe ?? image;
    if (!image.complete || !image.naturalWidth || !artwork.complete || !artwork.naturalWidth || gl.isContextLost()) return;
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, artwork);
      ready = gl.getError() === gl.NO_ERROR;
    } catch {
      ready = false;
    }
    if (!ready) delete surface.dataset.shaderReady;
    schedule();
  };

  const revealAt = (event: PointerEvent) => {
    cursor = { x: event.clientX, y: event.clientY };
    if (!pointerInside && strength === 0) {
      easedCursor = { ...cursor };
      trailingCursor = undefined;
    }
    pointerInside = true;
    schedule();
  };

  const endReveal = () => {
    pointerInside = false;
    schedule();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    window.clearTimeout(touchTimer);
    revealAt(event);
  };
  const leave = (event: PointerEvent) => {
    if (event.pointerType !== "touch") endReveal();
  };
  const startTouch = (event: PointerEvent) => {
    if (event.pointerType !== "touch" || !event.isPrimary || !ready) return;
    if (event.target instanceof Element && event.target.closest("a, button, input, select, textarea, label, summary")) return;
    const { left, right, top, bottom } = surface.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) return;
    touchStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const cancelTouch = (event: PointerEvent) => {
    if (touchStart?.id === event.pointerId) touchStart = undefined;
  };
  const finishTouch = (event: PointerEvent) => {
    if (touchStart?.id !== event.pointerId) return;
    const moved = Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y);
    touchStart = undefined;
    if (moved > 10) return;

    window.clearTimeout(touchTimer);
    surface.dataset.shaderTouchActive = "";
    revealAt(event);
    touchTimer = window.setTimeout(endReveal, 900);
  };
  const lose = () => {
    ready = false;
    delete surface.dataset.shaderReady;
    delete surface.dataset.shaderTouch;
    delete surface.dataset.shaderTouchActive;
  };

  const resize = new ResizeObserver(schedule);
  resize.observe(surface);
  pointerTarget.addEventListener("pointermove", move, { passive: true });
  pointerTarget.addEventListener("pointerleave", leave);
  if (touchEnabled) {
    pointerTarget.addEventListener("pointerdown", startTouch, { passive: true });
    pointerTarget.addEventListener("pointerup", finishTouch, { passive: true });
    pointerTarget.addEventListener("pointercancel", cancelTouch, { passive: true });
  }
  canvas.addEventListener("webglcontextlost", lose);
  image.addEventListener("load", upload);
  wardrobe?.addEventListener("load", upload);
  upload();

  return () => {
    cancelAnimationFrame(frame);
    window.clearTimeout(touchTimer);
    resize.disconnect();
    pointerTarget.removeEventListener("pointermove", move);
    pointerTarget.removeEventListener("pointerleave", leave);
    pointerTarget.removeEventListener("pointerdown", startTouch);
    pointerTarget.removeEventListener("pointerup", finishTouch);
    pointerTarget.removeEventListener("pointercancel", cancelTouch);
    canvas.removeEventListener("webglcontextlost", lose);
    image.removeEventListener("load", upload);
    wardrobe?.removeEventListener("load", upload);
    lose();
    dispose();
  };
}

export function ShaderImage({
  src,
  alt,
  sizes,
  priority,
  loading,
  className,
  position = 0.5,
  trackParent = false,
  wardrobeSrc,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  className?: string;
  position?: number;
  trackParent?: boolean;
  wardrobeSrc?: string;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imagePosition = { objectPosition: `${position * 100}% center` };

  useEffect(() => {
    const surface = surfaceRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!surface || !canvas || !image) return;

    const pointerTarget = trackParent ? surface.parentElement ?? surface : surface;
    const pointerQuery = "(prefers-reduced-motion: no-preference) and (any-hover: hover) and (any-pointer: fine)";
    const desktop = window.matchMedia(wardrobeSrc ? `(width > 760px) and ${pointerQuery}` : pointerQuery);
    const touch = window.matchMedia("(any-pointer: coarse) and (prefers-reduced-motion: no-preference)");
    let cleanup: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;
    const mount = () => {
      const wardrobe = wardrobeSrc ? new window.Image() : undefined;
      cleanup = mountShader(surface, pointerTarget, canvas, image, position, touch.matches, wardrobe);
      if (wardrobe && wardrobeSrc && cleanup) {
        const { props } = getImageProps({ src: wardrobeSrc, alt: "", fill: true, sizes, quality: 90 });
        wardrobe.sizes = sizes;
        wardrobe.srcset = props.srcSet ?? "";
        wardrobe.src = props.src;
      }
    };
    const sync = () => {
      observer?.disconnect();
      observer = undefined;
      cleanup?.();
      cleanup = undefined;
      if (desktop.matches) {
        mount();
      } else if (touch.matches) {
        observer = new IntersectionObserver(([entry], currentObserver) => {
          if (!entry.isIntersecting || currentObserver !== observer) return;
          currentObserver.disconnect();
          mount();
        }, { rootMargin: "160px" });
        observer.observe(surface);
      }
    };
    sync();
    desktop.addEventListener("change", sync);
    touch.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      touch.removeEventListener("change", sync);
      observer?.disconnect();
      observer = undefined;
      cleanup?.();
    };
  }, [src, position, trackParent, wardrobeSrc, sizes]);

  return (
    <div className={className ? "shader-image " + className : "shader-image"} ref={surfaceRef}>
      <Image key={src} ref={imageRef} src={src} alt={alt} sizes={sizes} quality={90} fill preload={priority} loading={loading} style={imagePosition} />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
