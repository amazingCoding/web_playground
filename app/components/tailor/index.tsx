import * as React from "react"
import style from './index.css'
import Cropper from 'react-cropper'
import "cropperjs/dist/cropper.css"
import { Button, message } from "antd"

interface TailorProp {
  image: string,
  width: number,
  height: number,
  quality: number,
  onChange?: (res: string) => void
}
export const Tailor: React.FC<TailorProp> = ({ image, onChange, width, height, quality }) => {
  const [imageSrc, setImageSrc] = React.useState<string>(image)
  const cropperRef = React.useRef<HTMLImageElement>(null)
  const handleReadFileImage = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const load = message.loading('loading', 0)
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(e.target.files[0])
    load()
  }, [])
  const onCrop = React.useCallback(() => {
    const imageElement: any = cropperRef?.current
    const cropper: any = imageElement?.cropper
    const data = cropper.getCroppedCanvas().toDataURL('image/png', quality ? quality : 1)
    if (onChange) onChange(data)
  }, [])

  const renderImage = () => {
    if (!imageSrc || imageSrc === '') {
      return (
        <div className={style.nullImage} style={{ height, width }}>
          请选择图片
          <input onChange={handleReadFileImage} type="file" accept="image/png,image/jpg,image/jpeg" className={style.uploadBoxFile} ></input>
        </div>
      )
    }
    else {
      return (
        <Cropper
          src={imageSrc}
          style={{ height, width, backgroundColor: '#ddd' }}
          initialAspectRatio={width / height}
          dragMode='move'
          crop={onCrop}
          ref={cropperRef}
        />
      )
    }
  }
  return (
    <div className={style.tailor} style={{ width }}>
      {renderImage()}
      <div className={style.btnArr}>
        <Button className={style.upBtn}>
          选择图片
          <input onChange={handleReadFileImage} type="file" accept="image/png,image/jpg,image/jpeg" className={style.uploadBoxFile} ></input>
        </Button>
      </div>
    </div>
  )
}