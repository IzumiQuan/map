// 统计地图目录配置
const configList = [
  {
    name: "毛线V3—下界交通地图",
    type: "kedamaV3Nether117"
  },
  {
    name: "毛线V2—下界交通地图",
    type: "kedamaV2Nether115"
  },
  {
    name: "毛线V2—下界基岩上层萌新通道",
    type: "kedamaV2Nether128"
  },
  {
    name: "毛线V2—主世界通地图",
    type: "kedamaV2World"
  },
  {
    name: "喵窝—下界交通地图",
    type: "nyaaNether"
  }
  // {
  //   name: "喵窝—主世界通地图",
  //   type: "nyaaWorld"
  // }
];
// 初始配置
let base = {
  type: "kedamaV3Nether117",
  ice: "#7FDBFF",
  rail: "#FFDC00",
  walk: "#85144b",
  green: "#2ECC40",
  frame: "#AAAAAA",
  text: "#001f3f",
  white: "#fff",
  width: 2,
  config: {},
  scale: 1,
  dx: 0,
  dz: 0
};
// 获取地址传参
let urlType = getUrlString("type");
// 获取本地配置
let localBase = getLocal("base");
// 优先加载通过地址传参的地图
urlType && (localBase ? localBase.type = urlType : localBase = {type: urlType});

// 合并各种配置到 base
Object.assign(base, localBase);

// 页面加载玩执行
window.onload = () => {
  configHtml();
  $draw.getCtx("#canvas");
  $draw.setCanvas(isPhone() ? 3 : 1, base.width);
  get(base.type);

  var hammer = new Hammer($("#canvas"));
  // 手机移动  通过 transform 优化拖动性能
  hammer.on("panmove", ev => {
    $("canvas").style.transform = `translate3d(${ev.deltaX}px, ${ev.deltaY}px, 0px)`;
  });
  hammer.on("panend", ev => {
    base.dx += ev.deltaX;
    base.dz += ev.deltaY;
    $draw.moveCanvas(base.dx, base.dz);
    $("canvas").style.transform = `translate3d(0px, 0px, 0px)`;
    drawCanvse();
  });
  // 手机缩放
  hammer.get("pinch").set({
    enable: true
  });
  hammer.on("pinchmove", ev => {
    $("canvas").style.transform = `scale3d(${ev.scale}, ${ev.scale}, 1)`;
  });
  hammer.on("pinchend", ev => {
    let cW = $("canvas").offsetWidth;
    let cH = $("canvas").offsetHeight;

    $("canvas").style.transform = "scale3d(1, 1, 1)";
    base.scale = base.scale * ev.scale;
    base.dx += (ev.center.x - cW / 2) * (1 - base.scale);
    base.dz += (ev.center.y - cH / 2) * (1 - base.scale);
    $draw.moveCanvas(base.dx, base.dz);
    drawCanvse();
  });
   // 鼠标缩放
   mouseWheel("canvas", () => {
    let m = getMousePos();
    let cW = $("canvas").offsetWidth;
    let cH = $("canvas").offsetHeight;
    
    base.scale = 0.9 * base.scale;
    base.dx += (m.x - cW / 2) * (1 - base.scale) - base.dx;
    base.dz += (m.y - cH / 2) * (1 - base.scale) - base.dz;
    $("canvas").style.transform = `scale3d(${base.scale}, ${base.scale}, 1)`;
    $draw.moveCanvas(base.dx, base.dz);
    drawCanvse();
    $("canvas").style.transform = `scale3d(1, 1, 1)`;
  }, () => {
    let m = getMousePos();
    let cW = $("canvas").offsetWidth;
    let cH = $("canvas").offsetHeight;

    base.scale = 1.1 * base.scale;
    base.dx += (m.x - cW / 2) * (1 - base.scale) - base.dx;
    base.dz += (m.y - cH / 2) * (1 - base.scale) - base.dz;
    $("canvas").style.transform = `scale3d(${base.scale}, ${base.scale}, 1)`;
    $draw.moveCanvas(base.dx, base.dz);
    drawCanvse();
    $("canvas").style.transform = `scale3d(1, 1, 1)`;
  });
}

