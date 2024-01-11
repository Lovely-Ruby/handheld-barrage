import {
  handleQueryDomNodeHeight,
  handleSetAimation,
  handleQueryTextDomNodeHeight,
  dialogModal,
} from './tools';
import { colorArr } from './constant';

Page({
  data: {
    inputText: '',
    text: '请输入弹幕内容( = _ =  )||',
    fontSize: 470, // 可以自定斜率：fontsize = 7 * sliderValue + 50
    sliderValOfFontSize: 60,
    fontColor: 'white',
    backgroundColor: 'black',
    sliderValOfSpeed: 0,
    currentTab: 0,
    textMoveAnimate: null,
    animationDataModal: {},
    textDomTop: -Number.MAX_SAFE_INTEGER + 'px',
    isOpacityBottom: false,
    colorArr,
  },
  screenHeight: 0,
  animation: null,
  animationModal: null,
  setQueryTextDomNodeHeightInterval: null,
  setOpacityTimeout: null,

  /**
   * 获取屏幕高度
   */
  onLoad: async function () {
    const _this = this;
    handleQueryTextDomNodeHeight(_this);
    this.handleTapScreen(null, 20000);
    const textHeight = await handleQueryDomNodeHeight(_this);
    this.screenHeight = wx.getSystemInfoSync().screenHeight;
    this.setData(
      {
        textDomTop: _this.screenHeight + textHeight / 2,
      },
      function () {
        handleSetAimation(_this, _this.screenHeight);
      }
    );
  },

  /**
   * 从后台返回的时候去显示按钮
   */
  onShow: function () {
    this.handleTapScreen(null, 20000);
  },

  /**
   * 控制按钮的透明度
   * @param {*} _ 第一个是点击事件的时间因子 e
   * @param {*} DELAY 自定义默认值
   */
  handleTapScreen(_, DELAY = 10000) {
    const _this = this;
    _this.setData({
      isOpacityBottom: false,
    });
    if (_this.setOpacityTimeout) {
      clearTimeout(_this.setOpacityTimeout);
    }
    _this.setOpacityTimeout = setTimeout(() => {
      _this.setData({
        isOpacityBottom: true,
      });
    }, DELAY);
  },

  // 点击发送按钮
  sendBtn() {
    const _this = this;
    if (_this.data.inputText === '') {
      wx.showToast({
        title: '不能为空哦',
        icon: 'error',
        duration: 2000,
      });
    } else {
      _this.setData({
        text: _this?.data?.inputText || '不能为空哦',
      });
      wx.showToast({
        title: '成功发送~',
        duration: 2000,
      });
    }
  },

  // 改变背景颜色
  setBackGroundColor(e) {
    let index = e.target.dataset.index;
    const _this = this;
    let selectColor = _this.data.colorArr[index].color;
    _this.setData({
      backgroundColor: selectColor,
    });
  },

  // 选择弹幕的字体颜色
  setColor(e) {
    const _this = this;
    let index = e.target.dataset.index;
    let selectColor = _this.data.colorArr[index].color;
    _this.setData({
      fontColor: selectColor,
    });
  },

  // 改变弹幕滚动速度
  changeTextSpeend(e) {
    const sliderVal = e?.detail?.value || 0;
    const _this = this;
    _this.setData({
      sliderValOfSpeed: sliderVal,
    });
  },

  /**
   * question: 滑杆点击的时候值改变了，但是字号没有改变
   * solution: 添加 bindChange 事件的 handleFunction
   * date: 2023-08-14
   */
  handleChangeFontSize(e) {
    const _this = this;
    const sliderVal = e?.detail?.value || 0;
    _this.setData({
      fontSize: sliderVal * 7 + 50,
      sliderValOfFontSize: sliderVal,
    });
  },

  handleSliderChanged() {
    wx.showToast({
      title: '当前弹幕结束后生效~',
      icon: 'none',
      duration: 2000,
    });
  },

  /**
   * 功能：改变字号
   * 问题：这里的调用动画，会根据摇杆调用多少次函数，去执行多少次动画，可以查看top的值，是每一次都变化的
   * 解决：
   * - 添加一个防抖
   * - 感觉是设计模式的问题，杆的值动就动，不要再这里去调用此函数值
   * @param {*} e
   */
  changeFontSize(e) {
    const _this = this;
    const sliderVal = e?.detail?.value || 0;
    _this.setData({
      fontSize: sliderVal * 7 + 50,
      sliderValOfFontSize: sliderVal,
    });
  },

  // input失去焦点时获取输入的文字
  inputBlur(e) {
    const _this = this;
    const inputVal = e?.detail?.value;
    _this.setData({
      inputText: inputVal,
    });
  },

  /**
   * 功能：显示对话框
   * 注释：这里并不能写成 showDialogModal: dialogModal(this)，会丢失 this 上下文
   */
  showDialogModal() {
    dialogModal(this, true);
  },

  // 隐藏对话框
  hideDialogModal() {
    dialogModal(this, false);
  },

  // 滑动切换
  swiperTab: function (e) {
    const _this = this;
    _this.setData({
      currentTab: e.detail.current,
    });
  },

  // 点击切换
  clickTab: function (e) {
    const _this = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      _this.setData({
        currentTab: e.target.dataset.current,
      });
    }
  },
});
