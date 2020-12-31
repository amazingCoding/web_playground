import style from './index.css'
const isSupportTouch = "ontouchend" in document ? true : false
const ITEM_HEIHT = 46
const FRAME_HEIGHT = 350
const GRAY_COLOR = '#999999'
const MAIN_COLOR = '#FA5151'
interface NodeElement {
  className: string
  id?: string
  next?: NodeElement[] | string
  style?: any
}
const createDiv = (node: NodeElement) => {
  const ele = document.createElement('div')
  ele.className = node.className
  if (node.id) ele.id = node.id
  if (node.next) {
    if (!Array.isArray(node.next)) ele.innerHTML = node.next
    else node.next.map((item) => { ele.appendChild(createDiv(item)) })
  }
  if (node.style && typeof node.style === 'object') {
    for (let key in node.style) ele.style[key as any] = node.style[key]
  }
  return ele
}
const getIndex = (val: any, array: any[]) => {
  let res = 0
  for (let i = 0; i < array.length; i++) if (array[i].value === val) res = i
  return res
}
const getDay = (year: number, month: number): PickerItem[] => {
  let dayNumber = 31
  if (month === 4 || month === 6 || month === 11 || month === 9 || month === 11) dayNumber = 30
  else if (month === 2) {
    if ((year % 100 === 0 && year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0)) dayNumber = 29
    else dayNumber = 28
  }
  const D = []
  for (let i = 0; i < dayNumber; i++) {
    const _i = i + 1
    const index = _i < 10 ? `0${_i}` : _i + ''
    D.push({
      title: `${index}日`,
      value: _i
    })
  }
  return D
}
const setWrapperCSS = (wrapper: HTMLDivElement, time: string, dist: number) => {
  wrapper.style.webkitTransition = time
  wrapper.style.transition = time
  const transform = `translate3d(0,${dist}px,0)`
  wrapper.style.transform = transform
  wrapper.style.webkitTransform = transform
}
interface PickerItem {
  title: string | number
  value: string | number
}
interface BasePickerConfig {
  default?: any[]
  mainColor?: string,
  btnColor?: string,
  changeTitle?: boolean,
  onConfirm?: (res: any[]) => void
  onChange?: (res: any[]) => void
  zIndex?: number
}
//#region 普通 picker
interface PickerConfig extends BasePickerConfig {
  title: string
  data: PickerItem[][],
}
export class Picker {
  data: PickerItem[][]
  default: any[]
  title: string
  onConfirm: (res: any[]) => void
  onChange: (res: any[]) => void
  isShow: boolean = false
  mainColor: string = MAIN_COLOR
  btnColor: string = MAIN_COLOR
  changeTitle: boolean = true
  values: any[]
  // 接受滚动事件的 col 组件实例数组
  pickerItems: HTMLDivElement[] = []
  selectIndexs: number[] = [] // 每一列选中 item 组件实例数组
  scrollYs: number[] = [] // 每一列滚动距离 记录
  maxY = (0 - 2) * ITEM_HEIHT * -1
  zIndex: number = 1
  constructor(config: PickerConfig) {
    if (!config.data) throw 'need set array data'
    this.data = config.data
    if (config.default) {
      this.default = config.default
      this.values = config.default
    }
    else {
      this.default = []
      this.data.map((item) => {
        this.default.push(item[0].value)
        this.values.push(item[0].value)
      })
    }
    this.title = config.title
    this.onConfirm = config.onConfirm
    this.onChange = config.onChange
    if (config.mainColor) this.mainColor = config.mainColor
    if (config.btnColor) this.btnColor = config.btnColor
    if (config.changeTitle === false) this.changeTitle = config.changeTitle
    if (config.zIndex) this.zIndex = config.zIndex
  }
  private _listener(el: HTMLDivElement, index: number) {
    let touchStartY = 0
    let isStart = false
    let startTs = 0
    let lastMove = 0
    let flag = false

    const touchstartHandler = (e: any) => {
      if (flag) return
      touchStartY = e.touches ? e.touches[0].pageY : e.screenY
      startTs = new Date().getTime()
      isStart = true
    }
    const touchmoveHandler = (e: any) => {
      if (e.preventDefault) e.preventDefault()
      if (!isStart) return
      const touchMoveY = e.touches ? e.touches[0].pageY : e.screenY
      lastMove = touchMoveY
      const y = this.scrollYs[index]
      let dist = touchMoveY - touchStartY + y
      this._setOffset(index, dist, 2)
    }
    // TODO 简化版惯性 - 优化
    /**
     * 判断开始 - 结束 距离
     * 判断时间
     * 计算 速度 > 某个值，
     * requestAnimationFrame 300 touchmoveHandler 移动 100 px
     */
    const touchendtHandler = (e: any) => {
      if (!isStart || (Math.abs(lastMove) < 1 && typeof e !== 'boolean')) return
      const now = new Date().getTime()
      const dt = (now - startTs) / 1000
      const distY = lastMove - touchStartY


      let v = distY / dt
      if (Math.abs(v) > 900 && e !== false) {
        let ts = now
        const inertiaMove = () => {

          const t = new Date().getTime()
          const DT = (t - ts) / 1000 * 1000
          ts = t
          v = v / ((1 - DT) * (1 - DT))
          const newD = DT * v
          touchmoveHandler({ touches: [{ pageX: 0, pageY: lastMove + newD }] })
          if (1 - DT > 0) window.requestAnimationFrame(inertiaMove)
          else {
            flag = false
            touchendtHandler(false)
          }
        }
        flag = true
        window.requestAnimationFrame(inertiaMove)
      }
      else {
        isStart = false
        touchStartY = 0
        startTs = 0
        lastMove = 0
        const selectIndex = this.selectIndexs[index]
        this._setOffset(index, (selectIndex - 2) * ITEM_HEIHT * -1, 1)
      }


    }
    if (isSupportTouch) {
      el.addEventListener('touchstart', touchstartHandler)
      el.addEventListener('touchmove', touchmoveHandler)
      el.addEventListener('touchend', touchendtHandler)
      el.addEventListener('touchcancel', touchendtHandler)
    }
    else {
      el.addEventListener('mousedown', touchstartHandler)
      el.addEventListener('mousemove', touchmoveHandler)
      el.addEventListener('mouseup', touchendtHandler)
      el.addEventListener('mouseleave', touchendtHandler)
    }

  }
  /**
   * 
   * @param index 当前输入哪一列
   * @param offset 滚动偏移值 
   * @param type init / touchend / touchmove 0 1 2
   * @param isInit 是否是初始化的：初始化不触发 onChange 事件 / end 需要过渡动画 and 触发 onChange
   */
  _setOffset(index: number, offset: number, type: number = 0) {
    const time = type === 1 ? '.5s' : '0s'
    const el = this.pickerItems[index]
    const wrapper = el.childNodes[0] as HTMLDivElement
    // 通过 offset 反推 选中的 selectIndex
    const maxIndex = this.data[index].length - 1
    // 滚动 Wrapper
    let selectIndex = Math.floor(offset / ITEM_HEIHT * -1 + 2 + 0.5)
    if (selectIndex < 0) selectIndex = 0
    else if (selectIndex > maxIndex) selectIndex = maxIndex
    setWrapperCSS(wrapper, time, offset)
    // 选中样式切换
    const oldSelectIndex = this.selectIndexs[index]
    if (wrapper.childNodes[oldSelectIndex]) {
      const div = wrapper.childNodes[oldSelectIndex] as HTMLDivElement
      div.classList.remove(style.pickerItemActive)
      div.style.color = GRAY_COLOR
    }
    if (wrapper.childNodes[selectIndex]) {
      const div = wrapper.childNodes[selectIndex] as HTMLDivElement
      div.classList.add(style.pickerItemActive)
      div.style.color = this.mainColor
    }
    // 记录选中值
    this.values[index] = this.data[index][selectIndex].value
    // move 的时候不需要记录位置
    if (type !== 2) this.scrollYs[index] = offset
    // end 的时候才触发 onChange
    if (type === 1) {
      if (this.changeTitle) this.setTitle()
      if (this.onChange) this.onChange(this.values)
    }
    this.selectIndexs[index] = selectIndex
  }
  private setTitle() {
    let title = this.title
    if (this.changeTitle) this.values.map((item, index) => title = title.replace(`$${index}`, item))
    document.getElementById('sanYuePickerTitle').innerHTML = title
  }
  // 事件
  private slideEvent() {
    const slide = document.getElementById('sanYuePickerTouchHeader')
    const main = document.getElementById('sanYuePickerMain')
    let startY = 0
    let moveY = 0
    let startTs = 0
    const handleTouchStart = (e: any) => {
      startY = e.touches[0].pageY
      startTs = new Date().getTime() / 1000
      main.style.transition = '0.0s'
      main.style.webkitTransition = '0.0s'
    }
    const handleTouchMove = (e: any) => {
      const dist = e.touches[0].pageY - startY
      if (dist < 0) return
      moveY = dist
      main.style.transform = `translateY(${dist}px)`
      main.style.webkitTransform = `translateY(${dist}px)`
    }
    const handleTouchEnd = () => {
      const now = new Date().getTime() / 1000
      const dt = now - startTs
      const dist = moveY - startY
      const v = Math.abs(dist / dt)
      main.style.transition = '0.6s'
      main.style.webkitTransition = '0.6s'
      if (moveY > FRAME_HEIGHT / 2 || v > 1500) {
        main.style.transform = `translateY(${FRAME_HEIGHT}px)`
        main.style.webkitTransform = `translateY(${FRAME_HEIGHT}px)`
        this.remove()
      }
      else {
        main.style.transform = `translateY(0px)`
        main.style.webkitTransform = `translateY(0px)`
      }

    }
    slide.addEventListener('touchstart', handleTouchStart)
    slide.addEventListener('touchmove', handleTouchMove)
    slide.addEventListener('touchend', handleTouchEnd)
    slide.addEventListener('touchcancel', handleTouchEnd)
  }
  private event() {
    const hide = () => this.remove()
    document.getElementById('sanYuePickerCover').addEventListener('click', hide)
    document.getElementById('sanYuePickerBtnCancel').addEventListener('click', hide)
    document.getElementById('sanYuePickerBtnOK').addEventListener('click', () => {
      if (this.onConfirm) this.onConfirm(this.values)
      hide()
    })
    this.slideEvent()
    const pickerItemChildNodes = document.getElementById('pickerItems').childNodes
    const pickerItems: HTMLDivElement[] = []
    for (let i = 0; i < pickerItemChildNodes.length; i++) {
      const ele = pickerItemChildNodes[i] as HTMLDivElement
      if (ele.id !== 'sanYuePickerLineTop' && ele.id !== 'sanYuePickerLineBottom') {
        this._listener(ele, i)
        pickerItems.push(ele)
        this.selectIndexs.push(0)
        this.scrollYs.push(0)
      }
    }
    this.pickerItems = pickerItems
  }
  // 渲染选择层
  private renderCol(): NodeElement[] {
    const arr: NodeElement[] = []
    for (let i = 0; i < this.data.length; i++) {
      const wrapper: NodeElement = {
        className: style.pickerItemsColWrapper,
        next: []
      }
      const group: NodeElement = {
        className: style.pickerItemsCol,
        next: [wrapper]
      }
      for (let j = 0; j < this.data[i].length; j++) {
        const next = wrapper.next as NodeElement[]
        next.push({
          className: style.pickerItem,
          next: this.data[i][j].title as string
        })
      }
      arr.push(group)
    }
    return arr
  }
  // 渲染弹出层
  private renderPop() {
    let cols = this.renderCol()
    if (cols && cols.length > 0) {
      const nodeElement: NodeElement = {
        className: style.sanYuePicker,
        id: 'sanYuePicker',
        style: { zIndex: this.zIndex },
        next: [
          {
            className: style.sanYuePickerCover,
            id: 'sanYuePickerCover',
          },
          {
            className: style.sanYuePickerMain,
            id: 'sanYuePickerMain',
            next: [
              {
                className: style.sanYuePickerTouchHeader,
                id: 'sanYuePickerTouchHeader',
                next: [{ className: style.sanYuePickerSlide }]
              },
              { className: style.sanYuePickerTitle, id: 'sanYuePickerTitle', next: '' },
              {
                className: style.pickerItems,
                id: 'pickerItems',
                next: [
                  ...cols,
                  {
                    id: 'sanYuePickerLineTop',
                    className: style.sanYuePickerLineTop,
                  },
                  {
                    id: 'sanYuePickerLineBottom',
                    className: style.sanYuePickerLineBottom,
                  },
                ]
              },
              {
                className: style.sanYuePickerBottom, next: [
                  { className: style.sanYuePickerBtn, next: '取消', id: 'sanYuePickerBtnCancel' },
                  { className: style.sanYuePickerBtnOK, next: '确定', id: 'sanYuePickerBtnOK', style: { color: this.mainColor } },
                ]
              },
            ]
          },
        ],
      }
      document.body.appendChild(createDiv(nodeElement))
      // 过渡动画
      setTimeout(function () {
        document.getElementById('sanYuePickerCover').classList.add(style.sanYuePickerCoverShow)
        document.getElementById('sanYuePickerMain').classList.add(style.absoluteShow)
      }, 20)
      this.event()
      // 构造当前选择
      for (let i = 0; i < this.data.length; i++) {
        // 获取当前选中第几个
        let _index = 0
        if (this.default && typeof (this.default) === 'object' && this.default[i]) _index = getIndex(this.default[i], this.data[i])
        // WARNING 计算偏移值：UI 初始偏移为 0。如果需要选中第一个，则需要偏移 2 * ITEM_HEIGHT 的位置
        const offsetNum = (_index - 2) * ITEM_HEIHT * -1
        this._setOffset(i, offsetNum)
      }
      this.setTitle()
    }
  }
  // 删除元素
  private remove() {
    if (!this.isShow) return
    this.isShow = false
    const sanYuePickerCover = document.getElementById('sanYuePickerCover')
    document.getElementById('sanYuePickerCover').classList.remove(style.sanYuePickerCoverShow)
    const main = document.getElementById('sanYuePickerMain')
    main.classList.remove(style.absoluteShow)
    main.style.transform = `translateY(${FRAME_HEIGHT}px)`
    main.style.webkitTransform = `translateY(${FRAME_HEIGHT}px)`
    sanYuePickerCover.addEventListener('transitionend', function () {
      const main = document.getElementById('sanYuePicker')
      main.parentNode.removeChild(main)
    })
  }