// 监听数据源更改
$(".select-data").onchange = function() {
  base.type = this.value;
  get(base.type);
  setLocal("base");
}
// 监听颜色更改
$("#ice").onchange = function() {
  this.click();
  base.ice = this.value;
  drawCanvse();
  setLocal("base");
};
$("#rail").onchange = function() {
  this.click();
  base.rail = this.value;
  drawCanvse();
  setLocal("base");
};
$("#walk").onchange = function() {
  this.click();
  base.walk = this.value;
  drawCanvse();
  setLocal("base");
};
$("#green").onchange = function() {
  this.click();
  base.green = this.value;
  drawCanvse();
  setLocal("base");
};
$("#frame").onchange = function() {
  this.click();
  base.frame = this.value;
  drawCanvse();
  setLocal("base");
};
$("#text").onchange = function() {
  this.click();
  base.text = this.value;
  drawCanvse();
  setLocal("base");
};
// 恢复初始颜色
$(".ice").onclick = () => {
  changeColor("#ice", "#7FDBFF");
  base.ice = "#7FDBFF";
  drawCanvse();
  setLocal("base");
}
$(".rail").onclick = () => {
  changeColor("#rail", "#FFDC00");
  base.rail = "#FFDC00";
  drawCanvse();
  setLocal("base");
}
$(".walk").onclick = () => {
  changeColor("#walk", "#85144b");
  base.walk = "#85144b";
  drawCanvse();
  setLocal("base");
}
$(".green").onclick = () => {
  changeColor("#green", "#2ECC40");
  base.green = "#2ECC40";
  drawCanvse();
  setLocal("base");
}
$(".frame").onclick = () => {
  changeColor("#frame", "#AAAAAA");
  base.frame = "#AAAAAA";
  drawCanvse();
  setLocal("base");
}
$(".text").onclick = () => {
  changeColor("#text", "#001f3f");
  base.text = "#001f3f";
  drawCanvse();
  setLocal("base");
}
// 关闭弹窗
$(".tip-btn").onclick = () => {
  $("#canvas").className = null;
  $(".tip").style.display = "none";
  setLocal(base.type);
}

// 画图
function drawCanvse() {
  $draw.recanvas();
  $draw.bg(base.white);
  $draw.setRadius(base.config.radius);
  $draw.setScale(base.scale);
  // base.config.showradius && $draw.circles(base.frame);
  $draw.border(base.config.borderStyle);
  $draw.item(base.config.data);
}
// 封装选择器（jquery风味）
function $(id) {
  return document.querySelector(id);
}
// 获取json文件
function get(type) {
  const xhr = new XMLHttpRequest();
  xhr.open("get", `../config/${type}.json`, true);
  xhr.send();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        base.config = JSON.parse(xhr.responseText);
        changeHtml();
        initSize(base.config.radius);
        $draw.moveCenter(base.config.center);
        drawCanvse();
      } else {
        console.error("configList -> type or url -> type error");
        console.error(type);
      }
    };
  }
}
// 获取地址传参
function getUrlString(name) {
  let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  return r !== null ? unescape(r[2]) : null;
}
// 修改html数据
function changeHtml() {
  $("title").innerText = base.config.title;
  $(".title-text").innerText = base.config.title;
  $(".version-data .uptime").innerText = base.config.uptime;
  $(".version-data .author").innerText = base.config.author;

  let old = getLocal(base.type) || 0;
  let oldVersion = old.version || 0;

  $("#canvas").className = null;
  $(".tip").style.display = "none";
  if (base.config.version && (oldVersion === null || oldVersion < base.config.version)) {
    $(".tip-text").innerHTML = base.config.introduce;
    $(".tip").style.display = "flex";
    $("#canvas").className = "canvas-mask";
  }
}
// 初始配置本地储存select与input[color]值
function configHtml() {
  // 初始化select
  let html = "";
  configList.forEach(element => {
    html += `<option value="${element.type}">${element.name}</option>`;
  });
  $(".select-data").innerHTML = html;
  // 更新本地储存颜色与select值
  for (const key in localBase) {
    if (localBase.hasOwnProperty(key)) {
      const element = localBase[key];
      if (key === "type") {
        $(".select-data").value = element;
      } else {
        changeColor("#" + key, element);
      }
    }
  }
}
// 修改input[color]颜色
function changeColor(id, value) {
  $(id).value = value;
}
// 初始化map大小
function initSize(r) {
  let w = document.body.clientWidth;
  let h = document.body.clientHeight;
  base.scale = (w - h ? h : w) / (2 * r) * 0.9;
  $draw.setScale(base.scale);
}
// 判断设备
function isPhone(state, i) {
  if (!window.location.hash.match("fromapp")) {
    return navigator.userAgent.match(/(iPhone|Android|ios|Windows Phone)/i);
  }
}
// 储存数据
function setLocal(item) {
  let data;
  if (item === "base") {
    data = {
      type: base.type,
      ice: base.ice,
      rail: base.rail,
      walk: base.walk,
      green: base.green,
      frame: base.frame,
      text: base.text
    };
  } else {
    data = {
      type: base.type,
      version: base.config.version
    }
  }
  localStorage.setItem(item, JSON.stringify(data));
}
// 获取数据
function getLocal(item) {
  return JSON.parse(localStorage.getItem(item));
}
// 鼠标坐标
function getMousePos(event) {
  var e = event || window.event;
  return {"x": e.clientX, "y": e.clientY}
}
// 鼠标滚轮
function mouseWheel(id, downFn, upFn) {
  const obj = $(id);
  obj.onmousewheel = fn;
  if (obj.addEventListener) {
    obj.addEventListener('DOMMouseScroll', fn, false);
  }
  function fn(ev) {
    var ev = ev || event;
    var b = true;
    if (ev.wheelDelta) {
      b = ev.wheelDelta > 0 ? true : false;
    } else {
      b = ev.detail < 0 ? true : false;
    }
    if(b) {
      upFn && upFn();
    } else {
      downFn && downFn();
    }
    if (ev.preventDefault) {
      ev.preventDefault();
    }
    return false;
  }
}

