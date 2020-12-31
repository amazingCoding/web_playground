## Picker
## 简介
使用 typescript 创建的 Picker 组件。没有其他依赖，直接可用。但需要配置环境。如有引入报错，可用参考对应的 typescript 配置环境。
css 使用 css-module 引入。
## 使用
```typescript
const picker = new Picker({
  data:[
    [
      title: '1'
      value: 1
    ],
    [
      title: '2'
      value: 2
    ],
    [
      title: '3'
      value: 3
    ]
  ]
  default: [1],
  onChange: (res) => {
    console.log(res);
  },
  onConfirm: (res) => {
    console.log(res)
  }
})
picker.open()
```
### 通用配置：
```typescript
interface BasePickerConfig {
  default?: any[] // 默认选中值，其中的值对应 data[i][j] 里面的 value
  mainColor?: string, // 选中项目的字体颜色
  btnColor?: string,  // 确认按钮的字体颜色
  changeTitle?: boolean, // 是否需要随着选择变化而更改 title
  onConfirm?: (res: any[]) => void // 确认按钮回调
  onChange?: (res: any[]) => void // 选择变化回调
  zIndex?: number // zIndex 层高。方便在不同项目引入时候不会给其他层级遮挡
}
```
### picker 组件
```typescript
interface PickerItem {
  title: string | number
  value: string | number
}
// 配置
interface PickerConfig extends BasePickerConfig {
  /*
  * 默认开启了 changeTitle。如果需要关联选择结果，使用 $0,$1 对象选择内容
  * 如： title = '$0:$1' 。则选择时间变化会反映到 title 去 - 12:00
  */
  title: string 
  data: PickerItem[][],
}
```
### TimePicker 组件
```typescript
interface TimePickerConfig extends BasePickerConfig { }
const picker = new TimePicker({
  default: [0, 22],
  onChange: (res) => {
    console.log(res);
  },
  onConfirm: (res) => {
    console.log(res)
  }
})
picker.open()
```
### DatePicker 组件
```typescript
interface DatePickerConfig extends BasePickerConfig {
  showTime?: boolean, // 是否开启时间选择器 —— 年月日时分
  minYear?: number, // 最小可选年份：默认为当前年份前 90 年
  maxYear?: number, // 最大可选年份：默认为当前年份后 10 年
}
const picker = new DatePicker({
  default: [2020, 12, 1],
  onChange: (res) => {
    console.log(res);
  },
  onConfirm: (res) => {
    console.log(res)
  }
})
picker.open()
```