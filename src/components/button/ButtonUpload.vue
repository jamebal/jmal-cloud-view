<template>
  <div>
    <button class="button">
      <div class="icon">
        <div class="arrow"></div>
        <svg class="line" viewBox="0 0 24 24"></svg>
      </div>
      {{name}}
    </button>
  </div>
</template>
<script>
  import gsap from 'gsap'
  export default {
    name: 'ButtonUpload',
    props: {
      name: {
        type: String,
        default: '上传'
      }
    },
    data(){
      return {
        interval: null
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(){
        const $ = (s, o = document) => o.querySelector(s);
        const $$ = (s, o = document) => o.querySelectorAll(s);

        $$('.button').forEach(button => {
          let icon = $('.icon', button),
            line = $('.line', icon),
            svgPath = new Proxy({
              y: null
            }, {
              set(target, key, value) {
                target[key] = value;
                if(target.y !== null) {
                  line.innerHTML = getPath(target.y, .25, null);
                }
                return true;
              },
              get(target, key) {
                return target[key];
              }
            }),
            timeline = gsap.timeline({
              paused: true
            });

          svgPath.y = 12;

          timeline.to(icon, {
            '--arrow-y': 6,
            '--arrow-rotate': 70,
            ease: "elastic.in(1.1, .8)",
            duration: .7
          }).to(icon, {
            '--arrow-y': 0,
            '--arrow-rotate': 45,
            ease: "elastic.out(1.1, .8)",
            duration: .7
          });

          timeline.to(svgPath, {
            y: 15,
            duration: .15
          }, .65).to(svgPath, {
            y: 12,
            ease: "elastic.out(1.2, .7)",
            duration: .6
          }, .8);
          this.interval = setInterval(() => timeline.restart(), 1500);
        });

        function getPoint(point, i, a, smoothing) {
          let cp = (current, previous, next, reverse) => {
              let p = previous || current,
                n = next || current,
                o = {
                  length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
                  angle: Math.atan2(n[1] - p[1], n[0] - p[0])
                },
                angle = o.angle + (reverse ? Math.PI : 0),
                length = o.length * smoothing;
              return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
            },
            cps = cp(a[i - 1], a[i - 2], point, false),
            cpe = cp(point, a[i - 1], a[i + 1], true);
          return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
        }

        function getPath(update, smoothing, pointsNew) {
          let points = pointsNew ? pointsNew : [
              [5, 12],
              [12, update],
              [19, 12]
            ],
            d = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`, '');
          return `<path d="${d}" />`;
        }

      },
    },
    destroyed() {
      clearInterval(this.interval)
    }
  }
</script>

<style lang="scss">
  .button {
    --background: #409EFF;
    --background-hover: #6bcbff;
    --text: #fff;
    --icon: #fff;
    display: flex;
    outline: none;
    cursor: pointer;
    border: 0;
    padding: 8px 20px 8px 20px;
    border-radius: 9px;
    line-height: 24px;
    font-family: inherit;
    font-weight: 600;
    font-size: 14px;
    color: var(--text);
    background: var(--b, var(--background));
    transition: transform .3s, background .4s;
    transform: scale(var(--scale, 1)) translateZ(0);
    &:active {
      --scale: .95;
    }
    &:hover {
      --b: var(--background-hover);
    }
    .icon {
      --arrow-y: 0;
      --arrow-rotate: 45;
      width: 24px;
      height: 24px;
      position: relative;
      display: inline-block;
      vertical-align: top;
      pointer-events: none;
      .arrow,
      .line {
        position: absolute;
      }
      .arrow {
        left: 11px;
        top: 4px;
        width: 2px;
        height: 12px;
        border-radius: 1px;
        background: var(--icon);
        transform: translateY(calc(var(--arrow-y) * 1px)) translateZ(0);
        &:before,
        &:after {
          content: '';
          width: 2px;
          height: 7px;
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 1px;
          background: inherit;
          transform-origin: 1px 1px;
          transform: rotate(var(--r, calc(var(--arrow-rotate) * -1deg)));
        }
        &:after {
          --r: calc(var(--arrow-rotate) * 1deg);
        }
      }
      .line {
        width: 24px;
        height: 24px;
        display: block;
        left: 0;
        top: 7px;
        fill: none;
        stroke: var(--icon);
        stroke-width: 2;
        stroke-linejoin: round;
        stroke-linecap: round;
      }
    }
  }

  .dribbble {
    position: fixed;
    display: block;
    right: 20px;
    bottom: 20px;
    img {
      display: block;
      height: 28px;
    }
  }
  .twitter {
    position: fixed;
    display: block;
    right: 64px;
    bottom: 14px;
    svg {
      width: 32px;
      height: 32px;
      fill: #1da1f2;
    }
  }
</style>