  open() {
    if (this.isShow) return
    this.isShow = true
    this.renderPop()
  }
}
//#endregion

//#region 时间 picker
export interface TimePickerConfig extends BasePickerConfig { }
export class TimePicker extends Picker {
  constructor(config: TimePickerConfig) {
    const H = []
    const M = []
    for (let i = 0; i < 24; i++) {
      const index = i < 10 ? `0${i}` : i + ''
      H.push({
        title: `${index}时`,
        value: i
      })
    }
    for (let i = 0; i < 60; i++) {
      const index = i < 10 ? `0${i}` : i + ''
      M.push({
        title: `${index}分`,
        value: i
      })
    }
    super({
      ...config,
      title: '$0 时 $1 分',
      data: [H, M]
    })
  }
}
//#endregion

//#region 日期 picker
export interface DatePickerConfig extends BasePickerConfig {
  showTime?: boolean,
  minYear?: number,
  maxYear?: number,
}
// TODO 加上根据月份日期限定 / 返回结果再封装
export class DatePicker extends Picker {
  minYear: number
  maxYear: number
  lastY: number
  lastM: number
  reallyChange?: (res: any[]) => void
  constructor(config: DatePickerConfig) {
    const Y = []
    const M = []

    const now = new Date()
    const minYear = config.minYear || now.getFullYear() - 90
    const maxYear = config.maxYear || now.getFullYear() + 10

    for (let i = minYear; i < maxYear; i++) {
      Y.push({
        title: `${i}年`,
        value: i
      })
    }
    for (let i = 0; i < 12; i++) {
      const _i = i + 1
      const index = _i < 10 ? `0${_i}` : _i + ''
      M.push({
        title: `${index}月`,
        value: _i
      })
    }
    const def = config.default || [now.getFullYear(), 1, 1, 0, 0]
    const D = getDay(def[0], def[1])
    const data = [Y, M, D]
    let title = '$0 年 $1 月 $2 日'
    if (config.showTime) {
      const H = []
      const m = []
      for (let i = 0; i < 24; i++) {
        const index = i < 10 ? `0${i}` : i + ''
        H.push({
          title: `${index}时`,
          value: i
        })
      }
      for (let i = 0; i < 60; i++) {
        const index = i < 10 ? `0${i}` : i + ''
        m.push({
          title: `${index}分`,
          value: i
        })
      }
      data.push(H)
      data.push(m)
      title += '$3时$4分'
    }
    super({
      ...config,
      default: def,
      title,
      data
    })
    this.lastY = this.values[0]
    this.lastM = this.values[1]
    this.reallyChange = config.onChange
    this.onChange = (res) => {
      this._changeDate(res)
      this.lastY = this.values[0]
      this.lastM = this.values[1]
    }
  }

