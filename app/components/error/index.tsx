import * as React from "react"
import style from "./index.css"
interface ErrorBoundaryState {
  info: Error | null
  componentStack: string | null
}
interface ErrorBoundaryProps {
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    info: null,
    componentStack: ''
  }
  constructor(props: ErrorBoundaryProps) {
    super(props)
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log(error.stack);

    this.setState({ info: error, componentStack: info.componentStack })
  }
  handleTouch() {
    window.location.reload()
  }
  render() {
    if (this.state.info) {
      return (
        <div className={style.app} onClick={() => { window.location.reload() }}>
          <div className={style.titleCenter}>Click & Reload</div>
          <div className={style.title}>Info</div>
          <div className={style.warnning}>{this.state.info.message} </div>
          <div className={style.title}>Stack</div>
          <div className={style.componentStack}>{this.state.info.stack} </div>
          <div className={style.title}>ComponentStack</div>
          <div className={style.componentStack}>{this.state.componentStack}</div>
        </div >
      )
    }
    return this.props.children
  }
}