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
  float hue = a * 0.5 / PI + 0.5;
  float saturtation = quadraticIn(mag * 2.0);
  gl_FragColor = mag < 0.5 ? vec4(hsv2rgb(vec3(hue, saturtation, value)), 1.0) : vec4(0.0, 0.0, 0.0, 0.0);
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
