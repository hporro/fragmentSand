#version 330 core
in vec2 TexCoord;

out vec4 FragColor;
layout(location = 0) out vec4 color_out;

uniform sampler2D texture_u;
uniform vec2 mouse_pos_u;
uniform int mouse_leftButton_u;
uniform int sand_mode_u;
uniform int wall_mode_u;


float rand(vec2 co);
vec4 getTexColor(vec2 off);
vec4 updateSand(vec2 pos);
vec4 calcColor(vec2 pos);

float width = 800;
float height = 600;

vec4 black = vec4(0.0,0.0,0.0,0.0);
vec4 sand_color = vec4(0.77,0.52,0.0,1.0);
vec4 wall_color = vec4(0.05,0.80,0.2,1.0);
vec2 unitPixel = vec2(1.0,1.0)/vec2(800,600);

vec2 up = vec2(0.0,1.0);
vec2 down = vec2(0.0,-1.0);
vec2 left = vec2(-1.0,0.0);
vec2 right = vec2(1.0,0.0);
vec2 here = vec2(0.0,0.0);

vec4 upColor = getTexColor(up);
vec4 downColor = getTexColor(down);
vec4 hereColor = getTexColor(here);
vec4 leftColor = getTexColor(left);
vec4 rightColor = getTexColor(right);
vec4 downleftColor = getTexColor(down+left);
vec4 downrightColor = getTexColor(down+right);
vec4 upleftColor = getTexColor(up+left);
vec4 uprightColor = getTexColor(up+right);

void main()
{
    vec2 st = gl_FragCoord.xy/vec2(800,600);

    vec4 o = calcColor(st);
    FragColor = o;
    color_out = o;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 updateSand(vec2 pos){
    //noise
    //float isOn = step(0.6,rand(pos));
    //mouse input
    float isIn = step(sqrt(pow((mouse_pos_u.x-pos.x)*width,2)+pow((mouse_pos_u.y-pos.y)*height,2)),20);
    vec4 clicked_circle = isIn*mouse_leftButton_u*(sand_mode_u*sand_color + wall_mode_u*wall_color);//*isOn;

    //general rules
    if((hereColor == black) && (upColor == black) && (downColor == black)) return clicked_circle;
    if((hereColor == black) && (upColor == black)) return black;

    //wall rules
    if(hereColor.x  == wall_color.x) return hereColor;
    if(upColor.x == wall_color.x) return hereColor;
    if(downColor.x == wall_color.x) return hereColor;

    //sand rules
    if(pos.y <= unitPixel.y && hereColor != black) return hereColor;

    if((hereColor == black) && (upColor != black)) return upColor;

    /*
    // There are problems with the sliding behaveaour
    //slide to the right
    if((hereColor != black) && (downleftColor != black) && (downColor != black) && (downrightColor == black) && (rightColor == black))
        return black;
    if((hereColor == black) && (upleftColor != black) && (leftColor != black) && (upColor == black))
        return upleftColor;

    //slide to the left
    if((hereColor != black) && (downrightColor != black) && (downColor != black) && (downleftColor == black) && (leftColor == black))
        return black;
    if((hereColor == black) && (uprightColor != black) && (rightColor != black) && (upColor == black))
        return uprightColor;
    /**/

    if((hereColor != black) && (downColor == black)) return black;
    if((hereColor != black) && (downColor != black)) return hereColor;

    return clicked_circle;
}

vec4 calcColor(vec2 pos){

    //return vec4(1.0,1.0,1.0,1.0)*step(0.6,rand(pos));
    vec4 sand = updateSand(pos);
    return sand;

    //possible conway game of life implementation (not working)
    /*if(hereColor == black) return clicked_circle;

    int count = 0;
    if(upColor != black) count++;
    if(downColor != black) count++;
    if(leftColor != black) count++;
    if(rightColor != black) count++;

    if(count < 2) return black;
    if(count < 4) return sand_color;
    return clicked_circle;*/
}

vec4 getTexColor(vec2 off){
    if(TexCoord.y + unitPixel.y > height) return black;
    if(TexCoord.y + unitPixel.y < 0) return black;

    return texture(texture_u, vec2(TexCoord.x + unitPixel.x*off.x,TexCoord.y + unitPixel.y*off.y));
}