  _changeDate(res: any[]) {
    const year = res[0]
    const month = res[1]
    // 只有改了 年月 才去改变 日期
    /**
     * 改变 月份 - 
     * 改变年份 && month 是 2月
     */
    if ((this.lastY !== year && month === 2) || this.lastM !== month) {
      const oldList = this.data[2]
      const newList = getDay(year, month)
      let flag = false
      let _index = 0
      const p = this.pickerItems[2].childNodes[0] as HTMLDivElement
      if (newList.length > oldList.length) {
        // 需要增加
        flag = true
        for (let i = oldList.length; i < newList.length; i++) {
          const item = { className: style.pickerItem, next: newList[i].title as string }
          const ele = createDiv(item)
          p.appendChild(ele)
        }
        _index = getIndex(res[2], newList)
      }
      else if (newList.length < oldList.length) {
        // 需要减少
        flag = true
        for (let i = oldList.length - 1; i > newList.length - 1; i--) {
          const ele = p.childNodes[i] as HTMLDivElement
          const len = newList.length
          _index = getIndex(res[2] >= newList.length ? newList[len - 1].value : res[2], this.data[2])
          p.removeChild(ele)
        }
      }
      if (flag) {
        this.data[2] = newList
        // let _index = getIndex(res[2], this.data[2])
        const offsetNum = (_index - 2) * ITEM_HEIHT * -1
        this._setOffset(2, offsetNum, 1)
      }
      else { this.reallyChange(res) }
    }
    else { this.reallyChange(res) }
  }
}
//#endregion