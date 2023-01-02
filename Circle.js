import { StyleSheet, Dimensions } from "react-native";
import React from "react";

import { GLSL, Node, Shaders } from "gl-react";
import { Surface } from "gl-react-expo";
const { height, width } = Dimensions.get("window");

const SIZE = width * 0.8;

const r = SIZE / 2;

const shaders = Shaders.create({
  hue: {
    frag: GLSL`
#define PI  3.141592653589793
#define TAU 6.283185307179586
precision highp float;
varying vec2 uv;
uniform float value;

// https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float quadraticIn(float t) {
  return t * t;
}
void main() {
  float mag = distance(uv, vec2(0.5));
  vec2 pos = vec2(0.5) - uv;
  float a = atan(pos.y, pos.x);
  float progress = a * 0.5 / PI + 0.5;
  gl_FragColor = mag < 0.5 ? vec4(hsv2rgb(vec3(progress, quadraticIn(mag * 2.0), value)), 1.0) : vec4(0.0, 0.0, 0.0, 0.0);
}
`,
  },
});

const Circle = ({ ShaderValue }) => {
  return (
    <Surface
      style={{
        width: r * 2,
        height: r * 2,
        //   borderRadius: r,
      }}
    >
      <Node
        shader={shaders.hue}
        uniforms={{ value: Math.round(ShaderValue * 100) / 100 }}
      />
    </Surface>
  );
};

export default Circle;

const styles = StyleSheet.create({});