// 绘制主方法
let $draw = {
  radius: "",
  canvas: "",
  ctx: "",
  center: {x: 0, y: 0},
  base: 1, // 整体canvas扩大倍数，结合css，解决手机模糊
  scale: 1, // 缩放基数
  width: 2, // 画笔宽度
  dx: 0, // 移动 x
  dz: 0, // 移动 y

  getCtx(id) {
    this.canvas = $(id);
    this.ctx = canvas.getContext("2d");
  },
  setCanvas(base, width) {
    this.base = base;
    this.width = width * this.base;
    this.canvas.width = document.body.clientWidth * this.base;
    this.canvas.height = document.body.clientHeight * this.base;
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2); // 设置中心点
  },
  setRadius(r) {
    this.radius = r;
  },
  setScale(scale) {
    this.scale = scale * this.base;
  },
  moveCenter(center) {
    this.center = center;
  },
  moveCanvas(dx, dz) {
    this.dx = dx * this.base;
    this.dz = dz * this.base;
  },
  recanvas() {
    this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
  },
  bg (color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
  },
  line(color, width, points, type) {
    if (type === "dotted") {
      this.ctx.setLineDash([7 * width, 7 * width]);
    }
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    // 画线
    for (let i = 0; i < points.length; i++) {
      const element = points[i];
      if (i === 0) {
        this.ctx.moveTo(
          (element.x - this.center.x) * this.scale + this.dx, 
          (element.z - this.center.z) * this.scale + this.dz
        );
      } else {
        // 绘制曲线
        if (element.type) {
          let before = points[i - 1];
          switch (element.type) {
            case "t-l":
              this.ctx.quadraticCurveTo(
                ((element.ex || (before.x > element.x ? element.x : before.x)) - this.center.x) * this.scale + this.dx,
                ((element.ez || (before.z > element.z ? element.z : before.z)) - this.center.z) * this.scale + this.dz,
                (element.x - this.center.x) * this.scale + this.dx,
                (element.z - this.center.z) * this.scale + this.dz
              );
              break;
            case "t-r":
              this.ctx.quadraticCurveTo(
                ((element.ex || (before.x > element.x ? before.x : element.x)) - this.center.x) * this.scale + this.dx,
                ((element.ez || (before.z > element.z ? element.z : before.z)) - this.center.z) * this.scale + this.dz,
                (element.x - this.center.x) * this.scale + this.dx,
                (element.z - this.center.z) * this.scale + this.dz
              );
              break;
            case "b-l":
              this.ctx.quadraticCurveTo(
                ((element.ex || (before.x > element.x ? element.x : before.x)) - this.center.x) * this.scale + this.dx,
                ((element.ez || (before.z > element.z ? before.z : element.z)) - this.center.z) * this.scale + this.dz,
                (element.x - this.center.x) * this.scale + this.dx,
                (element.z - this.center.z) * this.scale + this.dz
              );
              break;
            case "b-r":
              this.ctx.quadraticCurveTo(
                ((element.ex || (before.x > element.x ? before.x : element.x)) - this.center.x) * this.scale + this.dx,
                ((element.ez || (before.z > element.z ? before.z : element.z)) - this.center.z) * this.scale + this.dz,
                (element.x - this.center.x) * this.scale + this.dx,
                (element.z - this.center.z) * this.scale + this.dz
              );
              break;
            default:
              if (element.ex && element.ez) {
                this.ctx.quadraticCurveTo(
                  (element.ex - this.center.x) * this.scale + this.dx,
                  (element.ez - this.center.z) * this.scale + this.dz,
                  (element.x -this.center.x) * this.scale + this.dx,
                  (element.z -this.center.z) * this.scale + this.dz
                );
              } else {
                console.error("curve-{type or ex or ez}-eorro");
                console.error(element);
              }
              break;
          }
        } else {
          this.ctx.lineTo(
            (element.x - this.center.x) * this.scale + this.dx, 
            (element.z - this.center.z) * this.scale + this.dz
          );
        }
      }
    }
    this.ctx.stroke();
    this.ctx.closePath();
  },
  text(color, point, text) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${10 * this.base}px Arial`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      text, 
      (point.x - this.center.x) * this.scale + this.dx, 
      (point.z - this.center.z) * this.scale + this.dz
    );
    this.ctx.stroke();
    this.ctx.closePath();
  },
  round (color, width, points) {
    this.ctx.beginPath();
    this.ctx.arc(
      (points[points.length - 1].x - this.center.x) * this.scale + this.dx,
      (points[points.length - 1].z - this.center.z) * this.scale + this.dz,
      width,
      0,
      360,
      false
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  },
  circles (color) {
    this.ctx.beginPath();
    this.ctx.arc(this.dx,  this.dz,  this.radius * this.scale,  0,  360,  false);
    this.ctx.lineWidth = this.width;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    // 变成虚线
    const step = 1 / 180 * Math.PI * 2;
    for (let b = 0, e = step / 2; e <= 360; b += step, e += step) {
      this.ctx.beginPath()
      this.ctx.arc(this.dx, this.dz, this.radius * this.scale, b, e);
      this.ctx.strokeStyle = base.white;
      this.ctx.stroke();
    }
    this.ctx.closePath(); 
  },
  border (value) {
    this.ctx.save();
    if (value instanceof Array) {
      this.line(base.frame, this.width, value, "dotted");
    } else if (value === "circles") {
      this.circles(base.frame);
    } else if (value === "square") {
      const _value = [
        { x: -this.radius, z: -this.radius },
        { x: this.radius, z: -this.radius },
        { x: -this.radius, z: -this.radius },
        { x: -this.radius, z: this.radius },
        { x: -this.radius, z: -this.radius }
      ];
      this.line(base.frame, this.width, _value, "dotted");
    } else {
      return;
    }
    this.ctx.restore();
  },
  item(item) {
    item.forEach(element => {
      this.ctx.save();
      switch (element.type) {
        case "ice":
          this.line(base.ice, this.width * 2, element.points);
          break;
        case "rail":
          this.line(base.rail, this.width, element.points);
          break;
        case "walk":
          this.line(base.walk, this.width, element.points);
          break;
        case "green":
          this.round(base.green, this.width * 1.5, element.points);
          break;
        case "frame":
          this.line(base.frame, this.width, element.points);
          break;
        default:
          console.error("data-type-eorro");
          console.error(element);
          break;
      }
      this.ctx.restore();
    });
    // 防止文字被覆盖
    item.forEach(element => {
      this.ctx.save();
      element.name && this.text(base.text, element.points[element.points.length - 1], element.name);
      element.namelist && element.namelist.forEach(list => {
        this.text(base.text, list.point, list.name);
      });
      this.ctx.restore();
    });
  }
}
