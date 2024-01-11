// 函数工具包

/**
 * 功能：轮训查询 textDom 节点高度
 * @param {*} _this
 * @returns
 */
export function handleQueryTextDomNodeHeight(_this) {
  const duration = 3000;
  _this.setQueryTextDomNodeHeightInterval = setInterval(() => {
    const query = wx.createSelectorQuery().in(_this);
    query
      .select('#textDom')
      .boundingClientRect(function (res) {
        _this.textDomHeight = res?.height || 0;
      })
      .exec();
  }, duration);
}

/**
 * 功能：同步获取 text 节点长度，在 onLoad 中执行一次
 * 注释：这个 exec() 不能省，写成外部组件的话_this 也要传递, this 为 index.js 实例对象，可以打印出来看看
 */
export function handleQueryDomNodeHeight(_this) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery().in(_this);
    query
      .select('#textDom')
      .boundingClientRect(function (res) {
        resolve(res?.height || 0);
      })
      .exec();
  });
}

/**
 * 功能：根据文字高度，以及字体大小，播放速率，计算动画持续时间
 * 备注：
 * - 播放速率是判断滑杆的数值
 * - 如果大于0，那么就是加速，基础倍速是1，摇杆的值如果是1的话就是原来速度的2倍
 * - 如果小于0，那么就是减速，就是在原有的基础速度分半，比方说摇杆的值是-1，那么就是原来速度的1/2，也就是 BASE_V / (Math.abs(SPEED) + 1)
 * @param {*} _this
 * @returns
 */
const handleCalculateDurationTime = async (_this) => {
  const BASE_V = 0.3; //   基础速度，每毫秒走的像素高度
  const OFFSET = 200; // 起始值的偏移量，让 textdom 往下一点
  const textHeight = _this.textDomHeight || (await handleQueryDomNodeHeight(_this));
  const START_TOP = OFFSET + _this.screenHeight + Number.parseInt(textHeight / 2) + 'px';
  const END_TOP = -Number.parseInt(textHeight / 2) + 'px';
  const SPEED = _this.data.sliderValOfSpeed; // 文字速率，滑杆的值
  let TEMP_V = BASE_V;
  if (SPEED > 0) {
    TEMP_V = BASE_V * (SPEED + 1);
  } else {
    TEMP_V = BASE_V / (Math.abs(SPEED) + 1);
  }
  const DELAY = textHeight / TEMP_V;
  return { START_TOP, END_TOP, DELAY };
};

/**
 * 功能：第一次设置动画
 * @param {*} _this
 */

export async function handleSetAimation(_this) {
  if (_this.TextDomAnimationInterval) {
    clearInterval(_this.TextDomAnimationInterval);
  }
  const { START_TOP, END_TOP, DELAY } = await handleCalculateDurationTime(_this);
  _this.setData({
    textDomTop: START_TOP,
  });
  _this.animate('#textDom', [{ top: START_TOP }, { top: END_TOP }], DELAY, () => {
    handleAfterAnimate(_this);
  });
}

/**
 * 功能：递归设置动画
 * 备注：嘎嘎香的递归函数，省去了我之前很多代码
 * @param {*} _this
 */
async function handleAfterAnimate(_this) {
  const { START_TOP, END_TOP, DELAY } = await handleCalculateDurationTime(_this);
  _this.setData({
    textDomTop: START_TOP,
  });
  _this.animate('#textDom', [{ top: START_TOP }, { top: END_TOP }], DELAY, () => {
    handleAfterAnimate(_this);
  });
}

/**
 * 功能：显示、隐藏配置 Modal
 * @param {} _this
 * @param {*} isShow
 */
export function dialogModal(_this, isShow = false) {
  const animation = wx.createAnimation({
    duration: 200,
    timingFunction: 'linear',
    delay: 0,
  });
  _this.animationModal = animation;
  animation.translateY(300).step();
  _this.setData({
    animationDataModal: animation.export(),
    showModalStatus: true,
  });
  setTimeout(
    function () {
      animation.translateY(0).step();
      _this.setData({
        animationDataModal: animation.export(),
      });
      if (!isShow) {
        _this.setData({
          showModalStatus: false,
        });
      }
    }.bind(_this),
    200
  );
}
